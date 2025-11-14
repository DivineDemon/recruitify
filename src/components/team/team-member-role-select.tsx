"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { UpdateMemberRoleFormValues } from "@/lib/validations/team";

interface RoleOption {
	label: string;
	value: UpdateMemberRoleFormValues["role"];
}

interface TeamMemberRoleSelectProps {
	memberId: string;
	memberName: string;
	currentRole: UpdateMemberRoleFormValues["role"];
	allowedRoles: RoleOption[];
	canEdit: boolean;
	onUpdate: (
		values: UpdateMemberRoleFormValues,
	) => Promise<{ success?: boolean; error?: string }>;
}

const TeamMemberRoleSelect = ({
	memberId,
	memberName,
	currentRole,
	allowedRoles,
	canEdit,
	onUpdate,
}: TeamMemberRoleSelectProps) => {
	const [isPending, startTransition] = useTransition();

	const handleChange = (nextRole: UpdateMemberRoleFormValues["role"]) => {
		if (nextRole === currentRole) return;

		startTransition(async () => {
			const result = await onUpdate({ memberId, role: nextRole });

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			const updatedOption =
				allowedRoles.find((role) => role.value === nextRole)?.label ?? nextRole;

			toast.success(`Updated ${memberName}'s role to ${updatedOption}.`);
		});
	};

	return (
		<Select
			disabled={!canEdit || isPending || allowedRoles.length === 0}
			onValueChange={handleChange}
			value={currentRole}
		>
			<SelectTrigger className="w-[140px]">
				<SelectValue placeholder="Select role" />
			</SelectTrigger>
			<SelectContent>
				{allowedRoles.map((role) => (
					<SelectItem key={role.value} value={role.value}>
						{role.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default TeamMemberRoleSelect;
