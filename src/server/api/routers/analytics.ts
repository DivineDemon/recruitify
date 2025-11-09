import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { $Enums, type Prisma } from "@/server/db";

const { AnalyticsEventType } = $Enums;

const recordAnalyticsEventInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid(),
	domainId: z.string().cuid().optional(),
	type: z.nativeEnum(AnalyticsEventType),
	sessionId: z.string().max(64).optional(),
	payload: z.record(z.any()).optional(),
});

const getSummaryInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid().optional(),
	domainId: z.string().cuid().optional(),
	days: z.number().int().positive().max(180).default(30),
});

const getEventsInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid().optional(),
	type: z.nativeEnum(AnalyticsEventType).optional(),
	limit: z.number().int().positive().max(500).default(100),
});

export const analyticsRouter = createTRPCRouter({
	recordEvent: publicProcedure
		.input(recordAnalyticsEventInput)
		.mutation(async ({ ctx, input }) => {
			const data = recordAnalyticsEventInput.parse(input);
			return ctx.db.analyticsEvent.create({
				data: {
					agencyId: data.agencyId,
					templateId: data.templateId,
					domainId: data.domainId,
					type: data.type,
					sessionId: data.sessionId,
					payload: data.payload,
				},
			});
		}),

	getSummary: publicProcedure
		.input(getSummaryInput)
		.query(async ({ ctx, input }) => {
			const data = getSummaryInput.parse(input);
			const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000);

			const aggregateWhere: Prisma.AnalyticsDailyAggregateWhereInput = {
				agencyId: data.agencyId,
				templateId: data.templateId,
				domainId: data.domainId,
				date: {
					gte: since,
				},
			};

			const [series, totals] = await Promise.all([
				ctx.db.analyticsDailyAggregate.findMany({
					where: aggregateWhere,
					orderBy: { date: "asc" },
					select: {
						date: true,
						views: true,
						applicationStarts: true,
						submissions: true,
						conversionRate: true,
					},
				}),
				ctx.db.analyticsDailyAggregate.aggregate({
					where: aggregateWhere,
					_sum: {
						views: true,
						applicationStarts: true,
						submissions: true,
					},
				}),
			]);

			const views = totals._sum.views ?? 0;
			const starts = totals._sum.applicationStarts ?? 0;
			const submissions = totals._sum.submissions ?? 0;
			const conversionRate =
				views > 0 ? Number(((submissions / views) * 100).toFixed(2)) : 0;

			return {
				series,
				totals: {
					views,
					applicationStarts: starts,
					submissions,
					conversionRate,
				},
			};
		}),

	getRecentEvents: publicProcedure
		.input(getEventsInput)
		.query(async ({ ctx, input }) => {
			const data = getEventsInput.parse(input);
			const where: Prisma.AnalyticsEventWhereInput = {
				agencyId: data.agencyId,
				templateId: data.templateId,
				type: data.type,
			};

			return ctx.db.analyticsEvent.findMany({
				where,
				orderBy: { occurredAt: "desc" },
				take: data.limit,
				select: {
					id: true,
					type: true,
					occurredAt: true,
					sessionId: true,
					payload: true,
					domainId: true,
					templateId: true,
				},
			});
		}),
});
