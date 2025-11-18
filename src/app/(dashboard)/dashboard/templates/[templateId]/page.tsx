"use client";

import { use } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

interface TemplateDetailPageProps {
	params: Promise<{ templateId: string }>;
}

const TemplateDetailPage = ({ params }: TemplateDetailPageProps) => {
	const { templateId } = use(params);
	return (
		<PagePlaceholder
			description="View metadata, status, and quick actions for this template."
			title={`Template ${templateId}`}
		/>
	);
};

export default TemplateDetailPage;
