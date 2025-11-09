import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplatePublishPageProps {
	params: { templateId: string };
}

const TemplatePublishPage = ({ params }: TemplatePublishPageProps) => {
	return (
		<PagePlaceholder
			description={`Configure domains and publish settings for template ${params.templateId}.`}
			title="Publish Template"
		/>
	);
};

export default TemplatePublishPage;
