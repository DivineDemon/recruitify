import type { ThemeConfig } from "@/types/theme";
import { parseThemeConfig } from "@/types/theme";

type ThemeVariableMap = Record<string, string>;

function buildThemeVariableMap(config: ThemeConfig): ThemeVariableMap {
	const variables: ThemeVariableMap = {};
	const setVar = (key: string, value: string | number | undefined | null) => {
		if (value === undefined || value === null) {
			return;
		}
		variables[key] = `${value}`;
	};

	// Colors
	setVar("--theme-primary", config.colors.primary);
	setVar("--theme-primary-hover", config.colors.primaryHover);
	setVar("--theme-primary-foreground", config.colors.primaryForeground);

	setVar("--theme-secondary", config.colors.secondary);
	setVar("--theme-secondary-hover", config.colors.secondaryHover);
	setVar("--theme-secondary-foreground", config.colors.secondaryForeground);

	setVar("--theme-accent", config.colors.accent);
	setVar("--theme-accent-hover", config.colors.accentHover);
	setVar("--theme-accent-foreground", config.colors.accentForeground);

	setVar("--theme-background", config.colors.background);
	setVar("--theme-surface", config.colors.surface);
	setVar("--theme-card", config.colors.card);
	setVar("--theme-card-foreground", config.colors.cardForeground);

	// Text colors
	setVar("--theme-text-primary", config.colors.text.primary);
	setVar("--theme-text-secondary", config.colors.text.secondary);
	setVar("--theme-text-muted", config.colors.text.muted);
	setVar("--theme-text-inverse", config.colors.text.inverse);

	// Border colors
	setVar("--theme-border", config.colors.border);
	setVar("--theme-input", config.colors.input);
	setVar("--theme-ring", config.colors.ring);

	// Button colors
	setVar("--theme-button-primary", config.colors.button.primary);
	setVar("--theme-button-primary-hover", config.colors.button.primaryHover);
	setVar("--theme-button-secondary", config.colors.button.secondary);
	setVar("--theme-button-secondary-hover", config.colors.button.secondaryHover);
	setVar("--theme-button-destructive", config.colors.button.destructive);
	setVar(
		"--theme-button-destructive-hover",
		config.colors.button.destructiveHover,
	);

	// Status colors
	setVar("--theme-success", config.colors.success);
	setVar("--theme-warning", config.colors.warning);
	setVar("--theme-error", config.colors.error);
	setVar("--theme-info", config.colors.info);

	// Chart colors
	setVar("--theme-chart-primary", config.colors.chart?.primary);
	setVar("--theme-chart-secondary", config.colors.chart?.secondary);
	setVar("--theme-chart-tertiary", config.colors.chart?.tertiary);

	// Typography - Font families
	setVar("--theme-font-primary", config.typography.fontFamily.primary);
	setVar("--theme-font-secondary", config.typography.fontFamily.secondary);
	setVar("--theme-font-mono", config.typography.fontFamily.monospace);

	// Typography - Font sizes
	setVar("--theme-font-size-xs", config.typography.fontSize.xs);
	setVar("--theme-font-size-sm", config.typography.fontSize.sm);
	setVar("--theme-font-size-base", config.typography.fontSize.base);
	setVar("--theme-font-size-lg", config.typography.fontSize.lg);
	setVar("--theme-font-size-xl", config.typography.fontSize.xl);
	setVar("--theme-font-size-2xl", config.typography.fontSize["2xl"]);
	setVar("--theme-font-size-3xl", config.typography.fontSize["3xl"]);
	setVar("--theme-font-size-4xl", config.typography.fontSize["4xl"]);
	setVar("--theme-font-size-5xl", config.typography.fontSize["5xl"]);

	// Typography - Font weights
	setVar("--theme-font-weight-light", config.typography.fontWeight.light);
	setVar("--theme-font-weight-normal", config.typography.fontWeight.normal);
	setVar("--theme-font-weight-medium", config.typography.fontWeight.medium);
	setVar("--theme-font-weight-semibold", config.typography.fontWeight.semibold);
	setVar("--theme-font-weight-bold", config.typography.fontWeight.bold);

	// Typography - Line heights
	setVar("--theme-line-height-tight", config.typography.lineHeight.tight);
	setVar("--theme-line-height-normal", config.typography.lineHeight.normal);
	setVar("--theme-line-height-relaxed", config.typography.lineHeight.relaxed);

	// Spacing
	Object.entries(config.spacing).forEach(([key, value]) => {
		setVar(`--theme-spacing-${key}`, value);
	});

	// Border radius
	setVar("--theme-radius-none", config.borderRadius.none);
	setVar("--theme-radius-sm", config.borderRadius.sm);
	setVar("--theme-radius-md", config.borderRadius.md);
	setVar("--theme-radius-lg", config.borderRadius.lg);
	setVar("--theme-radius-xl", config.borderRadius.xl);
	setVar("--theme-radius-full", config.borderRadius.full);

	// Shadows
	setVar("--theme-shadow-sm", config.shadows?.sm);
	setVar("--theme-shadow-md", config.shadows?.md);
	setVar("--theme-shadow-lg", config.shadows?.lg);
	setVar("--theme-shadow-xl", config.shadows?.xl);
	setVar("--theme-shadow-2xl", config.shadows?.["2xl"]);
	setVar("--theme-shadow-inner", config.shadows?.inner);
	setVar("--theme-shadow-none", config.shadows?.none);

	// Transitions
	setVar(
		"--theme-transition-duration-fast",
		config.transitions?.duration?.fast,
	);
	setVar(
		"--theme-transition-duration-normal",
		config.transitions?.duration?.normal,
	);
	setVar(
		"--theme-transition-duration-slow",
		config.transitions?.duration?.slow,
	);

	setVar(
		"--theme-transition-easing-default",
		config.transitions?.easing?.default,
	);
	setVar("--theme-transition-easing-in", config.transitions?.easing?.in);
	setVar("--theme-transition-easing-out", config.transitions?.easing?.out);
	setVar("--theme-transition-easing-in-out", config.transitions?.easing?.inOut);

	return variables;
}

