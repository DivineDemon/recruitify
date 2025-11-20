"use client";

import { Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeCreator } from "@/components/branding/theme-creator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WarningModal from "@/components/warning-modal";
import { api } from "@/trpc/react";

interface ThemeLibraryProps {
	agencyId: string;
}

export function ThemeLibrary({ agencyId }: ThemeLibraryProps) {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

	const utils = api.useUtils();
	const { data: themes, isLoading } = api.theme.list.useQuery({ agencyId });

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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-muted-foreground">Loading themes...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					{themes?.length ?? 0} theme{themes?.length !== 1 ? "s" : ""}
				</p>
				<Button onClick={() => setCreateDialogOpen(true)} size="sm">
					<Plus className="mr-2 size-4" />
					Create Theme
				</Button>
			</div>

			{themes && themes.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<p className="mb-4 text-muted-foreground">
						No themes yet. Create your first theme to get started.
					</p>
					<Button onClick={() => setCreateDialogOpen(true)} size="sm">
						<Plus className="mr-2 size-4" />
						Create Theme
					</Button>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{themes?.map((theme) => (
						<div
							className="rounded-lg border bg-card p-4 shadow-sm"
							key={theme.id}
						>
							<div className="mb-2 flex items-start justify-between">
								<div className="flex-1">
									<div className="mb-1 flex items-center gap-2">
										<h3 className="font-semibold text-sm">{theme.name}</h3>
										{theme.isDefault && (
											<Badge className="text-xs" variant="secondary">
												<Star className="mr-1 size-3 fill-current" />
												Default
											</Badge>
										)}
									</div>
									{theme.description && (
										<p className="line-clamp-2 text-muted-foreground text-xs">
											{theme.description}
										</p>
									)}
								</div>
							</div>

							{/* Theme preview - simple color swatches */}
							<div className="mb-3 flex gap-1">
								{/* This will be enhanced with actual theme preview */}
								<div className="h-8 flex-1 rounded border" />
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
										Set Default
									</Button>
								)}
								<Button
									disabled={deleteTheme.isPending || theme.isDefault}
									onClick={() => setDeleteDialogOpen(theme.id)}
									size="sm"
									variant="destructive"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						</div>
					))}
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
