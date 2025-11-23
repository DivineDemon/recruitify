"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

interface LogoSelectorProps {
	agencyId: string;
	selectedLogoId?: string | null;
	onSelect: (logoId: string) => void;
	disabled?: boolean;
	className?: string;
	label?: string;
	description?: string;
	showPreview?: boolean;
}

export function LogoSelector({
	agencyId,
	selectedLogoId,
	onSelect,
	disabled,
	className,
	label = "Logo",
	description = "Choose which logo appears on this template.",
	showPreview = true,
}: LogoSelectorProps) {
	const {
		data: logos,
		isLoading,
		isError,
		error,
	} = api.media.list.useQuery({
		agencyId,
		type: "LOGO",
	});

	const selectedLogo = useMemo(
		() => logos?.find((logo) => logo.id === selectedLogoId) ?? null,
		[selectedLogoId, logos],
	);

	const requiresUnoptimized = useMemo(() => {
		if (!selectedLogo?.url) return false;
		return (
			/\.svg($|\?)/i.test(selectedLogo.url) ||
			selectedLogo.url.includes("utfs.io/")
		);
	}, [selectedLogo?.url]);

	const placeholderLabel = selectedLogo
		? `Logo (${new Date(selectedLogo.createdAt).toLocaleDateString()})`
		: isLoading
			? "Loading logos..."
			: "Select a logo";

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="space-y-1">
				<p className="font-medium text-sm leading-none">{label}</p>
				{description ? (
					<p className="text-muted-foreground text-xs">{description}</p>
				) : null}
			</div>

			{isError ? (
				<div className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
					<p className="font-medium text-destructive text-sm">
						Unable to load logos
					</p>
					<p className="text-muted-foreground text-xs">
						{error?.message ?? "Please try again in a moment."}
					</p>
				</div>
			) : (
				<Select
					disabled={disabled || isLoading || !logos?.length}
					onValueChange={(value) => value && onSelect(value)}
					value={selectedLogoId ?? undefined}
				>
					<SelectTrigger className="w-full justify-between">
						<div className="flex items-center gap-2">
							<ImageIcon className="size-4 text-muted-foreground" />
							<SelectValue placeholder={placeholderLabel} />
						</div>
					</SelectTrigger>
					<SelectContent className="max-h-72">
						{logos?.map((logo) => {
							const logoRequiresUnoptimized =
								/\.svg($|\?)/i.test(logo.url) || logo.url.includes("utfs.io/");
							const uploaderName =
								logo.uploader?.name ?? logo.uploader?.email ?? "Unknown";

							return (
								<SelectItem key={logo.id} value={logo.id}>
									<div className="flex items-center gap-3">
										<div className="relative size-12 shrink-0 overflow-hidden rounded border bg-muted">
											<Image
												alt={`Logo uploaded by ${uploaderName}`}
												className="object-contain p-1"
												fill
												src={logo.url}
												unoptimized={logoRequiresUnoptimized}
											/>
										</div>
										<div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
											<p className="truncate font-medium text-sm">
												Uploaded {new Date(logo.createdAt).toLocaleDateString()}
											</p>
											<p className="truncate text-muted-foreground text-xs">
												by {uploaderName}
											</p>
										</div>
									</div>
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			)}

			{showPreview ? (
				isLoading ? (
					<Skeleton className="mt-1 h-24 w-full" />
				) : selectedLogo ? (
					<div className="relative mt-1 aspect-video w-full overflow-hidden rounded-lg border bg-muted">
						<Image
							alt="Selected logo preview"
							className="object-contain p-4"
							fill
							src={selectedLogo.url}
							unoptimized={requiresUnoptimized}
						/>
					</div>
				) : (
					<div className="mt-1 flex items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center">
						<div className="flex flex-col items-center gap-2">
							<ImageIcon className="size-8 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">
								Select a logo to preview
							</p>
						</div>
					</div>
				)
			) : null}
		</div>
	);
}
