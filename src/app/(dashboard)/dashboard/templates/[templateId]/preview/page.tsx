import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplatePreviewPageProps {
	params: { templateId: string };
}

const TemplatePreviewPage = ({ params }: TemplatePreviewPageProps) => {
	return (
		<PagePlaceholder
			description={`Render a live preview of template ${params.templateId} with sample data.`}
			title="Template Preview"
		/>
	);
};

export default TemplatePreviewPage;
