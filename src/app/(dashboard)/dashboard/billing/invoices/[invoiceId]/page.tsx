"use client";

import { use } from "react";
import { PagePlaceholder } from "@/components/page-placeholder";

interface InvoiceDetailPageProps {
	params: Promise<{ invoiceId: string }>;
}

const InvoiceDetailPage = ({ params }: InvoiceDetailPageProps) => {
	const { invoiceId } = use(params);
	return (
		<PagePlaceholder
			description="Provide download links, line items, and payment status from Stripe."
			title={`Invoice ${invoiceId}`}
		/>
	);
};

export default InvoiceDetailPage;
