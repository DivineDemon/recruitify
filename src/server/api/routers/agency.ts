import { randomUUID } from "node:crypto";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { $Enums } from "@/server/db";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const { AgencyRole, SubscriptionPlan, SubscriptionStatus } = $Enums;

const createAgencyInput = z.object({
	slug: z
		.string()
		.min(3)
		.max(48)
		.regex(slugRegex, "Slug must be kebab-case and lowercase."),
	displayName: z.string().min(2).max(120),
	description: z.string().max(512).optional(),
	plan: z.nativeEnum(SubscriptionPlan).optional(),
});

const getAgencyBySlugInput = z.object({
	slug: z.string().min(1),
});

export const agencyRouter = createTRPCRouter({
	create: protectedProcedure
		.input(createAgencyInput)
		.mutation(async ({ ctx, input }) => {
			const data = createAgencyInput.parse(input);
			const owner = ctx.user;
			const now = new Date();
			const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

			const result = await ctx.db.$transaction(async (tx) => {
				const agency = await tx.agency.create({
					data: {
						slug: data.slug,
						displayName: data.displayName,
						description: data.description,
						members: {
							create: {
								userId: owner.id,
								role: AgencyRole.OWNER,
								invitedAt: now,
								acceptedAt: now,
							},
						},
					},
					include: {
						members: {
							include: {
								user: true,
							},
						},
					},
				});

				await tx.subscription.create({
					data: {
						agencyId: agency.id,
						stripeCustomerId: `pending_${randomUUID()}`,
						plan: data.plan ?? SubscriptionPlan.BASIC,
						status: SubscriptionStatus.TRIALING,
						trialEndsAt,
						currentPeriodEnd: trialEndsAt,
						metadata: {
							initializedVia: "manual",
						},
					},
				});

				return agency;
			});

			return result;
		}),

	listForUser: protectedProcedure.query(async ({ ctx }) => {
		const memberships = await ctx.db.agencyMember.findMany({
			where: { userId: ctx.user.id },
			include: {
				agency: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return memberships.map((membership) => ({
			agency: membership.agency,
			role: membership.role,
		}));
	}),

	bySlug: protectedProcedure
		.input(getAgencyBySlugInput)
		.query(async ({ ctx, input }) => {
			const data = getAgencyBySlugInput.parse(input);
			const agency = await ctx.db.agency.findUnique({
				where: { slug: data.slug },
				include: {
					members: {
						include: {
							user: true,
						},
						orderBy: { createdAt: "asc" },
					},
				},
			});

			if (!agency) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const isMember = agency.members.some(
				(member) => member.userId === ctx.user.id,
			);

			if (!isMember) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const [templateCount, jobCount, domainCount, applicationCount] =
				await Promise.all([
					ctx.db.template.count({ where: { agencyId: agency.id } }),
					ctx.db.job.count({ where: { agencyId: agency.id } }),
					ctx.db.domain.count({ where: { agencyId: agency.id } }),
					ctx.db.application.count({ where: { agencyId: agency.id } }),
				]);

			return {
				agency,
				metrics: {
					templateCount,
					jobCount,
					domainCount,
					applicationCount,
				},
			};
		}),
});
