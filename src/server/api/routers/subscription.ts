import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { $Enums } from "@/server/db";

const { SubscriptionPlan, SubscriptionStatus } = $Enums;

const getSubscriptionInput = z.object({
	agencyId: z.string().cuid(),
});

const syncStripeInput = z.object({
	agencyId: z.string().cuid(),
	stripeCustomerId: z.string().min(1),
	stripeSubscriptionId: z.string().min(1).optional(),
	plan: z.nativeEnum(SubscriptionPlan),
	status: z.nativeEnum(SubscriptionStatus),
	trialEndsAt: z.coerce.date().optional(),
	currentPeriodEnd: z.coerce.date().optional(),
	cancelAt: z.coerce.date().optional(),
	cancelAtPeriodEnd: z.boolean().optional(),
	metadata: z.record(z.any()).optional(),
});

const updatePlanInput = z.object({
	agencyId: z.string().cuid(),
	plan: z.nativeEnum(SubscriptionPlan),
	status: z.nativeEnum(SubscriptionStatus).optional(),
});

export const subscriptionRouter = createTRPCRouter({
	get: protectedProcedure
		.input(getSubscriptionInput)
		.query(async ({ ctx, input }) => {
			const data = getSubscriptionInput.parse(input);
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.subscription.findUnique({
				where: { agencyId: data.agencyId },
			});
		}),

	syncStripe: protectedProcedure
		.input(syncStripeInput)
		.mutation(async ({ ctx, input }) => {
			const data = syncStripeInput.parse(input);
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.subscription.update({
				where: { agencyId: data.agencyId },
				data: {
					stripeCustomerId: data.stripeCustomerId,
					stripeSubscriptionId: data.stripeSubscriptionId,
					plan: data.plan,
					status: data.status,
					trialEndsAt: data.trialEndsAt,
					currentPeriodEnd: data.currentPeriodEnd,
					cancelAt: data.cancelAt,
					cancelAtPeriodEnd: data.cancelAtPeriodEnd,
					metadata: data.metadata,
				},
			});
		}),

	updatePlan: protectedProcedure
		.input(updatePlanInput)
		.mutation(async ({ ctx, input }) => {
			const data = updatePlanInput.parse(input);
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.subscription.update({
				where: { agencyId: data.agencyId },
				data: {
					plan: data.plan,
					status: data.status ?? SubscriptionStatus.ACTIVE,
				},
			});
		}),
});
