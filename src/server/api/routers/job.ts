import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { $Enums, type Prisma } from "@/server/db";

const { EmploymentType, JobStatus } = $Enums;

const metadataSchema = z.record(z.any()).optional();

const createJobInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid().optional(),
	title: z.string().min(3).max(160),
	slug: z
		.string()
		.min(3)
		.max(80)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
		.optional(),
	description: z.string().min(1),
	location: z.string().max(120).optional(),
	employmentType: z
		.nativeEnum(EmploymentType)
		.default(EmploymentType.FULL_TIME),
	salaryMin: z.number().int().nonnegative().optional(),
	salaryMax: z.number().int().nonnegative().optional(),
	currency: z.string().length(3).optional(),
	status: z.nativeEnum(JobStatus).default(JobStatus.DRAFT),
	metadata: metadataSchema,
});

const listJobsInput = z.object({
	agencyId: z.string().cuid(),
	status: z.nativeEnum(JobStatus).optional(),
});

const updateJobInput = z.object({
	jobId: z.string().cuid(),
	title: z.string().min(3).max(160).optional(),
	description: z.string().min(1).optional(),
	location: z.string().max(120).optional().nullable(),
	employmentType: z.nativeEnum(EmploymentType).optional(),
	salaryMin: z.number().int().nonnegative().nullable().optional(),
	salaryMax: z.number().int().nonnegative().nullable().optional(),
	currency: z.string().length(3).nullable().optional(),
	metadata: metadataSchema,
	templateId: z.string().cuid().nullable().optional(),
});

const updateJobStatusInput = z.object({
	jobId: z.string().cuid(),
	status: z.nativeEnum(JobStatus),
});

export const jobRouter = createTRPCRouter({
	create: publicProcedure
		.input(createJobInput)
		.mutation(async ({ ctx, input }) => {
			const data = createJobInput.parse(input);
			if (
				typeof data.salaryMin === "number" &&
				typeof data.salaryMax === "number" &&
				data.salaryMax < data.salaryMin
			) {
				throw new Error(
					"Salary max must be greater than or equal to salary min.",
				);
			}

			return ctx.db.job.create({
				data: {
					agencyId: data.agencyId,
					templateId: data.templateId,
					title: data.title,
					slug: data.slug,
					description: data.description,
					location: data.location,
					employmentType: data.employmentType,
					salaryMin: data.salaryMin,
					salaryMax: data.salaryMax,
					currency: data.currency?.toUpperCase(),
					status: data.status,
					metadata: data.metadata,
					publishedAt: data.status === JobStatus.OPEN ? new Date() : undefined,
				},
			});
		}),

	list: publicProcedure.input(listJobsInput).query(async ({ ctx, input }) => {
		const data = listJobsInput.parse(input);
		const where: Prisma.JobWhereInput = {
			agencyId: data.agencyId,
			status: data.status,
		};

		return ctx.db.job.findMany({
			where,
			orderBy: { updatedAt: "desc" },
		});
	}),

	update: publicProcedure
		.input(updateJobInput)
		.mutation(async ({ ctx, input }) => {
			const data = updateJobInput.parse(input);
			const update: Prisma.JobUpdateInput = {};

			if (typeof data.title === "string") update.title = data.title;
			if (typeof data.description === "string")
				update.description = data.description;
			if ("location" in data) update.location = data.location ?? null;
			if (data.employmentType) update.employmentType = data.employmentType;
			if ("salaryMin" in data) update.salaryMin = data.salaryMin ?? null;
			if ("salaryMax" in data) update.salaryMax = data.salaryMax ?? null;
			if ("currency" in data)
				update.currency = data.currency?.toUpperCase() ?? null;
			if (data.metadata) update.metadata = data.metadata;
			if ("templateId" in data)
				update.template = data.templateId
					? { connect: { id: data.templateId } }
					: { disconnect: true };

			return ctx.db.job.update({
				where: { id: data.jobId },
				data: update,
			});
		}),

	updateStatus: publicProcedure
		.input(updateJobStatusInput)
		.mutation(async ({ ctx, input }) => {
			const data = updateJobStatusInput.parse(input);
			return ctx.db.job.update({
				where: { id: data.jobId },
				data: {
					status: data.status,
					publishedAt: data.status === JobStatus.OPEN ? new Date() : undefined,
				},
			});
		}),
});
