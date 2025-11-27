import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";
import { getDefaultThemeConfig } from "@/lib/theme";
import { parseThemeConfig, type ThemeConfig } from "@/types/theme";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/**
 * Generate a theme configuration from a logo image URL
 * Analyzes the logo colors and generates a complementary color palette
 */
export async function generateThemeFromLogo(
	logoUrl: string,
): Promise<ThemeConfig> {
	try {
		// Fetch the logo image
		const imageResponse = await fetch(logoUrl);
		if (!imageResponse.ok) {
			throw new Error(
				`Failed to fetch logo image: ${imageResponse.statusText}`,
			);
		}

		const imageBuffer = await imageResponse.arrayBuffer();
		const imageBase64 = Buffer.from(imageBuffer).toString("base64");
		const mimeType = imageResponse.headers.get("content-type") || "image/png";

		// Initialize Gemini model with vision capabilities
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt = `Analyze this logo image and generate a complete website theme configuration in JSON format.

The theme should:
1. Extract the primary colors from the logo
2. Generate a complementary color palette that works well with the logo
3. Create a professional, modern theme suitable for a recruitment/job portal website
4. Include all required theme properties: colors, typography, spacing, borderRadius, shadows, transitions

Return ONLY valid JSON matching this structure:
{
  "colors": {
    "primary": "#hex",
    "primaryHover": "#hex",
    "primaryForeground": "#hex",
    "secondary": "#hex",
    "secondaryHover": "#hex",
    "secondaryForeground": "#hex",
    "accent": "#hex",
    "accentHover": "#hex",
    "accentForeground": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "card": "#hex",
    "cardForeground": "#hex",
    "text": {
      "primary": "#hex",
      "secondary": "#hex",
      "muted": "#hex"
    },
    "border": "#hex",
    "input": "#hex",
    "ring": "#hex",
    "button": {
      "primary": "#hex",
      "primaryHover": "#hex",
      "secondary": "#hex",
      "secondaryHover": "#hex",
      "destructive": "#hex",
      "destructiveHover": "#hex"
    },
    "success": "#hex",
    "warning": "#hex",
    "error": "#hex",
    "info": "#hex"
  },
  "typography": {
    "fontFamily": {
      "primary": "font name",
      "secondary": "font name",
      "monospace": "font name"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "light": 300,
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.25,
      "normal": 1.5,
      "relaxed": 1.75
    }
  },
  "spacing": {
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
    "64": "16rem"
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    "none": "none"
  },
  "transitions": {
    "duration": {
      "fast": "150ms",
      "normal": "200ms",
      "slow": "300ms"
    },
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "inOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }
}

Return ONLY the JSON object, no markdown, no code blocks, no explanation.`;

		const result = await model.generateContent([
			prompt,
			{
				inlineData: {
					data: imageBase64,
					mimeType,
				},
			},
		]);

		const response = await result.response;
		const text = response.text();

		// Extract JSON from response (handle markdown code blocks if present)
		let jsonText = text.trim();
		if (jsonText.startsWith("```")) {
			jsonText = jsonText
				.replace(/^```(?:json)?\n?/i, "")
				.replace(/\n?```$/i, "");
		}

		const themeConfig = JSON.parse(jsonText) as unknown;
		return parseThemeConfig(themeConfig);
	} catch (error) {
		console.error("Error generating theme from logo:", error);
		// Fallback to default theme on error
		return getDefaultThemeConfig();
	}
}

/**
 * Generate a theme configuration from a text description
 * Takes a description like "modern blue professional" and generates a theme
 */
