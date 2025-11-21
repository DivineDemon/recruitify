"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ThemeConfig } from "@/types/theme";

export interface SpacingField {
	key: keyof ThemeConfig["spacing"];
	label: string;
	description: string;
	placeholder?: string;
}

interface SpacingEditorProps {
	fields: SpacingField[];
	spacingValues: ThemeConfig["spacing"];
	onChange: (key: SpacingField["key"], value: string) => void;
	previewKeys?: Array<SpacingField["key"]>;
}

export function SpacingEditor({
	fields,
	spacingValues,
	onChange,
	previewKeys,
}: SpacingEditorProps) {
	const previewTokens = React.useMemo(() => {
		if (previewKeys?.length) {
			return previewKeys;
		}
		return fields
			.map((field) => field.key)
			.filter((_key, index) => index < 6) as Array<SpacingField["key"]>;
	}, [fields, previewKeys]);

	return (
		<section className="flex flex-col gap-4 rounded-lg border p-4">
			<header>
				<h3 className="font-semibold text-sm">Spacing Scale</h3>
				<p className="text-muted-foreground text-sm">
					Define padding, margin, and gap tokens that stay consistent across
					builders and templates.
				</p>
			</header>

			<div className="grid gap-4 sm:grid-cols-2">
				{fields.map((field) => (
					<div
						className="flex flex-col gap-2"
						key={`spacing-field-${field.key}`}
					>
						<div className="flex flex-col gap-1">
							<Label htmlFor={`spacing-${field.key}`}>{field.label}</Label>
							<p className="text-muted-foreground text-xs">
								{field.description}
							</p>
						</div>
						<Input
							id={`spacing-${field.key}`}
							onChange={(event) => onChange(field.key, event.target.value)}
							placeholder={field.placeholder ?? "0.25rem"}
							value={spacingValues[field.key]}
						/>
					</div>
				))}
			</div>

			<div className="rounded-lg border bg-muted/30 p-4">
				<p className="text-muted-foreground text-xs uppercase tracking-wide">
					Visual preview
				</p>
				<div className="mt-4 grid gap-3 sm:grid-cols-2">
					{previewTokens.map((token) => {
						const spacingValue = spacingValues[token] || "0px";

						return (
							<div
								className="flex flex-col gap-2"
								key={`spacing-preview-${token}`}
							>
								<div className="flex items-center justify-between text-muted-foreground text-xs">
									<span>Spacing {token}</span>
									<span>{spacingValue}</span>
								</div>
								<div className="rounded-md border bg-background p-3">
									<div className="flex items-center gap-3">
										<div className="h-10 w-10 rounded-md border bg-card" />
										<div className="flex h-10 flex-1 items-center">
											<div
												className="w-full rounded-full bg-primary/40"
												style={{
													height: `calc(${spacingValue} / 2)`,
													minHeight: "2px",
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
