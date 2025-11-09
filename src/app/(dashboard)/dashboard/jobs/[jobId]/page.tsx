import { PagePlaceholder } from "@/components/page-placeholder";

interface JobDetailPageProps {
	params: { jobId: string };
}

const JobDetailPage = ({ params }: JobDetailPageProps) => {
	return (
		<PagePlaceholder
			description="Edit job content, track candidates, and view performance metrics."
			title={`Job ${params.jobId}`}
		/>
	);
};

export default JobDetailPage;
