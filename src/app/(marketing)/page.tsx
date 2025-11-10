import Link from "next/link";
import { PagePlaceholder } from "@/components/page-placeholder";
import { Button } from "@/components/ui/button";

const MarketingHomePage = () => {
	return (
		<PagePlaceholder
			actions={
				<div className="flex flex-col items-center gap-3">
					<Button asChild>
						<Link href="/signin">Sign In</Link>
					</Button>
				</div>
			}
			description="A dedicated website builder for recruitment agencies. Customize templates, publish to custom domains, and manage applicants end to end."
			title="Recruitify"
		/>
	);
};

export default MarketingHomePage;
