"use client";

import { Info, Loader2, Palette, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeCreator } from "@/components/branding/theme-creator";
import { ThemePreview } from "@/components/branding/theme-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import WarningModal from "@/components/warning-modal";
import { api } from "@/trpc/react";
import type { ThemeConfig } from "@/types/theme";
import { isValidThemeConfig } from "@/types/theme";

interface ThemeLibraryProps {
	agencyId: string;
}

export function ThemeLibrary({ agencyId }: ThemeLibraryProps) {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

	const utils = api.useUtils();
	const {
		data: themes,
		isLoading,
		isError,
		error,
		refetch,
	} = api.theme.list.useQuery({ agencyId });

	const setDefaultTheme = api.theme.setDefault.useMutation({
		onSuccess: () => {
			utils.theme.list.invalidate();
			toast.success("Default theme updated");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to set default theme");
		},
	});

	const deleteTheme = api.theme.delete.useMutation({
		onSuccess: () => {
			utils.theme.list.invalidate();
			setDeleteDialogOpen(null);
			toast.success("Theme deleted");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete theme");
		},
	});

	const handleSetDefault = (themeId: string) => {
		setDefaultTheme.mutate({ themeId });
	};

	const handleDelete = (themeId: string) => {
		deleteTheme.mutate({ themeId });
	};

	const themeCount = themes?.length ?? 0;

	const renderSwatches = (themeId: string, config: ThemeConfig | null) => {
		const palette = config
			? [
					{ key: "primary", value: config.colors.primary },
					{ key: "secondary", value: config.colors.secondary },
					{ key: "accent", value: config.colors.accent },
					{ key: "surface", value: config.colors.surface },
					{ key: "text", value: config.colors.text.primary },
					{ key: "border", value: config.colors.border },
				].filter((entry) => Boolean(entry.value))
			: [];

		if (palette.length === 0) {
			return (
				<div className="flex flex-1 items-center gap-2">
					<div className="h-10 flex-1 rounded border border-dashed" />
					<div className="h-10 flex-1 rounded border border-dashed" />
				</div>
			);
		}

		return palette.map((entry) => (
			<div
				className="h-10 flex-1 rounded border"
				key={`${themeId}-${entry.key}`}
				style={{ backgroundColor: entry.value as string }}
			/>
		));
	};

	if (isError) {
		return (
			<div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
				<div className="flex items-center gap-2 font-semibold text-destructive">
					<Info className="size-4" />
					<span>Unable to load themes</span>
				</div>
				<p className="text-muted-foreground text-sm">
					{error?.message ?? "Please try refreshing the theme list."}
				</p>
				<Button onClick={() => refetch()} size="sm" variant="secondary">
					Try Again
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2 font-medium text-muted-foreground text-sm uppercase tracking-wide">
						<Palette className="size-4" />
						<span>Your Theme Library</span>
					</div>
					<p className="text-muted-foreground text-sm">
						Create reusable design tokens for every template. Choose a default
						theme so new templates start on-brand.
					</p>
				</div>
				<Button
					onClick={() => setCreateDialogOpen(true)}
					size="sm"
					variant="secondary"
				>
					<Plus className="mr-2 size-4" />
					New Theme
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="rounded-lg border bg-card p-4 shadow-sm">
					<p className="font-medium text-muted-foreground text-sm">
						Total Themes
					</p>
					<p className="font-semibold text-2xl">{themeCount}</p>
				</div>
				<div className="rounded-lg border bg-card p-4 shadow-sm">
					<p className="font-medium text-muted-foreground text-sm">
						Default Theme Ready
					</p>
					<p className="font-semibold text-2xl">
						{themes?.some((theme) => theme.isDefault) ? "Yes" : "No"}
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{["theme-skeleton-a", "theme-skeleton-b", "theme-skeleton-c"].map(
						(key) => (
							<div
								className="rounded-lg border bg-card p-4 shadow-sm"
								key={key}
							>
								<Skeleton className="mb-3 h-6 w-2/3" />
								<Skeleton className="mb-4 h-4 w-full" />
								<div className="mb-4 flex gap-2">
									<Skeleton className="h-10 flex-1 rounded" />
									<Skeleton className="h-10 flex-1 rounded" />
								</div>
								<Skeleton className="h-5 w-24" />
							</div>
						),
					)}
				</div>
			) : themes && themes.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<p className="mb-4 text-muted-foreground">
						No themes yet. Create your first theme to get started.
					</p>
					<Button onClick={() => setCreateDialogOpen(true)} size="sm">
						<Plus />
						Create Theme
					</Button>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{themes?.map((theme) => {
						const themeConfig = isValidThemeConfig(theme.config)
							? (theme.config as ThemeConfig)
							: null;
						const templateUsage = theme._count?.templates ?? 0;

						return (
							<div
								className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm"
								key={theme.id}
							>
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<h3 className="font-semibold text-sm">{theme.name}</h3>
											{theme.isDefault && (
												<Badge className="text-xs" variant="secondary">
													<Star className="mr-1 size-3 fill-current" />
													Default
												</Badge>
											)}
										</div>
										{theme.description ? (
											<p className="text-muted-foreground text-xs">
												{theme.description}
											</p>
										) : (
											<p className="text-muted-foreground text-xs italic">
												No description provided
											</p>
										)}
									</div>
									<span className="text-muted-foreground text-xs">
										Created{" "}
										{new Date(theme.createdAt).toLocaleDateString(undefined, {
											month: "short",
											day: "numeric",
										})}
									</span>
								</div>

								<div className="flex gap-2">
									{themeConfig ? (
										<ThemePreview
											className="border-none bg-transparent p-0 shadow-none"
											config={themeConfig}
											variant="compact"
										/>
									) : (
										renderSwatches(theme.id, themeConfig)
									)}
								</div>

								<div className="flex items-center justify-between text-muted-foreground text-xs">
									<span>
										Used in {templateUsage} template
										{templateUsage === 1 ? "" : "s"}
									</span>
									{themeConfig?.typography.fontFamily.primary && (
										<span>
											Font: {themeConfig.typography.fontFamily.primary}
										</span>
									)}
								</div>

								<div className="flex items-center gap-2">
									{!theme.isDefault && (
										<Button
											className="flex-1"
											disabled={setDefaultTheme.isPending}
											onClick={() => handleSetDefault(theme.id)}
											size="sm"
											variant="outline"
										>
											{setDefaultTheme.isPending ? (
												<>
													<Loader2 className="mr-2 size-4 animate-spin" />
													Saving...
												</>
											) : (
												"Set Default"
											)}
										</Button>
									)}
									<Button
										disabled={deleteTheme.isPending || theme.isDefault}
										onClick={() => setDeleteDialogOpen(theme.id)}
										size="sm"
										variant="destructive"
									>
										{deleteTheme.isPending ? (
											<Loader2 className="mr-2 size-4 animate-spin" />
										) : (
											<Trash2 className="mr-2 size-4" />
										)}
										Delete
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			)}

			<ThemeCreator
				agencyId={agencyId}
				onOpenChange={setCreateDialogOpen}
				open={createDialogOpen}
			/>

			{deleteDialogOpen && (
				<WarningModal
					cta={() => handleDelete(deleteDialogOpen)}
					isLoading={deleteTheme.isPending}
					open={deleteDialogOpen !== null}
					setOpen={(open) =>
						setDeleteDialogOpen(open ? deleteDialogOpen : null)
					}
					text="Are you sure you want to delete this theme? This action cannot be undone."
					title="Delete Theme"
				/>
			)}
		</div>
	);
}
