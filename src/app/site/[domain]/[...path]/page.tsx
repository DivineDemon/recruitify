import { notFound } from "next/navigation";
import type { BuilderNode } from "@/components/builder/types";
import { TemplateRendererClient } from "@/components/template/template-renderer-client";
import { $Enums, db } from "@/server/db";
import { isValidThemeConfig, type ThemeConfig } from "@/types/theme";

const { DomainStatus } = $Enums;

interface PublishedSitePageProps {
	params: Promise<{ domain: string; path: string[] }>;
}

async function PublishedSitePage({ params }: PublishedSitePageProps) {
	const { domain } = await params;

	// Find domain by hostname
	const domainRecord = await db.domain.findUnique({
		where: {
			hostname: domain.toLowerCase(),
			status: DomainStatus.ACTIVE,
		},
		include: {
			template: {
				include: {
					selectedTheme: true,
					selectedLogo: true,
					publishedVersion: true,
				},
			},
		},
	});

	if (!domainRecord || !domainRecord.template) {
		notFound();
	}

	const template = domainRecord.template;

	// Get pageTree - use publishedVersion if available, otherwise use template.pageTree
	let pageTree: BuilderNode;
	if (template.publishedVersionId && template.publishedVersion) {
		// If there's a published version, use its pageTree
		pageTree = template.publishedVersion.pageTree as BuilderNode;
	} else {
		// Otherwise use the template's pageTree
		pageTree = (template.pageTree as BuilderNode) ?? {
			id: "root",
			type: "root",
			props: {},
			children: [],
		};
	}

	// Get theme config
	let themeConfig: ThemeConfig | null = null;
	if (template.selectedThemeId && template.selectedTheme) {
		const config = template.selectedTheme.config;
		if (isValidThemeConfig(config)) {
			themeConfig = config;
		}
	}

	// Get logo URL
	const logoUrl =
		template.selectedLogoId && template.selectedLogo
			? template.selectedLogo.url
			: null;

	return (
		<TemplateRendererClient
			logoUrl={logoUrl}
			pageTree={pageTree}
			themeConfig={themeConfig}
			themeId={template.selectedThemeId}
		/>
	);
}

export default PublishedSitePage;
