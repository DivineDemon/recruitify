import { PagePlaceholder } from "@/components/page-placeholder";

interface ApplicationDetailPageProps {
	params: { applicationId: string };
}

const ApplicationDetailPage = ({ params }: ApplicationDetailPageProps) => {
	return (
		<PagePlaceholder
			description="Review candidate profile, history, resume, and next steps."
			title={`Application ${params.applicationId}`}
		/>
	);
};

export default ApplicationDetailPage;
