"use client";

import { LogoLibrary } from "@/components/branding/logo-library";
import { ThemeLibrary } from "@/components/branding/theme-library";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandingSettingsClientProps {
	agencyId: string;
}

export function BrandingSettingsClient({
	agencyId,
}: BrandingSettingsClientProps) {
	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-5 p-5">
			<div className="flex w-full max-w-4xl flex-col items-center justify-center gap-2.5">
				<h1 className="w-full text-left font-semibold text-[24px] leading-[24px] tracking-tight">
					Branding Settings
				</h1>
				<p className="w-full text-left text-[14px] text-muted-foreground leading-[14px]">
					Manage themes and logos for your agency. Themes define colors,
					typography, and spacing. Logos can be used across templates.
				</p>
			</div>

			<Tabs className="w-full max-w-4xl" defaultValue="themes">
				<TabsList>
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
