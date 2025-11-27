"use client";

import Image from "next/image";
import type { BuilderNode } from "@/components/builder/types";
import { TemplateRenderer } from "@/components/template/template-renderer";
import { CSSVariablesInjector } from "@/components/theme/css-variables-injector";
import type { ThemeConfig } from "@/types/theme";

interface TemplateRendererClientProps {
	pageTree: BuilderNode;
	themeId?: string | null;
	themeConfig?: ThemeConfig | null;
	logoUrl?: string | null;
}

/**
 * Client component that renders a template with theme and logo applied.
 * Injects CSS variables from theme and displays logo in header.
 */
export function TemplateRendererClient({
	pageTree,
	themeId,
	themeConfig,
	logoUrl,
}: TemplateRendererClientProps) {
	// Determine if logo requires unoptimized rendering
	const logoRequiresUnoptimized = logoUrl
		? /\.svg($|\?)/i.test(logoUrl) || logoUrl.includes("utfs.io/")
		: false;

	return (
		<CSSVariablesInjector
			scope="global"
			themeConfig={themeConfig ?? undefined}
			themeId={themeId ?? undefined}
		>
			<div className="min-h-screen w-full">
				{/* Header with logo */}
				{logoUrl && (
					<header className="border-b bg-background">
						<div className="container mx-auto flex items-center justify-between px-4 py-4">
							<div className="relative h-12 w-auto">
								<Image
									alt="Site logo"
									className="object-contain"
									height={48}
									src={logoUrl}
									unoptimized={logoRequiresUnoptimized}
									width={200}
								/>
							</div>
						</div>
					</header>
				)}

				{/* Main content */}
				<main>
					<TemplateRenderer tree={pageTree} />
				</main>

				{/* Footer with logo (optional) */}
				{logoUrl && (
					<footer className="border-t bg-background">
						<div className="container mx-auto flex items-center justify-center px-4 py-6">
							<div className="relative h-8 w-auto opacity-60">
								<Image
									alt="Site logo"
									className="object-contain"
									height={32}
									src={logoUrl}
									unoptimized={logoRequiresUnoptimized}
									width={150}
								/>
							</div>
						</div>
					</footer>
				)}
			</div>
		</CSSVariablesInjector>
	);
}
