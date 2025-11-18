"use client";

import { use } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

interface PublishedSitePageProps {
	params: Promise<{ domain: string; path: string[] }>;
}

const PublishedSitePage = ({ params }: PublishedSitePageProps) => {
	const { domain, path } = use(params);
	const fullPath = [domain, ...(path ?? [])].join("/");

	return (
		<PagePlaceholder
			description={`Render the published template for ${fullPath}. This route will stream the built website.`}
			title="Published Site"
		/>
	);
};

export default PublishedSitePage;
