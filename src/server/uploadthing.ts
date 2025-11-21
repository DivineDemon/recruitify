import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const extractUploadthingKey = (url?: string | null) => {
	if (!url) return null;

	try {
		const parsed = new URL(url);

		// UploadThing files are served from utfs.io
		if (!parsed.hostname.endsWith("utfs.io")) {
			return null;
		}

		const segments = parsed.pathname.split("/").filter(Boolean);
		const fileSegmentIndex = segments.indexOf("f");

		if (fileSegmentIndex === -1 || !segments[fileSegmentIndex + 1]) {
			return null;
		}

		const keySegment = segments[fileSegmentIndex + 1];
		if (!keySegment) return null;
		// Uploaded keys follow `key-filename` format
		return keySegment.split("-")[0] ?? null;
	} catch {
		return null;
	}
};

export const deleteUploadthingFile = async (key?: string | null) => {
	if (!key) return;

	try {
		await utapi.deleteFiles(key);
	} catch (error) {
		console.error("Failed to delete UploadThing file", error);
	}
};
