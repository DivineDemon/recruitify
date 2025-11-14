import { UserX } from "lucide-react";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import TeamInviteForm from "@/components/team/team-invite-form";
import TeamMemberRemoveButton from "@/components/team/team-member-remove-button";
import TeamMemberRoleSelect from "@/components/team/team-member-role-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ACTIVE_AGENCY_COOKIE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type {
	InviteMemberFormValues,
	RemoveMemberFormValues,
	UpdateMemberRoleFormValues,
} from "@/lib/validations/team";
import {
	inviteMemberSchema,
	removeMemberSchema,
	updateMemberRoleSchema,
} from "@/lib/validations/team";
import { resolveCurrentUser } from "@/server/auth";
import { $Enums, db } from "@/server/db";

const { AgencyRole, AgencyStatus } = $Enums;

const roleLabels: Record<(typeof AgencyRole)[keyof typeof AgencyRole], string> =
	{
		[AgencyRole.OWNER]: "Owner",
		[AgencyRole.ADMIN]: "Admin",
		[AgencyRole.EDITOR]: "Editor",
	};

const getRoleBadges = (
	role: (typeof AgencyRole)[keyof typeof AgencyRole],
): { label: string; variant: "default" | "secondary" | "outline" } => {
	switch (role) {
		case AgencyRole.OWNER:
			return { label: roleLabels[AgencyRole.OWNER], variant: "default" };
		case AgencyRole.ADMIN:
			return { label: roleLabels[AgencyRole.ADMIN], variant: "secondary" };
		default:
			return { label: roleLabels[AgencyRole.EDITOR], variant: "outline" };
	}
};

const getMembershipContext = async (
	userId: string,
	fallbackAgencyId?: string | null,
) => {
	const cookieStore = await cookies();
	const cookieActiveAgencyId =
		cookieStore.get(ACTIVE_AGENCY_COOKIE_NAME)?.value ?? null;

	const memberships = await db.agencyMember.findMany({
		where: {
			userId,
			agency: {
				status: AgencyStatus.ACTIVE,
			},
		},
		include: { agency: true },
		orderBy: { createdAt: "asc" },
	});

	if (memberships.length === 0) {
		return { memberships, activeMembership: null };
	}

	const activeMembership =
		memberships.find(
			(membership) => membership.agency.id === cookieActiveAgencyId,
		) ??
		(fallbackAgencyId
			? memberships.find(
					(membership) => membership.agency.id === fallbackAgencyId,
				)
			: null) ??
		memberships[0];

	return { memberships, activeMembership };
};

const inviteMember = async (
	values: InviteMemberFormValues,
): Promise<{ success?: boolean; error?: string }> => {
	"use server";

	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const parsed = inviteMemberSchema.parse(values);
	const { activeMembership } = await getMembershipContext(
		user.id,
		user.activeAgencyId,
	);

	if (!activeMembership) {
		return {
			error: "Select or create a workspace before inviting teammates.",
		};
	}

	if (activeMembership.role === AgencyRole.EDITOR) {
		return { error: "You do not have permission to invite teammates." };
	}

	if (
		parsed.role === AgencyRole.OWNER &&
		activeMembership.role !== AgencyRole.OWNER
	) {
		return { error: "Only owners can invite other owners." };
	}

	const existingUser = await db.user.findFirst({
		where: {
			email: parsed.email.trim().toLowerCase(),
		},
	});

	if (!existingUser) {
		return {
			error:
				"No Recruitify account found with that email. Ask your teammate to sign in first.",
		};
	}

	if (existingUser.id === user.id) {
		return { error: "You already belong to this workspace." };
	}

	const existingMembership = await db.agencyMember.findUnique({
		where: {
			agencyId_userId: {
				agencyId: activeMembership.agency.id,
				userId: existingUser.id,
			},
		},
	});

	if (existingMembership) {
		return { error: "That teammate is already part of this workspace." };
	}

	await db.agencyMember.create({
		data: {
			agencyId: activeMembership.agency.id,
			userId: existingUser.id,
			role: parsed.role,
			invitedAt: new Date(),
			acceptedAt: new Date(),
		},
	});

	revalidatePath("/dashboard/settings/team");

	return { success: true };
};

