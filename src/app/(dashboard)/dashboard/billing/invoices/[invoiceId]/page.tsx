import { PagePlaceholder } from "@/components/page-placeholder";

interface InvoiceDetailPageProps {
	params: { invoiceId: string };
}

const InvoiceDetailPage = ({ params }: InvoiceDetailPageProps) => {
	return (
		<PagePlaceholder
			description="Provide download links, line items, and payment status from Stripe."
			title={`Invoice ${params.invoiceId}`}
		/>
	);
};

export default InvoiceDetailPage;
