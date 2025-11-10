"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type KindeLoginProvider = {
	label: string;
	connectionId?: string;
};

interface KindeLoginButtonsProps {
	providers: KindeLoginProvider[];
}

export const KindeLoginButtons = ({ providers }: KindeLoginButtonsProps) => {
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			{providers.map(({ label, connectionId }) => (
				<LoginLink
					authUrlParams={
						connectionId ? { connection_id: connectionId } : undefined
					}
					className={cn(
						buttonVariants({ variant: connectionId ? "outline" : "default" }),
						"w-full justify-center",
					)}
					key={label}
				>
					{label}
				</LoginLink>
			))}
		</div>
	);
};
