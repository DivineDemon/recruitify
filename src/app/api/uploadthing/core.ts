import { createUploadthing, type FileRouter } from "uploadthing/next";
import { resolveCurrentUser } from "@/server/auth";

const f = createUploadthing();

export const ourFileRouter = {
	mediaUploader: f({
		image: { maxFileSize: "4MB" },
		video: { maxFileSize: "1GB" },
	})
		.middleware(async () => {
			const { user } = await resolveCurrentUser();

			if (!user) {
				throw new Error("Unauthorized");
			}

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return {
				uploadedBy: metadata.userId,
				url: file.ufsUrl,
			};
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
