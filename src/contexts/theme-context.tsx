"use client";

import { createContext, useContext, useMemo } from "react";
import { api } from "@/trpc/react";
import { isValidThemeConfig, type ThemeConfig } from "@/types/theme";

interface ThemeContextValue {
	// Available themes and logos for the agency
	themes:
		| Array<{
				id: string;
				name: string;
				description: string | null;
				config: ThemeConfig | null;
				isDefault: boolean;
				createdAt: Date;
				updatedAt: Date;
		  }>
		| undefined;
	logos:
		| Array<{
				id: string;
				url: string;
				size: number | null;
				createdAt: Date;
				uploader: {
					name: string | null;
					email: string;
				} | null;
		  }>
		| undefined;

	// Current template's selected theme and logo
	selectedTheme: {
		id: string;
		name: string;
		description: string | null;
		config: ThemeConfig | null;
		isDefault: boolean;
	} | null;
	selectedLogo: {
		id: string;
		url: string;
		type: string;
	} | null;

	// Loading and error states
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
	agencyId: string;
	templateId?: string | null;
	children: React.ReactNode;
}

export function ThemeProvider({
	agencyId,
	templateId,
	children,
}: ThemeProviderProps) {
	// Fetch themes for the agency
	const {
		data: themes,
		isLoading: themesLoading,
		isError: themesError,
		error: themesErrorObj,
	} = api.theme.list.useQuery({ agencyId });

	// Fetch logos for the agency
	const {
		data: logos,
		isLoading: logosLoading,
		isError: logosError,
		error: logosErrorObj,
	} = api.media.list.useQuery({
		agencyId,
		type: "LOGO",
	});

	// Fetch template if templateId is provided
	const {
		data: template,
		isLoading: templateLoading,
		isError: templateError,
		error: templateErrorObj,
	} = api.template.get.useQuery(
		{ templateId: templateId ?? "" },
		{ enabled: !!templateId },
	);

	// Process themes to include validated configs
	const processedThemes = useMemo(() => {
		return themes?.map((theme) => ({
			...theme,
			config: isValidThemeConfig(theme.config)
				? (theme.config as ThemeConfig)
				: null,
		}));
	}, [themes]);

	// Get selected theme from template or find default
	// Note: template.selectedTheme only has basic info, so we need to find the full config from themes list
	const selectedTheme = useMemo(() => {
		if (template?.selectedTheme) {
			// Find the full theme config from the themes list
			const fullTheme = processedThemes?.find(
				(t) => t.id === template.selectedTheme?.id,
			);
			if (fullTheme) {
				return {
					id: fullTheme.id,
					name: fullTheme.name,
					description: fullTheme.description,
					config: fullTheme.config,
					isDefault: fullTheme.isDefault,
				};
			}
			// Fallback to basic info if full theme not found
			return {
				id: template.selectedTheme.id,
				name: template.selectedTheme.name,
				description: template.selectedTheme.description,
				config: null,
				isDefault: template.selectedTheme.isDefault,
			};
		}

		// If no template or no selected theme, find default theme
		if (processedThemes) {
			const defaultTheme = processedThemes.find((t) => t.isDefault);
			if (defaultTheme) {
				return {
					id: defaultTheme.id,
					name: defaultTheme.name,
					description: defaultTheme.description,
					config: defaultTheme.config,
					isDefault: defaultTheme.isDefault,
				};
			}
		}

		return null;
	}, [template?.selectedTheme, processedThemes]);

	// Get selected logo from template
	const selectedLogo = useMemo(() => {
		if (template?.selectedLogo) {
			return {
				id: template.selectedLogo.id,
				url: template.selectedLogo.url,
				type: template.selectedLogo.type,
			};
		}
		return null;
	}, [template?.selectedLogo]);

	// Aggregate loading and error states
	const isLoading =
		themesLoading || logosLoading || (!!templateId && templateLoading);
	const isError = themesError || logosError || (!!templateId && templateError);
	const error = themesErrorObj || logosErrorObj || templateErrorObj || null;

	const value: ThemeContextValue = {
		themes: processedThemes,
		logos: logos?.map((logo) => ({
			id: logo.id,
			url: logo.url,
			size: logo.size,
			createdAt: logo.createdAt,
			uploader: logo.uploader
				? {
						name: logo.uploader.name,
						email: logo.uploader.email,
					}
				: null,
		})),
		selectedTheme,
		selectedLogo,
		isLoading,
		isError,
		error: error as Error | null,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useThemeContext() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useThemeContext must be used within a ThemeProvider");
	}
	return context;
}
