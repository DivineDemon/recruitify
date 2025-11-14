import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createAgencySchema = z.object({
	displayName: z
		.string()
		.trim()
		.min(2, "Display name must be at least 2 characters.")
		.max(120, "Display name must be 120 characters or fewer."),
	slug: z
		.string()
		.trim()
		.min(3, "Slug must be at least 3 characters.")
		.max(48, "Slug must be 48 characters or fewer.")
		.regex(slugRegex, "Use lowercase letters, numbers, and hyphens only."),
	description: z
		.string()
		.trim()
		.max(512, "Description must be 512 characters or fewer.")
		.optional()
		.or(z.literal("")),
});

export type CreateAgencyFormValues = z.infer<typeof createAgencySchema>;

export const updateAgencySchema = createAgencySchema.extend({
	agencyId: z.string().cuid("Invalid agency id."),
});

export type UpdateAgencyFormValues = z.infer<typeof updateAgencySchema>;

export const archiveAgencySchema = z.object({
	agencyId: z.string().cuid("Invalid agency id."),
});

export type ArchiveAgencyFormValues = z.infer<typeof archiveAgencySchema>;

export const switchAgencySchema = z.object({
	agencyId: z.string().cuid("Invalid agency id."),
});

export type SwitchAgencyFormValues = z.infer<typeof switchAgencySchema>;
