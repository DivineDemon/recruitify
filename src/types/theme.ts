import { z } from "zod";

/**
 * Theme Configuration - The JSON structure stored in Theme.config
 * Defines all design tokens: colors, typography, spacing, etc.
 */
export interface ThemeConfig {
	colors: {
		// Primary colors
		primary: string;
		primaryHover?: string;
		primaryForeground: string;

		// Secondary colors
		secondary: string;
		secondaryHover?: string;
		secondaryForeground: string;

		// Accent colors
		accent: string;
		accentHover?: string;
		accentForeground: string;

		// Background colors
		background: string;
		surface: string;
		card: string;
		cardForeground: string;

		// Text colors
		text: {
			primary: string;
			secondary: string;
			muted: string;
			inverse?: string;
		};

		// Border colors
		border: string;
		input: string;
		ring: string;

		// Button colors
		button: {
			primary: string;
			primaryHover: string;
			secondary: string;
			secondaryHover: string;
			destructive: string;
			destructiveHover: string;
		};

		// Status colors
		success?: string;
		warning?: string;
		error?: string;
		info?: string;

		// Chart colors (optional)
		chart?: {
			primary?: string;
			secondary?: string;
			tertiary?: string;
		};
	};

	typography: {
		fontFamily: {
			primary: string;
			secondary?: string;
			monospace?: string;
		};
		fontSize: {
			xs: string;
			sm: string;
			base: string;
			lg: string;
			xl: string;
			"2xl": string;
			"3xl": string;
			"4xl": string;
			"5xl": string;
		};
		fontWeight: {
			light: number;
			normal: number;
			medium: number;
			semibold: number;
			bold: number;
		};
		lineHeight: {
			tight: number;
			normal: number;
			relaxed: number;
		};
	};

	spacing: {
		"0": string;
		"1": string;
		"2": string;
		"3": string;
		"4": string;
		"5": string;
		"6": string;
		"8": string;
		"10": string;
		"12": string;
		"16": string;
		"20": string;
		"24": string;
		"32": string;
		"40": string;
		"48": string;
		"64": string;
	};

	borderRadius: {
		none: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
		full: string;
	};

	shadows?: {
		sm?: string;
		md?: string;
		lg?: string;
		xl?: string;
		"2xl"?: string;
		inner?: string;
		none?: string;
	};

	transitions?: {
		duration?: {
			fast?: string;
			normal?: string;
			slow?: string;
		};
		easing?: {
			default?: string;
			in?: string;
			out?: string;
			inOut?: string;
		};
	};
}

/**
 * Theme model type (matches Prisma model)
 */
export interface Theme {
	id: string;
	agencyId: string;
	name: string;
	description: string | null;
	config: ThemeConfig;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Zod schema for ThemeConfig validation
 */
export const themeConfigSchema = z.object({
	colors: z.object({
		primary: z.string(),
		primaryHover: z.string().optional(),
		primaryForeground: z.string(),
		secondary: z.string(),
		secondaryHover: z.string().optional(),
		secondaryForeground: z.string(),
		accent: z.string(),
		accentHover: z.string().optional(),
		accentForeground: z.string(),
		background: z.string(),
		surface: z.string(),
		card: z.string(),
		cardForeground: z.string(),
		text: z.object({
			primary: z.string(),
			secondary: z.string(),
			muted: z.string(),
			inverse: z.string().optional(),
		}),
		border: z.string(),
		input: z.string(),
		ring: z.string(),
		button: z.object({
			primary: z.string(),
			primaryHover: z.string(),
			secondary: z.string(),
			secondaryHover: z.string(),
			destructive: z.string(),
			destructiveHover: z.string(),
		}),
		success: z.string().optional(),
		warning: z.string().optional(),
		error: z.string().optional(),
		info: z.string().optional(),
		chart: z
			.object({
				primary: z.string().optional(),
				secondary: z.string().optional(),
				tertiary: z.string().optional(),
			})
			.optional(),
	}),
	typography: z.object({
		fontFamily: z.object({
			primary: z.string(),
			secondary: z.string().optional(),
			monospace: z.string().optional(),
		}),
		fontSize: z.object({
			xs: z.string(),
			sm: z.string(),
			base: z.string(),
			lg: z.string(),
			xl: z.string(),
			"2xl": z.string(),
			"3xl": z.string(),
			"4xl": z.string(),
			"5xl": z.string(),
		}),
		fontWeight: z.object({
			light: z.number(),
			normal: z.number(),
			medium: z.number(),
			semibold: z.number(),
			bold: z.number(),
		}),
		lineHeight: z.object({
			tight: z.number(),
			normal: z.number(),
			relaxed: z.number(),
		}),
	}),
	spacing: z.object({
		"0": z.string(),
		"1": z.string(),
		"2": z.string(),
		"3": z.string(),
		"4": z.string(),
		"5": z.string(),
		"6": z.string(),
		"8": z.string(),
		"10": z.string(),
		"12": z.string(),
		"16": z.string(),
		"20": z.string(),
		"24": z.string(),
		"32": z.string(),
		"40": z.string(),
		"48": z.string(),
		"64": z.string(),
	}),
	borderRadius: z.object({
		none: z.string(),
		sm: z.string(),
		md: z.string(),
		lg: z.string(),
		xl: z.string(),
		full: z.string(),
	}),
	shadows: z
		.object({
			sm: z.string().optional(),
			md: z.string().optional(),
			lg: z.string().optional(),
			xl: z.string().optional(),
			"2xl": z.string().optional(),
			inner: z.string().optional(),
			none: z.string().optional(),
		})
		.optional(),
	transitions: z
		.object({
			duration: z
				.object({
					fast: z.string().optional(),
					normal: z.string().optional(),
					slow: z.string().optional(),
				})
				.optional(),
			easing: z
				.object({
					default: z.string().optional(),
					in: z.string().optional(),
					out: z.string().optional(),
					inOut: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
});

/**
 * Zod schema for creating a new theme
 */
export const createThemeInputSchema = z.object({
	name: z.string().min(1).max(120),
	description: z.string().max(512).optional().nullable(),
	config: themeConfigSchema,
});

/**
 * Zod schema for updating a theme (only name/description, NOT config)
 */
export const updateThemeInputSchema = z.object({
	name: z.string().min(1).max(120).optional(),
	description: z.string().max(512).optional().nullable(),
});

/**
 * Type inference from Zod schemas
 */
export type CreateThemeInput = z.infer<typeof createThemeInputSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeInputSchema>;

/**
 * Type guard to check if an object is a valid ThemeConfig
 */
export function isValidThemeConfig(value: unknown): value is ThemeConfig {
	return themeConfigSchema.safeParse(value).success;
}

/**
 * Validate and parse ThemeConfig from unknown value
 * @throws {z.ZodError} if validation fails
 */
export function parseThemeConfig(value: unknown): ThemeConfig {
	return themeConfigSchema.parse(value) as ThemeConfig;
}
