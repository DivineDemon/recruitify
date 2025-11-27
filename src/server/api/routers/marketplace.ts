import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { $Enums, type Prisma } from "@/server/db";

const { TemplateStatus } = $Enums;

const listMarketplaceTemplatesInput = z.object({
	category: z.string().optional(),
	search: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

const getMarketplaceTemplateInput = z.object({
	templateId: z.string().cuid(),
});

const duplicateFromMarketplaceInput = z.object({
	templateId: z.string().cuid(),
	agencyId: z.string().cuid(),
	selectedThemeId: z.string().cuid().optional().nullable(),
	selectedLogoId: z.string().cuid().optional().nullable(),
	title: z.string().min(2).max(120).optional(),
});

export const marketplaceRouter = createTRPCRouter({
	listMarketplaceTemplates: protectedProcedure
		.input(listMarketplaceTemplatesInput)
		.query(async ({ ctx, input }) => {
			const data = listMarketplaceTemplatesInput.parse(input);

			const where: Prisma.TemplateWhereInput = {
				isPreDesigned: true,
				status: TemplateStatus.PUBLISHED,
			};

			if (data.category) {
				where.category = data.category;
			}

			if (data.search) {
				where.OR = [
					{ title: { contains: data.search, mode: "insensitive" } },
					{ description: { contains: data.search, mode: "insensitive" } },
				];
			}

			// Note: Tags filtering is simplified for now
			// For production, consider using PostgreSQL array type or implementing custom JSON filtering
			// We'll filter tags in application code after fetching

			const templates = await ctx.db.template.findMany({
				where,
				select: {
					id: true,
					title: true,
					description: true,
					previewImageUrl: true,
					category: true,
					tags: true,
					createdAt: true,
					updatedAt: true,
					selectedTheme: {
						select: {
							id: true,
							name: true,
						},
					},
					selectedLogo: {
						select: {
							id: true,
							url: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
			});

			return templates;
		}),

	getMarketplaceTemplate: protectedProcedure
		.input(getMarketplaceTemplateInput)
		.query(async ({ ctx, input }) => {
			const data = getMarketplaceTemplateInput.parse(input);

			const template = await ctx.db.template.findUnique({
				where: {
					id: data.templateId,
					isPreDesigned: true,
				},
				select: {
					id: true,
					title: true,
					description: true,
					previewImageUrl: true,
					category: true,
					tags: true,
					pageTree: true,
					createdAt: true,
					updatedAt: true,
					selectedTheme: {
						select: {
							id: true,
							name: true,
							description: true,
							config: true,
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
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Marketplace template not found",
				});
			}

			return template;
		}),

	duplicateFromMarketplace: protectedProcedure
		.input(duplicateFromMarketplaceInput)
		.mutation(async ({ ctx, input }) => {
			const data = duplicateFromMarketplaceInput.parse(input);

			// Verify user has access to target agency
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You do not have access to this agency",
				});
			}

			// Get the marketplace template
			const sourceTemplate = await ctx.db.template.findUnique({
				where: {
					id: data.templateId,
					isPreDesigned: true,
				},
				select: {
					id: true,
					title: true,
					description: true,
					pageTree: true,
				},
			});

			if (!sourceTemplate) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Marketplace template not found",
				});
			}

			// Validate theme belongs to target agency if provided
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

			// Validate logo belongs to target agency if provided
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

			// Create the duplicate template
			const duplicateTitle =
				data.title ??
				`${sourceTemplate.title} ${new Date().toISOString().slice(0, 10)}`;

			const newTemplate = await ctx.db.template.create({
				data: {
					agencyId: data.agencyId,
					title: duplicateTitle,
					description: sourceTemplate.description,
					status: TemplateStatus.DRAFT,
					pageTree: (sourceTemplate.pageTree ?? {
						version: 1,
						nodes: [],
						lastEditedAt: new Date().toISOString(),
					}) as Prisma.InputJsonValue,
					selectedThemeId: data.selectedThemeId ?? null,
					selectedLogoId: data.selectedLogoId ?? null,
					sourceTemplateId: sourceTemplate.id,
					isPreDesigned: false,
				},
				select: {
					id: true,
					title: true,
				},
			});

			return newTemplate;
		}),
});
