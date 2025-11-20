import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { $Enums, type Prisma } from "@/server/db";

const { MediaAssetType } = $Enums;

const listMediaAssetsInput = z.object({
	agencyId: z.string().cuid(),
	type: z.nativeEnum(MediaAssetType).optional(),
});

const getMediaAssetInput = z.object({
	mediaAssetId: z.string().cuid(),
});

const createMediaAssetInput = z.object({
	agencyId: z.string().cuid(),
	type: z.nativeEnum(MediaAssetType).default(MediaAssetType.GENERIC),
	url: z.string().url(),
	size: z.number().int().positive().optional(),
	metadata: z.record(z.any()).optional(),
});

const deleteMediaAssetInput = z.object({
	mediaAssetId: z.string().cuid(),
});

export const mediaRouter = createTRPCRouter({
	create: protectedProcedure
		.input(createMediaAssetInput)
		.mutation(async ({ ctx, input }) => {
			const data = createMediaAssetInput.parse(input);

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

			return ctx.db.mediaAsset.create({
				data: {
					agencyId: data.agencyId,
					uploaderId: ctx.user.id,
					type: data.type,
					url: data.url,
					size: data.size,
					metadata: data.metadata as Prisma.InputJsonValue,
				},
			});
		}),

	list: protectedProcedure
		.input(listMediaAssetsInput)
		.query(async ({ ctx, input }) => {
			const data = listMediaAssetsInput.parse(input);

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

			const where: Prisma.MediaAssetWhereInput = {
				agencyId: data.agencyId,
			};

			if (data.type) {
				where.type = data.type;
			}

			return ctx.db.mediaAsset.findMany({
				where,
				orderBy: { createdAt: "desc" },
				include: {
					uploader: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});
		}),

	getById: protectedProcedure
		.input(getMediaAssetInput)
		.query(async ({ ctx, input }) => {
			const data = getMediaAssetInput.parse(input);

			const mediaAsset = await ctx.db.mediaAsset.findUnique({
				where: { id: data.mediaAssetId },
				include: {
					agency: {
						select: {
							id: true,
						},
					},
					uploader: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});

			if (!mediaAsset) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			// Check membership
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: mediaAsset.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			return mediaAsset;
		}),

	delete: protectedProcedure
		.input(deleteMediaAssetInput)
		.mutation(async ({ ctx, input }) => {
			const data = deleteMediaAssetInput.parse(input);

			const mediaAsset = await ctx.db.mediaAsset.findUnique({
				where: { id: data.mediaAssetId },
				include: {
					agency: {
						select: {
							id: true,
						},
					},
					templateLogo: {
						select: {
							id: true,
						},
						take: 1,
					},
				},
			});

			if (!mediaAsset) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			// Check membership
			const membership = await ctx.db.agencyMember.findFirst({
				where: {
					agencyId: mediaAsset.agencyId,
					userId: ctx.user.id,
				},
			});

			if (!membership) {
				throw new TRPCError({ code: "FORBIDDEN" });
			}

			// Cannot delete logo if it's in use by templates
			if (mediaAsset.templateLogo.length > 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Cannot delete logo that is in use by templates.",
				});
			}

			// TODO: In the future, we might want to delete the file from UploadThing storage
			// For now, we just delete the database record

			return ctx.db.mediaAsset.delete({
				where: { id: data.mediaAssetId },
			});
		}),
});
