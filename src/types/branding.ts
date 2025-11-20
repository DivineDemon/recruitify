/**
 * Branding-related type definitions and re-exports
 */

// Re-export theme types for convenience
export type {
	CreateThemeInput,
	Theme,
	ThemeConfig,
	UpdateThemeInput,
} from "./theme";

export {
	createThemeInputSchema,
	themeConfigSchema,
	updateThemeInputSchema,
} from "./theme";

/**
 * Logo selection type (MediaAsset with type LOGO)
 */
export interface Logo {
	id: string;
	agencyId: string;
	uploaderId: string | null;
	type: "LOGO";
	url: string;
	size: number | null;
	metadata: Record<string, unknown> | null;
	createdAt: Date;
}

/**
 * Branding summary for an agency
 */
export interface AgencyBranding {
	themes: Array<{
		id: string;
		name: string;
		description: string | null;
		isDefault: boolean;
		usageCount: number; // How many templates use this theme
	}>;
	logos: Array<{
		id: string;
		url: string;
		usageCount: number; // How many templates use this logo
	}>;
	defaultThemeId: string | null;
}
