import Link from "next/link";

import { PagePlaceholder } from "@/components/page-placeholder";
import { Button } from "@/components/ui/button";

const MarketingHomePage = () => {
	return (
		<PagePlaceholder
			actions={
				<Button asChild>
					<Link href="/auth/callback">Get Started</Link>
				</Button>
			}
			description="A dedicated website builder for recruitment agencies. Customize templates, publish to custom domains, and manage applicants end to end."
			title="Recruitify"
		/>
	);
};

export default MarketingHomePage;
