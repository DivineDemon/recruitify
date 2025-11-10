import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { $Enums, type Prisma } from "@/server/db";

const { ApplicationStatus } = $Enums;

const applicationMetadataSchema = z.record(z.any()).optional();

const submitApplicationInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid(),
	jobId: z.string().cuid().optional(),
	applicantName: z.string().min(2).max(120),
	applicantEmail: z.string().email(),
	applicantPhone: z.string().max(40).optional(),
	linkedinUrl: z.string().url().optional(),
	portfolioUrl: z.string().url().optional(),
	resumeUrl: z.string().url().optional(),
	coverLetter: z.string().max(5000).optional(),
	source: z.string().max(120).optional(),
	metadata: applicationMetadataSchema,
});

const listApplicationsInput = z.object({
	agencyId: z.string().cuid(),
	status: z.nativeEnum(ApplicationStatus).optional(),
	jobId: z.string().cuid().optional(),
});

const updateApplicationStatusInput = z.object({
	applicationId: z.string().cuid(),
	status: z.nativeEnum(ApplicationStatus),
	note: z.string().max(512).optional(),
	actorId: z.string().cuid().optional(),
});

const addApplicationEventInput = z.object({
	applicationId: z.string().cuid(),
	type: z.string().min(1),
	note: z.string().max(512).optional(),
	data: z.record(z.any()).optional(),
	actorId: z.string().cuid().optional(),
});

export const applicationRouter = createTRPCRouter({
	submit: publicProcedure
		.input(submitApplicationInput)
		.mutation(async ({ ctx, input }) => {
			const data = submitApplicationInput.parse(input);
			return ctx.db.application.create({
				data: {
					agencyId: data.agencyId,
					templateId: data.templateId,
					jobId: data.jobId,
					applicantName: data.applicantName,
					applicantEmail: data.applicantEmail,
					applicantPhone: data.applicantPhone,
					linkedinUrl: data.linkedinUrl,
					portfolioUrl: data.portfolioUrl,
					resumeUrl: data.resumeUrl,
					coverLetter: data.coverLetter,
					source: data.source,
					metadata: data.metadata,
				},
			});
		}),

	list: protectedProcedure
		.input(listApplicationsInput)
		.query(async ({ ctx, input }) => {
			const data = listApplicationsInput.parse(input);
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const where: Prisma.ApplicationWhereInput = {
				agencyId: data.agencyId,
				status: data.status,
				jobId: data.jobId,
			};

			return ctx.db.application.findMany({
				where,
				orderBy: { submittedAt: "desc" },
				include: {
					job: {
						select: {
							id: true,
							title: true,
							status: true,
						},
					},
				},
			});
		}),

	updateStatus: protectedProcedure
		.input(updateApplicationStatusInput)
		.mutation(async ({ ctx, input }) => {
			const data = updateApplicationStatusInput.parse(input);
			const application = await ctx.db.application.findUnique({
				where: { id: data.applicationId },
				select: { agencyId: true },
			});

			if (!application) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: application.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.application.update({
				where: { id: data.applicationId },
				data: {
					status: data.status,
					events: {
						create: {
							type: "STATUS_CHANGE",
							note: data.note,
							data: {
								status: data.status,
							},
							actorId: ctx.user.id,
						},
					},
				},
				include: {
					events: {
						orderBy: { createdAt: "desc" },
						take: 1,
					},
				},
			});
		}),

	addEvent: protectedProcedure
		.input(addApplicationEventInput)
		.mutation(async ({ ctx, input }) => {
			const data = addApplicationEventInput.parse(input);

			const application = await ctx.db.application.findUnique({
				where: { id: data.applicationId },
				select: { agencyId: true },
			});

			if (!application) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: application.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.applicationEvent.create({
				data: {
					applicationId: data.applicationId,
					type: data.type,
					note: data.note,
					data: data.data,
					actorId: ctx.user.id,
				},
			});
		}),
});
