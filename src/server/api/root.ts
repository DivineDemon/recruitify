import { agencyRouter } from "@/server/api/routers/agency";
import { analyticsRouter } from "@/server/api/routers/analytics";
import { applicationRouter } from "@/server/api/routers/application";
import { domainRouter } from "@/server/api/routers/domain";
import { jobRouter } from "@/server/api/routers/job";
import { marketplaceRouter } from "@/server/api/routers/marketplace";
import { mediaRouter } from "@/server/api/routers/media";
import { subscriptionRouter } from "@/server/api/routers/subscription";
import { templateRouter } from "@/server/api/routers/template";
import { themeRouter } from "@/server/api/routers/theme";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
	agency: agencyRouter,
	template: templateRouter,
	job: jobRouter,
	application: applicationRouter,
	domain: domainRouter,
	subscription: subscriptionRouter,
	analytics: analyticsRouter,
	theme: themeRouter,
	media: mediaRouter,
	marketplace: marketplaceRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
