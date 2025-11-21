"use client";

import { Images, Info, Palette } from "lucide-react";
import { LogoLibrary } from "@/components/branding/logo-library";
import { ThemeLibrary } from "@/components/branding/theme-library";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandingSettingsClientProps {
	agencyId: string;
}

export function BrandingSettingsClient({
	agencyId,
}: BrandingSettingsClientProps) {
	const quickFacts = [
		{
			icon: Palette,
			title: "Themes",
			description:
				"Define reusable design tokens for colors, typography, spacing, and advanced effects.",
		},
		{
			icon: Images,
			title: "Logos",
			description:
				"Upload SVGs or transparent PNGs once and reuse them across builders and templates.",
		},
		{
			icon: Info,
			title: "Selections",
			description:
				"Each template picks a theme and logo from your library, preventing accidental edits.",
		},
	];

	return (
		<div className="flex h-full w-full flex-col gap-6 p-6">
			<div className="w-full max-w-5xl space-y-3">
				<div>
					<p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
						Agency · Branding
					</p>
					<h1 className="font-semibold text-3xl tracking-tight">
						Keep every template on-brand
					</h1>
					<p className="text-muted-foreground">
						Manage reusable themes, fonts, spacing tokens, and logo assets.
						Select them whenever you create a template so your team stays
						consistent.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					{quickFacts.map((fact) => (
						<div
							className="rounded-xl border bg-card p-4 shadow-sm"
							key={fact.title}
						>
							<div className="mb-3 flex items-center gap-2 font-semibold text-sm">
								<fact.icon className="size-4 text-primary" />
								<span>{fact.title}</span>
							</div>
							<p className="text-muted-foreground text-sm">
								{fact.description}
							</p>
						</div>
					))}
				</div>
			</div>

			<Tabs className="w-full max-w-5xl" defaultValue="themes">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="themes">Themes</TabsTrigger>
					<TabsTrigger value="logos">Logos</TabsTrigger>
				</TabsList>
				<TabsContent className="mt-6" value="themes">
					<ThemeLibrary agencyId={agencyId} />
				</TabsContent>
				<TabsContent className="mt-6" value="logos">
					<LogoLibrary agencyId={agencyId} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