const updateMemberRole = async (
	values: UpdateMemberRoleFormValues,
): Promise<{ success?: boolean; error?: string }> => {
	"use server";

	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const parsed = updateMemberRoleSchema.parse(values);

	const { activeMembership } = await getMembershipContext(
		user.id,
		user.activeAgencyId,
	);

	if (!activeMembership) {
		return {
			error: "Select or create a workspace before managing roles.",
		};
	}

	if (activeMembership.role === AgencyRole.EDITOR) {
		return { error: "You do not have permission to update roles." };
	}

	const membership = await db.agencyMember.findUnique({
		where: { id: parsed.memberId },
	});

	if (!membership || membership.agencyId !== activeMembership.agency.id) {
		return { error: "Teammate not found in this workspace." };
	}

	if (
		parsed.role === AgencyRole.OWNER &&
		activeMembership.role !== AgencyRole.OWNER
	) {
		return { error: "Only owners can assign the Owner role." };
	}

	if (
		activeMembership.role === AgencyRole.ADMIN &&
		membership.role === AgencyRole.OWNER
	) {
		return { error: "You cannot change another owner's role." };
	}

	if (
		activeMembership.role === AgencyRole.ADMIN &&
		parsed.role === AgencyRole.OWNER
	) {
		return { error: "Admins cannot promote teammates to Owner." };
	}

	if (membership.role === parsed.role) {
		return { success: true };
	}

	if (
		membership.role === AgencyRole.OWNER &&
		parsed.role !== AgencyRole.OWNER
	) {
		const ownerCount = await db.agencyMember.count({
			where: { agencyId: activeMembership.agency.id, role: AgencyRole.OWNER },
		});

		if (ownerCount <= 1) {
			return {
				error: "Workspaces must always have at least one owner.",
			};
		}
	}

	await db.agencyMember.update({
		where: { id: membership.id },
		data: { role: parsed.role },
	});

	revalidatePath("/dashboard/settings/team");

	return { success: true };
};

const removeMember = async (
	values: RemoveMemberFormValues,
): Promise<{ success?: boolean; error?: string }> => {
	"use server";

	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const parsed = removeMemberSchema.parse(values);

	const { activeMembership } = await getMembershipContext(
		user.id,
		user.activeAgencyId,
	);

	if (!activeMembership) {
		return {
			error: "Select or create a workspace before managing teammates.",
		};
	}

	if (activeMembership.role === AgencyRole.EDITOR) {
		return { error: "You do not have permission to remove teammates." };
	}

	const membership = await db.agencyMember.findUnique({
		where: { id: parsed.memberId },
	});

	if (!membership || membership.agencyId !== activeMembership.agency.id) {
		return { error: "Teammate not found in this workspace." };
	}

	const isSelf = membership.userId === user.id;

	if (!isSelf) {
		if (
			activeMembership.role === AgencyRole.ADMIN &&
			membership.role !== AgencyRole.EDITOR
		) {
			return { error: "Admins can only remove editors." };
		}

		if (
			activeMembership.role === AgencyRole.OWNER &&
			membership.role === AgencyRole.OWNER
		) {
			const ownerCount = await db.agencyMember.count({
				where: {
					agencyId: activeMembership.agency.id,
					role: AgencyRole.OWNER,
				},
			});

			if (ownerCount <= 1) {
				return {
					error: "Workspaces must always have at least one owner.",
				};
			}
		}
	}

	if (isSelf && membership.role === AgencyRole.OWNER) {
		const ownerCount = await db.agencyMember.count({
			where: {
				agencyId: activeMembership.agency.id,
				role: AgencyRole.OWNER,
			},
		});

		if (ownerCount <= 1) {
			return {
				error: "Workspaces must always have at least one owner.",
			};
		}
	}

	await db.agencyMember.delete({
		where: { id: membership.id },
	});

	if (isSelf || user.activeAgencyId === membership.agencyId) {
		await db.user.update({
			where: { id: membership.userId },
			data: {
				activeAgencyId:
					user.activeAgencyId === membership.agencyId
						? null
						: user.activeAgencyId,
			},
		});

		const cookieStore = await cookies();
		const cookieActiveAgencyId =
			cookieStore.get(ACTIVE_AGENCY_COOKIE_NAME)?.value ?? null;

		if (cookieActiveAgencyId === membership.agencyId) {
			cookieStore.delete(ACTIVE_AGENCY_COOKIE_NAME);
		}
	}

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/settings/team");

	return { success: true };
};

