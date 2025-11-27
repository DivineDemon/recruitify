"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoSelector } from "@/components/branding/logo-selector";
import { ThemeSelector } from "@/components/branding/theme-selector";
import type { BuilderNode } from "@/components/builder/types";
import { TemplateRendererClient } from "@/components/template/template-renderer-client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { isValidThemeConfig, type ThemeConfig } from "@/types/theme";

interface TemplatePreviewDialogProps {
	templateId: string;
	agencyId: string;
	onClose: () => void;
}

export function TemplatePreviewDialog({
	templateId,
	agencyId,
	onClose,
}: TemplatePreviewDialogProps) {
	const router = useRouter();
	const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
	const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);

	const { data: template, isLoading: isLoadingTemplate } =
		api.marketplace.getMarketplaceTemplate.useQuery({ templateId });

	// Fetch user's selected theme
	const { data: userThemes } = api.theme.list.useQuery({ agencyId });
	const selectedUserTheme = userThemes?.find(
		(theme) => theme.id === selectedThemeId,
	);
	const themeConfig: ThemeConfig | null =
		selectedThemeId &&
		selectedUserTheme?.config &&
		isValidThemeConfig(selectedUserTheme.config)
			? selectedUserTheme.config
			: null;

	// Fetch user's selected logo
	const { data: userLogos } = api.media.list.useQuery({
		agencyId,
		type: "LOGO",
	});
	const selectedUserLogo = userLogos?.find(
		(logo) => logo.id === selectedLogoId,
	);
	const logoUrl = selectedUserLogo?.url ?? null;

	const utils = api.useUtils();
	const duplicateMutation =
		api.marketplace.duplicateFromMarketplace.useMutation({
			onSuccess: (newTemplate) => {
				utils.template.list.invalidate();
				router.push(`/dashboard/templates/${newTemplate.id}/builder`);
			},
		});

	const pageTree = template?.pageTree as BuilderNode | undefined;

	const handleUseTemplate = () => {
		if (!template) return;

		duplicateMutation.mutate({
			templateId: template.id,
			agencyId,
			selectedThemeId: selectedThemeId ?? null,
			selectedLogoId: selectedLogoId ?? null,
		});
	};

	return (
		<Dialog onOpenChange={(open) => !open && onClose()} open={true}>
			<DialogContent className="flex h-[90vh] max-w-7xl flex-col p-0">
				<DialogHeader className="px-6 pt-6 pb-4">
					<DialogTitle>{template?.title ?? "Template Preview"}</DialogTitle>
					<DialogDescription>
						{template?.description ??
							"Preview this template with your theme and logo."}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-1 overflow-hidden">
					{/* Left: Preview */}
					<div className="flex-1 overflow-auto border-r bg-muted/30 p-6">
						{isLoadingTemplate ? (
							<div className="flex h-full items-center justify-center">
								<Loader2 className="size-6 animate-spin text-muted-foreground" />
							</div>
						) : pageTree ? (
							<div className="mx-auto max-w-4xl rounded-lg border bg-background shadow-lg">
								<TemplateRendererClient
									logoUrl={logoUrl}
									pageTree={pageTree}
									themeConfig={themeConfig}
									themeId={selectedThemeId ?? undefined}
								/>
							</div>
						) : (
							<div className="flex h-full items-center justify-center">
								<p className="text-muted-foreground text-sm">
									No preview available
								</p>
							</div>
						)}
					</div>

					{/* Right: Controls */}
					<div className="flex w-80 flex-col gap-4 overflow-y-auto p-6">
						<div className="flex flex-col gap-4">
							<ThemeSelector
								agencyId={agencyId}
								description="Select a theme to preview with this template."
								label="Preview Theme"
								onSelect={setSelectedThemeId}
								selectedThemeId={selectedThemeId}
								showPreview={false}
							/>

							<Separator />

							<LogoSelector
								agencyId={agencyId}
								description="Select a logo to preview with this template."
								label="Preview Logo"
								onSelect={setSelectedLogoId}
								selectedLogoId={selectedLogoId}
								showPreview={false}
							/>
						</div>

						<div className="mt-auto flex flex-col gap-2 pt-4">
							<Button
								className="w-full"
								disabled={duplicateMutation.isPending || isLoadingTemplate}
								onClick={handleUseTemplate}
								size="lg"
							>
								{duplicateMutation.isPending ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Creating Template...
									</>
								) : (
									"Use This Template"
								)}
							</Button>
							<p className="text-center text-muted-foreground text-xs">
								This will create a copy in your templates
							</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
