"use client";

import { use } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplatePreviewPageProps {
	params: Promise<{ templateId: string }>;
}

const TemplatePreviewPage = ({ params }: TemplatePreviewPageProps) => {
	const { templateId } = use(params);
	return (
		<PagePlaceholder
			description={`Render a live preview of template ${templateId} with sample data.`}
			title="Template Preview"
		/>
	);
};

export default TemplatePreviewPage;
