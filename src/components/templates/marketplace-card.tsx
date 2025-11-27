"use client";

import { Eye, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MarketplaceCardProps {
	template: {
		id: string;
		title: string;
		description: string | null;
		previewImageUrl: string | null;
		category: string | null;
		tags: unknown;
	};
	onPreview: () => void;
}

export function MarketplaceCard({ template, onPreview }: MarketplaceCardProps) {
	const tags = Array.isArray(template.tags) ? template.tags : [];

	return (
		<div className="group relative flex flex-col gap-3 overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
			{/* Preview Image */}
			<div className="relative aspect-video w-full overflow-hidden bg-muted">
				{template.previewImageUrl ? (
					<Image
						alt={template.title}
						className="object-cover transition-transform group-hover:scale-105"
						fill
						src={template.previewImageUrl}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<Sparkles className="size-12 text-muted-foreground" />
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex flex-col gap-2 px-4 pb-4">
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1">
						<h3 className="font-semibold text-base leading-tight">
							{template.title}
						</h3>
						{template.category && (
							<p className="text-muted-foreground text-xs">
								{template.category}
							</p>
						)}
					</div>
				</div>

				{template.description && (
					<p className="line-clamp-2 text-muted-foreground text-sm">
						{template.description}
					</p>
				)}

				{/* Tags */}
				{tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{tags.slice(0, 3).map((tag: string, index: number) => (
							<span
								className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs"
								key={`${template.id}-tag-${tag}-${index}`}
							>
								{tag}
							</span>
						))}
						{tags.length > 3 && (
							<span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
								+{tags.length - 3}
							</span>
						)}
					</div>
				)}

				{/* Actions */}
				<Button
					className="mt-2 w-full"
					onClick={onPreview}
					size="sm"
					variant="outline"
				>
					<Eye className="mr-1 size-3" />
					Preview
				</Button>
			</div>
		</div>
	);
}
