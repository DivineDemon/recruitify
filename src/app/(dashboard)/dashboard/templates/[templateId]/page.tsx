import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplateDetailPageProps {
	params: { templateId: string };
}

const TemplateDetailPage = ({ params }: TemplateDetailPageProps) => {
	return (
		<PagePlaceholder
			description="View metadata, status, and quick actions for this template."
			title={`Template ${params.templateId}`}
		/>
	);
};

export default TemplateDetailPage;
