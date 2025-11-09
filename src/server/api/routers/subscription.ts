import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
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
	get: publicProcedure
		.input(getSubscriptionInput)
		.query(async ({ ctx, input }) => {
			const data = getSubscriptionInput.parse(input);
			return ctx.db.subscription.findUnique({
				where: { agencyId: data.agencyId },
			});
		}),

	syncStripe: publicProcedure
		.input(syncStripeInput)
		.mutation(async ({ ctx, input }) => {
			const data = syncStripeInput.parse(input);
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

	updatePlan: publicProcedure
		.input(updatePlanInput)
		.mutation(async ({ ctx, input }) => {
			const data = updatePlanInput.parse(input);
			return ctx.db.subscription.update({
				where: { agencyId: data.agencyId },
				data: {
					plan: data.plan,
					status: data.status ?? SubscriptionStatus.ACTIVE,
				},
			});
		}),
});
