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
	selectedThemeId: z.string().cuid().optional().nullable(),
	selectedLogoId: z.string().cuid().optional().nullable(),
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
	selectedThemeId: z.string().cuid().optional().nullable(),
	selectedLogoId: z.string().cuid().optional().nullable(),
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

const getTemplateInput = z.object({
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

			// Validate theme belongs to agency if provided
			if (data.selectedThemeId) {
				const theme = await ctx.db.theme.findUnique({
					where: { id: data.selectedThemeId },
					select: { agencyId: true },
				});

				if (!theme) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Theme not found",
					});
				}

				if (theme.agencyId !== data.agencyId) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Theme does not belong to this agency",
					});
				}
			}

			// Validate logo belongs to agency if provided
			if (data.selectedLogoId) {
				const logo = await ctx.db.mediaAsset.findUnique({
					where: { id: data.selectedLogoId },
					select: { agencyId: true, type: true },
				});

				if (!logo) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Logo not found",
					});
				}

				if (logo.agencyId !== data.agencyId) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Logo does not belong to this agency",
					});
				}

				if (logo.type !== "LOGO") {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Selected media asset is not a logo",
					});
				}
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
					selectedThemeId: data.selectedThemeId ?? null,
					selectedLogoId: data.selectedLogoId ?? null,
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

			// Validate theme belongs to agency if provided
			if (data.selectedThemeId !== undefined) {
				if (data.selectedThemeId) {
					const theme = await ctx.db.theme.findUnique({
						where: { id: data.selectedThemeId },
						select: { agencyId: true },
					});

					if (!theme) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Theme not found",
						});
					}

					if (theme.agencyId !== template.agencyId) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Theme does not belong to this agency",
						});
					}
				}
			}

			// Validate logo belongs to agency if provided
			if (data.selectedLogoId !== undefined) {
				if (data.selectedLogoId) {
					const logo = await ctx.db.mediaAsset.findUnique({
						where: { id: data.selectedLogoId },
						select: { agencyId: true, type: true },
					});

					if (!logo) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Logo not found",
						});
					}

					if (logo.agencyId !== template.agencyId) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Logo does not belong to this agency",
						});
					}

					if (logo.type !== "LOGO") {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Selected media asset is not a logo",
						});
					}
				}
			}

			const update: Prisma.TemplateUpdateInput & {
				selectedThemeId?: string | null;
				selectedLogoId?: string | null;
			} = {};

			if (typeof data.title === "string") update.title = data.title;
			if ("description" in data) update.description = data.description ?? null;
			if (data.status) update.status = data.status;
			if ("selectedThemeId" in data) {
				update.selectedThemeId = data.selectedThemeId ?? null;
			}
			if ("selectedLogoId" in data) {
				update.selectedLogoId = data.selectedLogoId ?? null;
			}

			return ctx.db.template.update({
				where: { id: data.templateId },
				data: update as Prisma.TemplateUpdateInput,
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
				select: {
					agencyId: true,
					title: true,
					description: true,
					pageTree: true,
					selectedThemeId: true,
					selectedLogoId: true,
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
					selectedThemeId: template.selectedThemeId,
					selectedLogoId: template.selectedLogoId,
				},
			});
		}),

	get: protectedProcedure
		.input(getTemplateInput)
		.query(async ({ ctx, input }) => {
			const data = getTemplateInput.parse(input);
			const template = await ctx.db.template.findUnique({
				where: { id: data.templateId },
				select: {
					id: true,
					agencyId: true,
					title: true,
					description: true,
					status: true,
					pageTree: true,
					createdAt: true,
					updatedAt: true,
					analyticsSummary: true,
					publishedVersionId: true,
					selectedThemeId: true,
					selectedLogoId: true,
					selectedTheme: {
						select: {
							id: true,
							name: true,
							description: true,
							isDefault: true,
						},
					},
					selectedLogo: {
						select: {
							id: true,
							url: true,
							type: true,
						},
					},
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

			return template;
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
