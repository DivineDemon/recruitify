import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { $Enums, type Prisma } from "@/server/db";

const { TemplateStatus } = $Enums;

const jsonSchema = z.any();

const createTemplateInput = z.object({
	agencyId: z.string().cuid(),
	title: z.string().min(2).max(120),
	description: z.string().max(512).optional(),
	pageTree: jsonSchema.optional(),
});

const listTemplatesInput = z.object({
	agencyId: z.string().cuid(),
	status: z.nativeEnum(TemplateStatus).optional(),
});

const updateTemplateMetaInput = z.object({
	templateId: z.string().cuid(),
	title: z.string().min(2).max(120).optional(),
	description: z.string().max(512).nullable().optional(),
	status: z.nativeEnum(TemplateStatus).optional(),
});

const updateTemplateTreeInput = z.object({
	templateId: z.string().cuid(),
	pageTree: jsonSchema,
});

const publishTemplateInput = z.object({
	templateId: z.string().cuid(),
	notes: z.string().max(512).optional(),
	domainId: z.string().cuid().optional(),
});

const duplicateTemplateInput = z.object({
	templateId: z.string().cuid(),
	title: z.string().min(2).max(120).optional(),
});

const archiveTemplateInput = z.object({
	templateId: z.string().cuid(),
});

export const templateRouter = createTRPCRouter({
	create: protectedProcedure
		.input(createTemplateInput)
		.mutation(async ({ ctx, input }) => {
			const data = createTemplateInput.parse(input);
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const defaultTree: Prisma.JsonObject = {
				version: 1,
				nodes: [],
				lastEditedAt: new Date().toISOString(),
			};
			const pageTree = (data.pageTree ?? defaultTree) as Prisma.InputJsonValue;

			return ctx.db.template.create({
				data: {
					agencyId: data.agencyId,
					title: data.title,
					description: data.description,
					status: TemplateStatus.DRAFT,
					pageTree,
				},
			});
		}),

	list: protectedProcedure
		.input(listTemplatesInput)
		.query(async ({ ctx, input }) => {
			const data = listTemplatesInput.parse(input);
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const where: Prisma.TemplateWhereInput = {
				agencyId: data.agencyId,
				status: data.status,
			};

			return ctx.db.template.findMany({
				where,
				orderBy: { updatedAt: "desc" },
				select: {
					id: true,
					title: true,
					description: true,
					status: true,
					createdAt: true,
					updatedAt: true,
					analyticsSummary: true,
					publishedVersionId: true,
				},
			});
		}),

	updateMetadata: protectedProcedure
		.input(updateTemplateMetaInput)
		.mutation(async ({ ctx, input }) => {
			const data = updateTemplateMetaInput.parse(input);
			const template = await ctx.db.template.findUnique({
				where: { id: data.templateId },
				select: { agencyId: true },
			});

			if (!template) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: template.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const update: Prisma.TemplateUpdateInput = {};

			if (typeof data.title === "string") update.title = data.title;
			if ("description" in data) update.description = data.description ?? null;
			if (data.status) update.status = data.status;

			return ctx.db.template.update({
				where: { id: data.templateId },
				data: update,
			});
		}),

	updatePageTree: protectedProcedure
		.input(updateTemplateTreeInput)
		.mutation(async ({ ctx, input }) => {
			const data = updateTemplateTreeInput.parse(input);
			const template = await ctx.db.template.findUnique({
				where: { id: data.templateId },
				select: { agencyId: true },
			});

			if (!template) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: template.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.template.update({
				where: { id: data.templateId },
				data: {
					pageTree: data.pageTree,
					updatedAt: new Date(),
				},
			});
		}),

	publish: protectedProcedure
		.input(publishTemplateInput)
		.mutation(async ({ ctx, input }) => {
			const data = publishTemplateInput.parse(input);
			const template = await ctx.db.template.findUnique({
				where: { id: data.templateId },
				select: {
					id: true,
					agencyId: true,
					pageTree: true,
					status: true,
				},
			});

			if (!template) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: template.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const latestVersion = await ctx.db.templateVersion.aggregate({
				where: { templateId: template.id },
				_max: { version: true },
			});

			const nextVersion = (latestVersion._max.version ?? 0) + 1;

			const now = new Date();

			return ctx.db.$transaction(async (tx) => {
				const pageTreeForVersion = (template.pageTree ?? {
					version: 1,
					nodes: [],
					lastEditedAt: now.toISOString(),
				}) as Prisma.InputJsonValue;

				const version = await tx.templateVersion.create({
					data: {
						templateId: template.id,
						version: nextVersion,
						pageTree: pageTreeForVersion,
						notes: data.notes,
						publishedAt: now,
					},
				});

				const updatedTemplate = await tx.template.update({
					where: { id: template.id },
					data: {
						status: TemplateStatus.PUBLISHED,
						publishedVersionId: version.id,
					},
				});

				await tx.publishRecord.create({
					data: {
						templateId: template.id,
						templateVersionId: version.id,
						domainId: data.domainId,
						publishedAt: now,
						notes: data.notes,
					},
				});

				return updatedTemplate;
			});
		}),

	duplicate: protectedProcedure
		.input(duplicateTemplateInput)
		.mutation(async ({ ctx, input }) => {
			const data = duplicateTemplateInput.parse(input);
			const template = await ctx.db.template.findUnique({
				where: { id: data.templateId },
			});

			if (!template) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: template.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			const cloneTitle =
				data.title ??
				`${template.title} Copy ${new Date().toISOString().slice(0, 10)}`;

			return ctx.db.template.create({
				data: {
					agencyId: template.agencyId,
					title: cloneTitle,
					description: template.description,
					status: TemplateStatus.DRAFT,
					pageTree: (template.pageTree ?? {
						version: 1,
						nodes: [],
						lastEditedAt: new Date().toISOString(),
					}) as Prisma.InputJsonValue,
				},
			});
		}),

	archive: protectedProcedure
		.input(archiveTemplateInput)
		.mutation(async ({ ctx, input }) => {
			const data = archiveTemplateInput.parse(input);
			const template = await ctx.db.template.findUnique({
				where: { id: data.templateId },
				select: { agencyId: true },
			});

			if (!template) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: template.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.template.update({
				where: { id: data.templateId },
				data: {
					status: TemplateStatus.ARCHIVED,
				},
			});
		}),
});