const TeamSettingsPage = async () => {
	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const { activeMembership } = await getMembershipContext(
		user.id,
		user.activeAgencyId,
	);

	if (!activeMembership) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-4 p-10 text-center">
				<p className="max-w-lg text-muted-foreground text-sm">
					You are not part of any active agencies yet. Create or switch to a
					workspace from the Agencies tab to manage your team.
				</p>
				<Button asChild>
					<Link href="/dashboard/agencies">Go to Agencies</Link>
				</Button>
			</div>
		);
	}

	const teamMembers = await db.agencyMember.findMany({
		where: { agencyId: activeMembership.agency.id },
		include: { user: true },
		orderBy: { createdAt: "asc" },
	});

	const inviteRoleOptions =
		activeMembership.role === AgencyRole.OWNER
			? [
					{
						label: roleLabels[AgencyRole.OWNER],
						value: AgencyRole.OWNER,
						description: "Full control across billing, domains, and data.",
					},
					{
						label: roleLabels[AgencyRole.ADMIN],
						value: AgencyRole.ADMIN,
						description: "Manage templates, jobs, applications, and settings.",
					},
					{
						label: roleLabels[AgencyRole.EDITOR],
						value: AgencyRole.EDITOR,
						description: "Create content and manage applicants.",
					},
				]
			: [
					{
						label: roleLabels[AgencyRole.ADMIN],
						value: AgencyRole.ADMIN,
						description: "Manage templates, jobs, applications, and settings.",
					},
					{
						label: roleLabels[AgencyRole.EDITOR],
						value: AgencyRole.EDITOR,
						description: "Create content and manage applicants.",
					},
				];

	const roleSelectOptions =
		activeMembership.role === AgencyRole.OWNER
			? [
					{ label: roleLabels[AgencyRole.OWNER], value: AgencyRole.OWNER },
					{ label: roleLabels[AgencyRole.ADMIN], value: AgencyRole.ADMIN },
					{ label: roleLabels[AgencyRole.EDITOR], value: AgencyRole.EDITOR },
				]
			: [
					{ label: roleLabels[AgencyRole.ADMIN], value: AgencyRole.ADMIN },
					{ label: roleLabels[AgencyRole.EDITOR], value: AgencyRole.EDITOR },
				];

	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-5 p-5">
			<div className="flex w-full max-w-3xl flex-col items-center justify-center gap-2.5">
				<h1 className="w-full text-left font-semibold text-[24px] leading-[24px] tracking-tight">
					Team
				</h1>
				<p className="w-full text-left text-[14px] text-muted-foreground leading-[14px]">
					Manage who can access&nbsp;
					<span className="font-semibold text-foreground">
						{activeMembership.agency.displayName}
					</span>
					.
				</p>
			</div>
			<div className="grid h-full w-full grid-cols-3 items-start justify-start gap-5">
				<TeamInviteForm
					className="col-span-1"
					onSubmit={inviteMember}
					roleOptions={inviteRoleOptions}
				/>
				{teamMembers.length !== 0 ? (
					<div className="col-span-2 flex h-full max-h-full w-full flex-col items-start justify-start gap-2.5 overflow-y-auto rounded-lg border-2 border-dashed p-5">
						{teamMembers.map((member) => {
							const badge = getRoleBadges(member.role);
							const canEditMemberRole =
								activeMembership.role === AgencyRole.OWNER
									? true
									: activeMembership.role === AgencyRole.ADMIN &&
										member.role !== AgencyRole.OWNER;

							const memberName =
								member.user?.name ?? member.user?.email ?? "teammate";
							const isSelf = member.userId === user.id;
							const canRemoveMember =
								isSelf ||
								activeMembership.role === AgencyRole.OWNER ||
								(activeMembership.role === AgencyRole.ADMIN &&
									member.role === AgencyRole.EDITOR);

							return (
								<div
									className="flex w-full flex-col gap-2 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
									key={member.id}
								>
									<div>
										<div className="flex items-center gap-2 font-medium">
											<div
												className={cn("relative size-2 rounded-full", {
													"bg-primary": member.acceptedAt,
													"bg-yellow-500": !member.acceptedAt,
												})}
											>
												<div
													className={cn(
														"absolute inset-0 size-2 animate-ping rounded-full",
														{
															"bg-primary": member.acceptedAt,
															"bg-yellow-500": !member.acceptedAt,
														},
													)}
												/>
											</div>
											{member.user?.name ??
												member.user?.email ??
												"Unknown user"}
										</div>
										<p className="text-muted-foreground text-sm">
											{member.user?.email ?? "No email on file"}
										</p>
									</div>
									<div className="flex items-start gap-2 sm:items-end">
										{canEditMemberRole ? (
											<TeamMemberRoleSelect
												allowedRoles={roleSelectOptions}
												canEdit={canEditMemberRole}
												currentRole={member.role}
												memberId={member.id}
												memberName={memberName}
												onUpdate={updateMemberRole}
											/>
										) : (
											<Badge variant={badge.variant}>{badge.label}</Badge>
										)}
										<TeamMemberRemoveButton
											canRemove={canRemoveMember}
											isSelf={isSelf}
											memberId={member.id}
											memberName={memberName}
											onRemove={removeMember}
										/>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="col-span-2 flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed">
						<UserX className="size-14 text-primary" />
						<h2 className="mt-5 mb-2.5 font-semibold text-[18px] leading-[18px] tracking-tight">
							No teammates yet.
						</h2>
						<p className="w-full max-w-prose text-center text-muted-foreground text-sm">
							Use the invite form to add collaborators.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TeamSettingsPage;
