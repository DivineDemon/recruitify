import Link from "next/link";

import { PagePlaceholder } from "@/components/page-placeholder";

const marketingTemplates = [
	{
		slug: "modern-agency",
		title: "Modern Agency",
		description:
			"Clean layout with hero, featured roles, testimonials, and application form.",
	},
	{
		slug: "enterprise-recruiting",
		title: "Enterprise Recruiting",
		description:
			"Optimized for large hiring teams with analytics callouts and case studies.",
	},
	{
		slug: "startup-talent",
		title: "Startup Talent",
		description:
			"Vibrant single-page design tailored to fast-growing startups.",
	},
];

const MarketingTemplatesPage = () => {
	return (
		<PagePlaceholder
			actions={
				<ul className="grid gap-4 text-left sm:grid-cols-2">
					{marketingTemplates.map((template) => (
						<li
							className="rounded-lg border p-4 transition hover:border-primary hover:bg-primary/5"
							key={template.slug}
						>
							<h3 className="font-semibold text-base">{template.title}</h3>
							<p className="text-muted-foreground text-sm">
								{template.description}
							</p>
							<Link
								className="mt-3 inline-flex font-medium text-primary text-sm hover:underline"
								href={`/templates/${template.slug}`}
							>
								View preview
							</Link>
						</li>
					))}
				</ul>
			}
			description="Browse a few of our pre-designed recruitment templates. Sign in to customize and publish them for your agency."
			title="Template gallery"
		/>
	);
};

export default MarketingTemplatesPage;
