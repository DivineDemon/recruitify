import type { ThemeConfig } from "@/types/theme";
import { parseThemeConfig } from "@/types/theme";

/**
 * Generate CSS variables from ThemeConfig
 * Returns a string of CSS custom properties that can be injected into a style tag
 */
export function generateCSSVariables(config: ThemeConfig): string {
	const variables: string[] = [];

	// Colors
	variables.push(`--theme-primary: ${config.colors.primary};`);
	if (config.colors.primaryHover) {
		variables.push(`--theme-primary-hover: ${config.colors.primaryHover};`);
	}
	variables.push(
		`--theme-primary-foreground: ${config.colors.primaryForeground};`,
	);

	variables.push(`--theme-secondary: ${config.colors.secondary};`);
	if (config.colors.secondaryHover) {
		variables.push(`--theme-secondary-hover: ${config.colors.secondaryHover};`);
	}
	variables.push(
		`--theme-secondary-foreground: ${config.colors.secondaryForeground};`,
	);

	variables.push(`--theme-accent: ${config.colors.accent};`);
	if (config.colors.accentHover) {
		variables.push(`--theme-accent-hover: ${config.colors.accentHover};`);
	}
	variables.push(
		`--theme-accent-foreground: ${config.colors.accentForeground};`,
	);

	variables.push(`--theme-background: ${config.colors.background};`);
	variables.push(`--theme-surface: ${config.colors.surface};`);
	variables.push(`--theme-card: ${config.colors.card};`);
	variables.push(`--theme-card-foreground: ${config.colors.cardForeground};`);

	// Text colors
	variables.push(`--theme-text-primary: ${config.colors.text.primary};`);
	variables.push(`--theme-text-secondary: ${config.colors.text.secondary};`);
	variables.push(`--theme-text-muted: ${config.colors.text.muted};`);
	if (config.colors.text.inverse) {
		variables.push(`--theme-text-inverse: ${config.colors.text.inverse};`);
	}

	// Border colors
	variables.push(`--theme-border: ${config.colors.border};`);
	variables.push(`--theme-input: ${config.colors.input};`);
	variables.push(`--theme-ring: ${config.colors.ring};`);

	// Button colors
	variables.push(`--theme-button-primary: ${config.colors.button.primary};`);
	variables.push(
		`--theme-button-primary-hover: ${config.colors.button.primaryHover};`,
	);
	variables.push(
		`--theme-button-secondary: ${config.colors.button.secondary};`,
	);
	variables.push(
		`--theme-button-secondary-hover: ${config.colors.button.secondaryHover};`,
	);
	variables.push(
		`--theme-button-destructive: ${config.colors.button.destructive};`,
	);
	variables.push(
		`--theme-button-destructive-hover: ${config.colors.button.destructiveHover};`,
	);

	// Status colors
	if (config.colors.success) {
		variables.push(`--theme-success: ${config.colors.success};`);
	}
	if (config.colors.warning) {
		variables.push(`--theme-warning: ${config.colors.warning};`);
	}
	if (config.colors.error) {
		variables.push(`--theme-error: ${config.colors.error};`);
	}
	if (config.colors.info) {
		variables.push(`--theme-info: ${config.colors.info};`);
	}

	// Chart colors
	if (config.colors.chart) {
		if (config.colors.chart.primary) {
			variables.push(`--theme-chart-primary: ${config.colors.chart.primary};`);
		}
		if (config.colors.chart.secondary) {
			variables.push(
				`--theme-chart-secondary: ${config.colors.chart.secondary};`,
			);
		}
		if (config.colors.chart.tertiary) {
			variables.push(
				`--theme-chart-tertiary: ${config.colors.chart.tertiary};`,
			);
		}
	}

	// Typography - Font families
	variables.push(
		`--theme-font-primary: ${config.typography.fontFamily.primary};`,
	);
	if (config.typography.fontFamily.secondary) {
		variables.push(
			`--theme-font-secondary: ${config.typography.fontFamily.secondary};`,
		);
	}
	if (config.typography.fontFamily.monospace) {
		variables.push(
			`--theme-font-mono: ${config.typography.fontFamily.monospace};`,
		);
	}

	// Typography - Font sizes
	variables.push(`--theme-font-size-xs: ${config.typography.fontSize.xs};`);
	variables.push(`--theme-font-size-sm: ${config.typography.fontSize.sm};`);
	variables.push(`--theme-font-size-base: ${config.typography.fontSize.base};`);
	variables.push(`--theme-font-size-lg: ${config.typography.fontSize.lg};`);
	variables.push(`--theme-font-size-xl: ${config.typography.fontSize.xl};`);
	variables.push(
		`--theme-font-size-2xl: ${config.typography.fontSize["2xl"]};`,
	);
	variables.push(
		`--theme-font-size-3xl: ${config.typography.fontSize["3xl"]};`,
	);
	variables.push(
		`--theme-font-size-4xl: ${config.typography.fontSize["4xl"]};`,
	);
	variables.push(
		`--theme-font-size-5xl: ${config.typography.fontSize["5xl"]};`,
	);

	// Typography - Font weights
	variables.push(
		`--theme-font-weight-light: ${config.typography.fontWeight.light};`,
	);
	variables.push(
		`--theme-font-weight-normal: ${config.typography.fontWeight.normal};`,
	);
	variables.push(
		`--theme-font-weight-medium: ${config.typography.fontWeight.medium};`,
	);
	variables.push(
		`--theme-font-weight-semibold: ${config.typography.fontWeight.semibold};`,
	);
	variables.push(
		`--theme-font-weight-bold: ${config.typography.fontWeight.bold};`,
	);

	// Typography - Line heights
	variables.push(
		`--theme-line-height-tight: ${config.typography.lineHeight.tight};`,
	);
	variables.push(
		`--theme-line-height-normal: ${config.typography.lineHeight.normal};`,
	);
	variables.push(
		`--theme-line-height-relaxed: ${config.typography.lineHeight.relaxed};`,
	);

	// Spacing
	Object.entries(config.spacing).forEach(([key, value]) => {
		variables.push(`--theme-spacing-${key}: ${value};`);
	});

	// Border radius
	variables.push(`--theme-radius-none: ${config.borderRadius.none};`);
	variables.push(`--theme-radius-sm: ${config.borderRadius.sm};`);
	variables.push(`--theme-radius-md: ${config.borderRadius.md};`);
	variables.push(`--theme-radius-lg: ${config.borderRadius.lg};`);
	variables.push(`--theme-radius-xl: ${config.borderRadius.xl};`);
	variables.push(`--theme-radius-full: ${config.borderRadius.full};`);

	// Shadows
	if (config.shadows) {
		if (config.shadows.sm) {
			variables.push(`--theme-shadow-sm: ${config.shadows.sm};`);
		}
		if (config.shadows.md) {
			variables.push(`--theme-shadow-md: ${config.shadows.md};`);
		}
		if (config.shadows.lg) {
			variables.push(`--theme-shadow-lg: ${config.shadows.lg};`);
		}
		if (config.shadows.xl) {
			variables.push(`--theme-shadow-xl: ${config.shadows.xl};`);
		}
		if (config.shadows["2xl"]) {
			variables.push(`--theme-shadow-2xl: ${config.shadows["2xl"]};`);
		}
		if (config.shadows.inner) {
			variables.push(`--theme-shadow-inner: ${config.shadows.inner};`);
		}
		if (config.shadows.none) {
			variables.push(`--theme-shadow-none: ${config.shadows.none};`);
		}
	}

	// Transitions
	if (config.transitions) {
		if (config.transitions.duration) {
			if (config.transitions.duration.fast) {
				variables.push(
					`--theme-transition-duration-fast: ${config.transitions.duration.fast};`,
				);
			}
			if (config.transitions.duration.normal) {
				variables.push(
					`--theme-transition-duration-normal: ${config.transitions.duration.normal};`,
				);
			}
			if (config.transitions.duration.slow) {
				variables.push(
					`--theme-transition-duration-slow: ${config.transitions.duration.slow};`,
				);
			}
		}
		if (config.transitions.easing) {
			if (config.transitions.easing.default) {
				variables.push(
					`--theme-transition-easing-default: ${config.transitions.easing.default};`,
				);
			}
			if (config.transitions.easing.in) {
				variables.push(
					`--theme-transition-easing-in: ${config.transitions.easing.in};`,
				);
			}
			if (config.transitions.easing.out) {
				variables.push(
					`--theme-transition-easing-out: ${config.transitions.easing.out};`,
				);
			}
			if (config.transitions.easing.inOut) {
				variables.push(
					`--theme-transition-easing-in-out: ${config.transitions.easing.inOut};`,
				);
			}
		}
	}

	return variables.join("\n");
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
