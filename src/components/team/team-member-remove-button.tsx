"use client";

import { Loader2, LogOut, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WarningModal from "@/components/warning-modal";
import type { RemoveMemberFormValues } from "@/lib/validations/team";

interface TeamMemberRemoveButtonProps {
	memberId: string;
	memberName: string;
	isSelf: boolean;
	canRemove: boolean;
	onRemove: (
		values: RemoveMemberFormValues,
	) => Promise<{ success?: boolean; error?: string }>;
}

const TeamMemberRemoveButton = ({
	memberId,
	memberName,
	isSelf,
	canRemove,
	onRemove,
}: TeamMemberRemoveButtonProps) => {
	const [isPending, startTransition] = useTransition();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const handleConfirm = () => {
		startTransition(async () => {
			const result = await onRemove({ memberId });

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			toast.success(
				isSelf
					? "You have left the workspace."
					: `${memberName} has been removed.`,
			);
			setIsDialogOpen(false);
		});
	};

	const actionLabel = isSelf ? "Leave workspace" : "Remove";

	return (
		<>
			<Button
				className="w-full sm:w-auto"
				disabled={!canRemove || isPending}
				onClick={() => {
					if (!canRemove || isPending) return;
					setIsDialogOpen(true);
				}}
				type="button"
				variant={isSelf ? "destructive" : "outline"}
			>
				{isPending ? (
					<Loader2 className="animate-spin" />
				) : isSelf ? (
					<LogOut />
				) : (
					<Trash2 />
				)}
				{isPending ? "Working…" : actionLabel}
			</Button>
			<WarningModal
				cta={handleConfirm}
				isLoading={isPending}
				open={isDialogOpen}
				setOpen={setIsDialogOpen}
				text={
					isSelf
						? "You will lose access to this workspace immediately."
						: `${memberName} will lose access to this workspace immediately.`
				}
				title={isSelf ? "Leave workspace?" : "Remove teammate?"}
			/>
		</>
	);
};

export default TeamMemberRemoveButton;
