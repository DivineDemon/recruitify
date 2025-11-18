"use client";

import { use } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplateAnalyticsPageProps {
	params: Promise<{ templateId: string }>;
}

const TemplateAnalyticsPage = ({ params }: TemplateAnalyticsPageProps) => {
	const { templateId } = use(params);
	return (
		<PagePlaceholder
			description={`Display visits, conversion rates, and application metrics for template ${templateId}.`}
			title="Template Analytics"
		/>
	);
};

export default TemplateAnalyticsPage;
