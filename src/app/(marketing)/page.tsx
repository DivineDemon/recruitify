import Link from "next/link";
import { PagePlaceholder } from "@/components/page-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MarketingHomePage = () => {
	return (
		<PagePlaceholder
			actions={
				<div className="flex flex-col items-center gap-3">
					<Link
						className={cn(
							buttonVariants({
								variant: "default",
								size: "default",
							}),
						)}
						href="/signin"
					>
						Sign In
					</Link>
				</div>
			}
			description="A dedicated website builder for recruitment agencies. Customize templates, publish to custom domains, and manage applicants end to end."
			title="Recruitify"
		/>
	);
};

export default MarketingHomePage;
