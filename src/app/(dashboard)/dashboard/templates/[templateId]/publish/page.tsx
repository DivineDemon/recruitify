"use client";

import { use } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplatePublishPageProps {
	params: Promise<{ templateId: string }>;
}

const TemplatePublishPage = ({ params }: TemplatePublishPageProps) => {
	const { templateId } = use(params);
	return (
		<PagePlaceholder
			description={`Configure domains and publish settings for template ${templateId}.`}
			title="Publish Template"
		/>
	);
};

export default TemplatePublishPage;
