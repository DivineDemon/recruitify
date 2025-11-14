import { z } from "zod";

export const agencyRoleValues = ["OWNER", "ADMIN", "EDITOR"] as const;
export type AgencyRoleValue = (typeof agencyRoleValues)[number];

export const inviteMemberSchema = z.object({
	email: z.string().email("Enter a valid work email."),
	role: z.enum(agencyRoleValues, {
		required_error: "Select a role for the teammate.",
	}),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

export const updateMemberRoleSchema = z.object({
	memberId: z.string().cuid("Invalid member id."),
	role: z.enum(agencyRoleValues, {
		required_error: "Choose a new role for the teammate.",
	}),
});

export type UpdateMemberRoleFormValues = z.infer<typeof updateMemberRoleSchema>;

export const removeMemberSchema = z.object({
	memberId: z.string().cuid("Invalid member id."),
});

export type RemoveMemberFormValues = z.infer<typeof removeMemberSchema>;
