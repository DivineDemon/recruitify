import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplateBuilderPageProps {
	params: { templateId: string };
}

const TemplateBuilderPage = ({ params }: TemplateBuilderPageProps) => {
	return (
		<PagePlaceholder
			description={`Interactive editor for template ${params.templateId}. Drag, drop, and configure domain-specific components.`}
			title="Template Builder"
		/>
	);
};

export default TemplateBuilderPage;
