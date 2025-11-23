"use client";

import { useEffect, useMemo, useRef } from "react";
import { themeConfigToCSSVariables } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { isValidThemeConfig, type ThemeConfig } from "@/types/theme";

interface CSSVariablesInjectorProps {
	/**
	 * Theme ID to fetch from the database.
	 * If provided, themeConfig will be ignored.
	 */
	themeId?: string | null;

	/**
	 * Direct theme configuration object.
	 * Used when themeId is not provided.
	 */
	themeConfig?: ThemeConfig | null;

	/**
	 * Scope of CSS variables injection.
	 * - "global": Injects into document root (html element)
	 * - "container": Injects into the component's container (default)
	 */
	scope?: "global" | "container";

	/**
	 * CSS class name for the container (only used when scope is "container")
	 */
	className?: string;

	/**
	 * Children to render inside the container
	 */
	children?: React.ReactNode;
}

/**
 * Component that injects CSS variables from a theme into the DOM.
 * Can inject globally or scoped to a container.
 */
export function CSSVariablesInjector({
	themeId,
	themeConfig,
	scope = "container",
	className,
	children,
}: CSSVariablesInjectorProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	// Fetch theme if themeId is provided
	const { data: theme } = api.theme.getById.useQuery(
		{ themeId: themeId ?? "" },
		{ enabled: Boolean(themeId) },
	);

	// Determine which config to use
	const config = useMemo(() => {
		if (themeId && theme) {
			return isValidThemeConfig(theme.config)
				? (theme.config as ThemeConfig)
				: null;
		}
		return themeConfig ?? null;
	}, [themeId, theme, themeConfig]);

	// Generate CSS variables from config
	const cssVariables = useMemo(() => {
		if (!config) return {};
		return themeConfigToCSSVariables(config);
	}, [config]);

	// Inject CSS variables into DOM
	useEffect(() => {
		if (!config || Object.keys(cssVariables).length === 0) return;

		if (scope === "global") {
			// Inject into document root
			const root = document.documentElement;
			Object.entries(cssVariables).forEach(([key, value]) => {
				root.style.setProperty(key, value);
			});

			// Cleanup: remove variables when component unmounts or theme changes
			return () => {
				Object.keys(cssVariables).forEach((key) => {
					root.style.removeProperty(key);
				});
			};
		} else {
			// Inject into container
			const container = containerRef.current;
			if (!container) return;

			Object.entries(cssVariables).forEach(([key, value]) => {
				container.style.setProperty(key, value);
			});

			// Cleanup is handled by React when the component unmounts
		}
	}, [config, cssVariables, scope]);

	// If global scope, don't render a container
	if (scope === "global") {
		return <>{children}</>;
	}

	// Container scope: render a div with the CSS variables
	return (
		<div
			className={cn(className)}
			ref={containerRef}
			style={cssVariables as React.CSSProperties}
		>
			{children}
		</div>
	);
}