/**
 * Generate CSS variables from ThemeConfig
 * Returns a string of CSS custom properties that can be injected into a style tag
 */
export function generateCSSVariables(config: ThemeConfig): string {
	const variables = buildThemeVariableMap(config);
	return Object.entries(variables)
		.map(([key, value]) => `${key}: ${value};`)
		.join("\n");
}

export function themeConfigToCSSVariables(
	config: ThemeConfig,
): ThemeVariableMap {
	return buildThemeVariableMap(config);
}

/**
 * Validate theme config structure
 * @throws {z.ZodError} if validation fails
 */
export function validateThemeConfig(config: unknown): ThemeConfig {
	return parseThemeConfig(config);
}

/**
 * Get default theme configuration
 * Returns a sensible default theme that can be used as a starting point
 */
export function getDefaultThemeConfig(): ThemeConfig {
	return {
		colors: {
			primary: "#3b82f6",
			primaryHover: "#2563eb",
			primaryForeground: "#ffffff",
			secondary: "#64748b",
			secondaryHover: "#475569",
			secondaryForeground: "#ffffff",
			accent: "#f59e0b",
			accentHover: "#d97706",
			accentForeground: "#ffffff",
			background: "#ffffff",
			surface: "#f8fafc",
			card: "#ffffff",
			cardForeground: "#1e293b",
			text: {
				primary: "#1e293b",
				secondary: "#64748b",
				muted: "#94a3b8",
				inverse: "#ffffff",
			},
			border: "#e2e8f0",
			input: "#e2e8f0",
			ring: "#3b82f6",
			button: {
				primary: "#3b82f6",
				primaryHover: "#2563eb",
				secondary: "#64748b",
				secondaryHover: "#475569",
				destructive: "#ef4444",
				destructiveHover: "#dc2626",
			},
			success: "#10b981",
			warning: "#f59e0b",
			error: "#ef4444",
			info: "#3b82f6",
			chart: {
				primary: "#3b82f6",
				secondary: "#10b981",
				tertiary: "#f59e0b",
			},
		},
		typography: {
			fontFamily: {
				primary: "Inter, system-ui, sans-serif",
				secondary: "Georgia, serif",
				monospace: "Menlo, Monaco, 'Courier New', monospace",
			},
			fontSize: {
				xs: "0.75rem",
				sm: "0.875rem",
				base: "1rem",
				lg: "1.125rem",
				xl: "1.25rem",
				"2xl": "1.5rem",
				"3xl": "1.875rem",
				"4xl": "2.25rem",
				"5xl": "3rem",
			},
			fontWeight: {
				light: 300,
				normal: 400,
				medium: 500,
				semibold: 600,
				bold: 700,
			},
			lineHeight: {
				tight: 1.25,
				normal: 1.5,
				relaxed: 1.75,
			},
		},
		spacing: {
			"0": "0",
			"1": "0.25rem",
			"2": "0.5rem",
			"3": "0.75rem",
			"4": "1rem",
			"5": "1.25rem",
			"6": "1.5rem",
			"8": "2rem",
			"10": "2.5rem",
			"12": "3rem",
			"16": "4rem",
			"20": "5rem",
			"24": "6rem",
			"32": "8rem",
			"40": "10rem",
			"48": "12rem",
			"64": "16rem",
		},
		borderRadius: {
			none: "0",
			sm: "0.125rem",
			md: "0.375rem",
			lg: "0.5rem",
			xl: "0.75rem",
			full: "9999px",
		},
		shadows: {
			sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
			md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
			lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
			xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
			"2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
			inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
			none: "none",
		},
		transitions: {
			duration: {
				fast: "150ms",
				normal: "200ms",
				slow: "300ms",
			},
			easing: {
				default: "cubic-bezier(0.4, 0, 0.2, 1)",
				in: "cubic-bezier(0.4, 0, 1, 1)",
				out: "cubic-bezier(0, 0, 0.2, 1)",
				inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
			},
		},
	};
}

