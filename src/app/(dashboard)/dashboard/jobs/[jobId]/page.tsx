"use client";

import { use } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

interface JobDetailPageProps {
	params: Promise<{ jobId: string }>;
}

const JobDetailPage = ({ params }: JobDetailPageProps) => {
	const { jobId } = use(params);
	return (
		<PagePlaceholder
			description="Edit job content, track candidates, and view performance metrics."
			title={`Job ${jobId}`}
		/>
	);
};

export default JobDetailPage;
