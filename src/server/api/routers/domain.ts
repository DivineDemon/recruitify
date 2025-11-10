import { randomUUID } from "node:crypto";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { $Enums, type Prisma } from "@/server/db";

const { DomainStatus, DomainType } = $Enums;

const hostnameRegex = /^(?=.{3,255}$)(?!-)(?!.*--)[a-z0-9-]+(\.[a-z0-9-]+)+$/;

const registerDomainInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid().optional(),
	hostname: z
		.string()
		.min(3)
		.max(255)
		.regex(hostnameRegex, "Invalid hostname."),
	type: z.nativeEnum(DomainType),
});

const listDomainsInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid().optional(),
});

const updateDomainStatusInput = z.object({
	domainId: z.string().cuid(),
	status: z.nativeEnum(DomainStatus),
	error: z.string().max(512).optional(),
	lastCheckedAt: z.date().optional(),
	dnsRecords: z.record(z.any()).optional(),
});

const deleteDomainInput = z.object({
	domainId: z.string().cuid(),
});

export const domainRouter = createTRPCRouter({
	register: protectedProcedure
		.input(registerDomainInput)
		.mutation(async ({ ctx, input }) => {
			const data = registerDomainInput.parse(input);
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const verificationToken =
				data.type === DomainType.CUSTOM ? randomUUID() : null;

			return ctx.db.domain.create({
				data: {
					agencyId: data.agencyId,
					templateId: data.templateId,
					hostname: data.hostname.toLowerCase(),
					type: data.type,
					status:
						data.type === DomainType.SUBDOMAIN
							? DomainStatus.ACTIVE
							: DomainStatus.PENDING,
					verificationToken,
					dnsRecords:
						data.type === DomainType.SUBDOMAIN
							? {
									aRecord: "edge.recruitify.dev",
								}
							: undefined,
				},
			});
		}),

	list: protectedProcedure
		.input(listDomainsInput)
		.query(async ({ ctx, input }) => {
			const data = listDomainsInput.parse(input);
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const where: Prisma.DomainWhereInput = {
				agencyId: data.agencyId,
				templateId: data.templateId,
			};

			return ctx.db.domain.findMany({
				where,
				orderBy: { createdAt: "desc" },
			});
		}),

	updateStatus: protectedProcedure
		.input(updateDomainStatusInput)
		.mutation(async ({ ctx, input }) => {
			const data = updateDomainStatusInput.parse(input);
			const domain = await ctx.db.domain.findUnique({
				where: { id: data.domainId },
				select: { agencyId: true },
			});

			if (!domain) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: domain.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.domain.update({
				where: { id: data.domainId },
				data: {
					status: data.status,
					lastCheckedAt: data.lastCheckedAt ?? new Date(),
					dnsRecords: data.dnsRecords,
				},
			});
		}),

	remove: protectedProcedure
		.input(deleteDomainInput)
		.mutation(async ({ ctx, input }) => {
			const data = deleteDomainInput.parse(input);
			const domain = await ctx.db.domain.findUnique({
				where: { id: data.domainId },
				select: { agencyId: true },
			});

			if (!domain) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: domain.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.domain.delete({
				where: { id: data.domainId },
			});
		}),
});