/**
 * Merge theme configurations
 * Base theme is merged with overrides, with overrides taking precedence
 */
export function mergeThemeConfig(
	base: ThemeConfig,
	overrides: Partial<ThemeConfig>,
): ThemeConfig {
	return {
		colors: {
			...base.colors,
			...overrides.colors,
			text: {
				...base.colors.text,
				...overrides.colors?.text,
			},
			button: {
				...base.colors.button,
				...overrides.colors?.button,
			},
			chart: overrides.colors?.chart ?? base.colors.chart,
		},
		typography: {
			...base.typography,
			...overrides.typography,
			fontFamily: {
				...base.typography.fontFamily,
				...overrides.typography?.fontFamily,
			},
			fontSize: {
				...base.typography.fontSize,
				...overrides.typography?.fontSize,
			},
			fontWeight: {
				...base.typography.fontWeight,
				...overrides.typography?.fontWeight,
			},
			lineHeight: {
				...base.typography.lineHeight,
				...overrides.typography?.lineHeight,
			},
		},
		spacing: {
			...base.spacing,
			...overrides.spacing,
		},
		borderRadius: {
			...base.borderRadius,
			...overrides.borderRadius,
		},
		shadows: overrides.shadows ?? base.shadows,
		transitions: {
			...base.transitions,
			...overrides.transitions,
			duration: {
				...base.transitions?.duration,
				...overrides.transitions?.duration,
			},
			easing: {
				...base.transitions?.easing,
				...overrides.transitions?.easing,
			},
		},
	};
}

/**
 * Generate theme from AI (placeholder for Phase 5)
 * This will be implemented when AI theme generation is added
 */
export async function generateThemeFromAI(
	_prompt: string,
): Promise<ThemeConfig> {
	// TODO: Implement AI theme generation in Phase 5
	// For now, return default theme
	throw new Error("AI theme generation not yet implemented");
}
