import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplateAnalyticsPageProps {
	params: { templateId: string };
}

const TemplateAnalyticsPage = ({ params }: TemplateAnalyticsPageProps) => {
	return (
		<PagePlaceholder
			description={`Display visits, conversion rates, and application metrics for template ${params.templateId}.`}
			title="Template Analytics"
		/>
	);
};

export default TemplateAnalyticsPage;