export async function generateThemeFromDescription(
	description: string,
): Promise<ThemeConfig> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt = `Generate a complete website theme configuration in JSON format based on this description: "${description}"

The theme should be suitable for a recruitment/job portal website and should be professional and modern.

Return ONLY valid JSON matching this structure:
{
  "colors": {
    "primary": "#hex",
    "primaryHover": "#hex",
    "primaryForeground": "#hex",
    "secondary": "#hex",
    "secondaryHover": "#hex",
    "secondaryForeground": "#hex",
    "accent": "#hex",
    "accentHover": "#hex",
    "accentForeground": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "card": "#hex",
    "cardForeground": "#hex",
    "text": {
      "primary": "#hex",
      "secondary": "#hex",
      "muted": "#hex"
    },
    "border": "#hex",
    "input": "#hex",
    "ring": "#hex",
    "button": {
      "primary": "#hex",
      "primaryHover": "#hex",
      "secondary": "#hex",
      "secondaryHover": "#hex",
      "destructive": "#hex",
      "destructiveHover": "#hex"
    },
    "success": "#hex",
    "warning": "#hex",
    "error": "#hex",
    "info": "#hex"
  },
  "typography": {
    "fontFamily": {
      "primary": "font name",
      "secondary": "font name",
      "monospace": "font name"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "light": 300,
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.25,
      "normal": 1.5,
      "relaxed": 1.75
    }
  },
  "spacing": {
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
    "64": "16rem"
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    "none": "none"
  },
  "transitions": {
    "duration": {
      "fast": "150ms",
      "normal": "200ms",
      "slow": "300ms"
    },
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "inOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }
}

Return ONLY the JSON object, no markdown, no code blocks, no explanation.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Extract JSON from response (handle markdown code blocks if present)
		let jsonText = text.trim();
		if (jsonText.startsWith("```")) {
			jsonText = jsonText
				.replace(/^```(?:json)?\n?/i, "")
				.replace(/\n?```$/i, "");
		}

		const themeConfig = JSON.parse(jsonText) as unknown;
		return parseThemeConfig(themeConfig);
	} catch (error) {
		console.error("Error generating theme from description:", error);
		// Fallback to default theme on error
		return getDefaultThemeConfig();
	}
}

/**
 * Generate a theme configuration from a color palette
 * Takes an array of colors and generates a full theme config
 */
export async function generateThemeFromColorPalette(
	colors: string[],
): Promise<ThemeConfig> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const colorsList = colors.join(", ");

		const prompt = `Generate a complete website theme configuration in JSON format based on these colors: ${colorsList}

Use these colors as the foundation and create a professional, modern theme suitable for a recruitment/job portal website. Generate complementary colors for the full palette.

Return ONLY valid JSON matching this structure:
{
  "colors": {
    "primary": "#hex",
    "primaryHover": "#hex",
    "primaryForeground": "#hex",
    "secondary": "#hex",
    "secondaryHover": "#hex",
    "secondaryForeground": "#hex",
    "accent": "#hex",
    "accentHover": "#hex",
    "accentForeground": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "card": "#hex",
    "cardForeground": "#hex",
    "text": {
      "primary": "#hex",
      "secondary": "#hex",
      "muted": "#hex"
    },
    "border": "#hex",
    "input": "#hex",
    "ring": "#hex",
    "button": {
      "primary": "#hex",
      "primaryHover": "#hex",
      "secondary": "#hex",
      "secondaryHover": "#hex",
      "destructive": "#hex",
      "destructiveHover": "#hex"
    },
    "success": "#hex",
    "warning": "#hex",
    "error": "#hex",
    "info": "#hex"
  },
  "typography": {
    "fontFamily": {
      "primary": "font name",
      "secondary": "font name",
      "monospace": "font name"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "light": 300,
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.25,
      "normal": 1.5,
      "relaxed": 1.75
    }
  },
  "spacing": {
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
    "64": "16rem"
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    "none": "none"
  },
  "transitions": {
    "duration": {
      "fast": "150ms",
      "normal": "200ms",
      "slow": "300ms"
    },
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "inOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }
}

Return ONLY the JSON object, no markdown, no code blocks, no explanation.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Extract JSON from response (handle markdown code blocks if present)
		let jsonText = text.trim();
		if (jsonText.startsWith("```")) {
			jsonText = jsonText
				.replace(/^```(?:json)?\n?/i, "")
				.replace(/\n?```$/i, "");
		}

		const themeConfig = JSON.parse(jsonText) as unknown;
		return parseThemeConfig(themeConfig);
	} catch (error) {
		console.error("Error generating theme from color palette:", error);
		// Fallback to default theme on error
		return getDefaultThemeConfig();
	}
}
