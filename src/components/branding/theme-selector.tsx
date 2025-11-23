"use client";

import { Loader2, Palette } from "lucide-react";
import { useMemo } from "react";
import { ThemePreview } from "@/components/branding/theme-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { isValidThemeConfig, type ThemeConfig } from "@/types/theme";

interface ThemeSelectorProps {
	agencyId: string;
	selectedThemeId?: string | null;
	onSelect: (themeId: string) => void;
	disabled?: boolean;
	className?: string;
	label?: string;
	description?: string;
	showPreview?: boolean;
}

export function ThemeSelector({
	agencyId,
	selectedThemeId,
	onSelect,
	disabled,
	className,
	label = "Theme",
	description = "Pick which design system powers this template.",
	showPreview = true,
}: ThemeSelectorProps) {
	const {
		data: themes,
		isLoading,
		isError,
		error,
		refetch,
	} = api.theme.list.useQuery({ agencyId });

	const selectedTheme = useMemo(
		() => themes?.find((theme) => theme.id === selectedThemeId) ?? null,
		[selectedThemeId, themes],
	);

	const selectedThemeConfig = useMemo(() => {
		if (selectedTheme && isValidThemeConfig(selectedTheme.config)) {
			return selectedTheme.config as ThemeConfig;
		}
		return null;
	}, [selectedTheme]);

	const renderSwatchRow = (themeId: string, config: ThemeConfig | null) => {
		const palette = config
			? [
					config.colors.primary,
					config.colors.secondary,
					config.colors.accent,
					config.colors.surface,
					config.colors.text.primary,
					config.colors.border,
				].filter(Boolean)
			: [];

		if (palette.length === 0) {
			return (
				<div className="flex flex-1 gap-1">
					<div className="h-6 flex-1 rounded border border-dashed" />
					<div className="h-6 flex-1 rounded border border-dashed" />
				</div>
			);
		}

		return palette.map((color) => (
			<div
				className="h-6 flex-1 rounded border"
				key={`${themeId}-swatch-${color as string}`}
				style={{ backgroundColor: color as string }}
			/>
		));
	};

	const placeholderLabel = selectedTheme
		? selectedTheme.name
		: isLoading
			? "Loading themes..."
			: "Select a theme";

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="space-y-1">
				<p className="font-medium text-sm leading-none">{label}</p>
				{description ? (
					<p className="text-muted-foreground text-xs">{description}</p>
				) : null}
			</div>

			{isLoading ? (
				<Skeleton className="h-10 w-full" />
			) : isError ? (
				<div className="flex flex-col gap-2 rounded-lg border border-destructive/50 p-4 text-center">
					<p className="font-medium text-destructive">Unable to load themes</p>
					<p className="text-muted-foreground text-sm">
						{error?.message ?? "Please try again in a moment."}
					</p>
					<Button onClick={() => refetch()} size="sm" variant="secondary">
						Try again
					</Button>
				</div>
			) : (
				<Select
					disabled={disabled || !themes?.length}
					onValueChange={(value) => {
						if (value) {
							onSelect(value);
						}
					}}
					value={selectedThemeId ?? undefined}
				>
					<SelectTrigger className="w-full justify-between">
						<div className="flex items-center gap-2">
							<Palette className="size-4 text-muted-foreground" />
							<SelectValue placeholder={placeholderLabel} />
						</div>
					</SelectTrigger>
					<SelectContent className="max-h-72">
						{themes?.map((theme) => {
							const config = isValidThemeConfig(theme.config)
								? (theme.config as ThemeConfig)
								: null;

							return (
								<SelectItem key={theme.id} value={theme.id}>
									<div className="flex flex-col gap-1">
										<div className="flex items-center justify-between gap-2">
											<p className="font-medium text-sm">{theme.name}</p>
											{theme.isDefault ? (
												<Badge className="text-[10px]" variant="secondary">
													Default
												</Badge>
											) : null}
										</div>
										<p className="text-muted-foreground text-xs">
											{theme.description ?? "No description"}
										</p>
										<div className="flex gap-1">
											{renderSwatchRow(theme.id, config)}
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
					<Skeleton className="h-32 w-full" />
				) : selectedThemeConfig ? (
					<ThemePreview
						className="mt-1 border border-dashed"
						config={selectedThemeConfig}
						variant="compact"
					/>
				) : selectedTheme ? (
					<div className="mt-1 rounded-lg border border-dashed p-4 text-center text-muted-foreground text-sm">
						Unable to preview theme config
					</div>
				) : (
					<div className="mt-1 rounded-lg border border-dashed p-4 text-center text-muted-foreground text-sm">
						Select a theme to preview colors and typography
					</div>
				)
			) : null}

			{isLoading ? (
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<Loader2 className="size-3 animate-spin" />
					<span>Loading themes from your library</span>
				</div>
			) : themes && themes.length > 0 ? (
				<p className="text-muted-foreground text-xs">
					{themes.length} theme{themes.length === 1 ? "" : "s"} available
				</p>
			) : null}
		</div>
	);
}
