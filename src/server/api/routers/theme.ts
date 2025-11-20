import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Prisma } from "@/server/db";
import { parseThemeConfig } from "@/types/theme";

const listThemesInput = z.object({
	agencyId: z.string().cuid(),
});

const getThemeInput = z.object({
	themeId: z.string().cuid(),
});

const createThemeInput = z.object({
	agencyId: z.string().cuid(),
	name: z.string().min(1).max(120),
	description: z.string().max(512).optional().nullable(),
	config: z.any(), // Will be validated with parseThemeConfig
	isDefault: z.boolean().optional().default(false),
});

const updateThemeInput = z.object({
	themeId: z.string().cuid(),
	name: z.string().min(1).max(120).optional(),
	description: z.string().max(512).optional().nullable(),
});

const setDefaultThemeInput = z.object({
	themeId: z.string().cuid(),
});

const deleteThemeInput = z.object({
	themeId: z.string().cuid(),
});

export const themeRouter = createTRPCRouter({
	create: protectedProcedure
		.input(createThemeInput)
		.mutation(async ({ ctx, input }) => {
			const data = createThemeInput.parse(input);

			// Check membership
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			// Validate theme config
			const validatedConfig = parseThemeConfig(data.config);

			// If setting as default, ensure only one default exists
			if (data.isDefault) {
				// Use transaction to ensure atomicity
				return ctx.db.$transaction(async (tx) => {
					// Unset all other default themes for this agency
					await tx.theme.updateMany({
						where: {
							agencyId: data.agencyId,
							isDefault: true,
						},
						data: {
							isDefault: false,
						},
					});

					// Create new theme as default
					return tx.theme.create({
						data: {
							agencyId: data.agencyId,
							name: data.name,
							description: data.description,
							config: validatedConfig as unknown as Prisma.InputJsonValue,
							isDefault: true,
						},
					});
				});
			}

			// Create theme without setting as default
			return ctx.db.theme.create({
				data: {
					agencyId: data.agencyId,
					name: data.name,
					description: data.description,
					config: validatedConfig as unknown as Prisma.InputJsonValue,
					isDefault: false,
				},
			});
		}),

	list: protectedProcedure
		.input(listThemesInput)
		.query(async ({ ctx, input }) => {
			const data = listThemesInput.parse(input);

			// Check membership
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: data.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return ctx.db.theme.findMany({
				where: {
					agencyId: data.agencyId,
				},
				orderBy: [
					{ isDefault: "desc" }, // Default theme first
					{ createdAt: "desc" },
				],
			});
		}),

	getById: protectedProcedure
		.input(getThemeInput)
		.query(async ({ ctx, input }) => {
			const data = getThemeInput.parse(input);

			const theme = await ctx.db.theme.findUnique({
				where: { id: data.themeId },
				include: {
					agency: {
						select: {
							id: true,
						},
					},
				},
			});

			if (!theme) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			// Check membership
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: theme.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return theme;
		}),

	update: protectedProcedure
		.input(updateThemeInput)
		.mutation(async ({ ctx, input }) => {
			const data = updateThemeInput.parse(input);

			const theme = await ctx.db.theme.findUnique({
				where: { id: data.themeId },
				select: {
					agencyId: true,
				},
			});

			if (!theme) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			// Check membership
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: theme.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			// Build update data (only name/description, not config)
			const updateData: {
				name?: string;
				description?: string | null;
			} = {};

			if (data.name !== undefined) {
				updateData.name = data.name;
			}

			if (data.description !== undefined) {
				updateData.description = data.description;
			}

			return ctx.db.theme.update({
				where: { id: data.themeId },
				data: updateData,
			});
		}),

	setDefault: protectedProcedure
		.input(setDefaultThemeInput)
		.mutation(async ({ ctx, input }) => {
			const data = setDefaultThemeInput.parse(input);

			const theme = await ctx.db.theme.findUnique({
				where: { id: data.themeId },
				select: {
					agencyId: true,
					isDefault: true,
				},
			});

			if (!theme) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			// Check membership
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: theme.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			// If already default, no-op
			if (theme.isDefault) {
				return ctx.db.theme.findUnique({
					where: { id: data.themeId },
				});
			}

			// Use transaction to ensure only one default exists
			return ctx.db.$transaction(async (tx) => {
				// Unset all other default themes for this agency
				await tx.theme.updateMany({
					where: {
						agencyId: theme.agencyId,
						isDefault: true,
					},
					data: {
						isDefault: false,
					},
				});

				// Set this theme as default
				return tx.theme.update({
					where: { id: data.themeId },
					data: {
						isDefault: true,
					},
				});
			});
		}),

	delete: protectedProcedure
		.input(deleteThemeInput)
		.mutation(async ({ ctx, input }) => {
			const data = deleteThemeInput.parse(input);

			const theme = await ctx.db.theme.findUnique({
				where: { id: data.themeId },
				include: {
					templates: {
						select: {
							id: true,
						},
						take: 1,
					},
				},
			});

			if (!theme) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			// Check membership
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: theme.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			// Cannot delete default theme
			if (theme.isDefault) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"Cannot delete the default theme. Set another theme as default first.",
				});
			}

			// Cannot delete theme if it's in use by templates
			if (theme.templates.length > 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Cannot delete theme that is in use by templates.",
				});
			}

			return ctx.db.theme.delete({
				where: { id: data.themeId },
			});
		}),
});
