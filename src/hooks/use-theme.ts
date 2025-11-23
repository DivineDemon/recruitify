import { useThemeContext } from "@/contexts/theme-context";

/**
 * Hook to access theme context
 * Provides access to:
 * - Available themes and logos for the agency
 * - Current template's selected theme/logo
 * - Loading and error states
 */
export function useTheme() {
	return useThemeContext();
}
