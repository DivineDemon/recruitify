import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	imageUrl: z.union([
		z.string().trim().url("Please enter a valid URL"),
		z.literal(""),
	]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
