"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { MarketplaceCard } from "@/components/templates/marketplace-card";
import { TemplatePreviewDialog } from "@/components/templates/template-preview-dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

interface MarketplaceClientProps {
	agencyId: string;
}

export function MarketplaceClient({ agencyId }: MarketplaceClientProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
		null,
	);

	const { data: templates, isLoading } =
		api.marketplace.listMarketplaceTemplates.useQuery({
			search: searchQuery || undefined,
		});

	// Filter templates by search query if needed (client-side filtering for tags)
	const filteredTemplates = templates?.filter((template) => {
		if (!searchQuery) return true;

		const query = searchQuery.toLowerCase();
		const titleMatch = template.title.toLowerCase().includes(query);
		const descriptionMatch = template.description
			?.toLowerCase()
			.includes(query);

		// Check tags if they exist
		let tagsMatch = false;
		if (template.tags && Array.isArray(template.tags)) {
			tagsMatch = template.tags.some(
				(tag) => typeof tag === "string" && tag.toLowerCase().includes(query),
			);
		}

		return titleMatch || descriptionMatch || tagsMatch;
	});

	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-5 p-5">
			<div className="flex w-full flex-col gap-5">
				<div className="flex flex-col gap-2.5">
					<h1 className="font-semibold text-[24px] leading-[24px] tracking-tight">
						Template Marketplace
					</h1>
					<p className="text-[14px] text-muted-foreground leading-[14px]">
						Browse pre-designed templates and use them as a starting point for
						your recruitment website.
					</p>
				</div>

				{/* Search */}
				<div className="relative w-full max-w-md">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
					<Input
						className="pl-9"
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search templates..."
						value={searchQuery}
					/>
				</div>
			</div>

			{/* Templates Grid */}
			{isLoading ? (
				<div className="flex h-full w-full items-center justify-center">
					<p className="text-muted-foreground text-sm">Loading templates...</p>
				</div>
			) : !filteredTemplates || filteredTemplates.length === 0 ? (
				<div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed p-10">
					<p className="text-center text-muted-foreground text-sm">
						{searchQuery
							? "No templates found matching your search."
							: "No marketplace templates available yet."}
					</p>
				</div>
			) : (
				<div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{filteredTemplates.map((template) => (
						<MarketplaceCard
							key={template.id}
							onPreview={() => setSelectedTemplateId(template.id)}
							template={template}
						/>
					))}
				</div>
			)}

			{/* Preview Dialog */}
			{selectedTemplateId && (
				<TemplatePreviewDialog
					agencyId={agencyId}
					onClose={() => setSelectedTemplateId(null)}
					templateId={selectedTemplateId}
				/>
			)}
		</div>
	);
}
