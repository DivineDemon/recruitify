"use client";

import Link from "next/link";
import { PagePlaceholder } from "@/components/page-placeholder";

const MarketingHomePage = () => {
	return (
		<PagePlaceholder
			actions={
				<div className="flex flex-col items-center gap-3">
					<Link
						className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm outline-none transition-all hover:bg-primary/90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
