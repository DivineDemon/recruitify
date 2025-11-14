"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { SwitchAgencyFormValues } from "@/lib/validations/agency";

interface SwitchAgencyButtonProps {
	agencyId: string;
	agencyName: string;
	isActive: boolean;
	onSwitch: (values: SwitchAgencyFormValues) => Promise<{
		success?: boolean;
		error?: string;
	}>;
}

const SwitchAgencyButton = ({
	agencyId,
	agencyName,
	isActive,
	onSwitch,
}: SwitchAgencyButtonProps) => {
	const [isPending, startTransition] = useTransition();

	const handleSwitch = () => {
		if (isActive) return;

		startTransition(async () => {
			const result = await onSwitch({ agencyId });

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			toast.success(`Switched to ${agencyName}.`);
		});
	};

	return (
		<Button
			className="w-full"
			disabled={isActive || isPending}
			onClick={handleSwitch}
			type="button"
			variant={isActive ? "outline" : "secondary"}
		>
			{isPending ? (
				<>
					<Loader2 className="mr-2 size-4 animate-spin" />
					Switching…
				</>
			) : isActive ? (
				"Current workspace"
			) : (
				"Switch workspace"
			)}
		</Button>
	);
};

export default SwitchAgencyButton;
