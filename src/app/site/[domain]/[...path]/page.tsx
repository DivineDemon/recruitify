import { PagePlaceholder } from "@/components/page-placeholder";

interface PublishedSitePageProps {
	params: { domain: string; path: string[] };
}

const PublishedSitePage = ({ params }: PublishedSitePageProps) => {
	const fullPath = [params.domain, ...(params.path ?? [])].join("/");

	return (
		<PagePlaceholder
			description={`Render the published template for ${fullPath}. This route will stream the built website.`}
			title="Published Site"
		/>
	);
};

export default PublishedSitePage;
