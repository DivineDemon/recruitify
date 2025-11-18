"use client";

import { use } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

interface ApplicationDetailPageProps {
	params: Promise<{ applicationId: string }>;
}

const ApplicationDetailPage = ({ params }: ApplicationDetailPageProps) => {
	const { applicationId } = use(params);
	return (
		<PagePlaceholder
			description="Review candidate profile, history, resume, and next steps."
			title={`Application ${applicationId}`}
		/>
	);
};

export default ApplicationDetailPage;
