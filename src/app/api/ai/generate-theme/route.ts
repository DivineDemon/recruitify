import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	generateThemeFromColorPalette,
	generateThemeFromDescription,
	generateThemeFromLogo,
} from "@/lib/ai-theme-generator";
import type { ThemeConfig } from "@/types/theme";

const generateThemeRequestSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("logo"),
		logoUrl: z.string().url(),
	}),
	z.object({
		type: z.literal("description"),
		description: z.string().min(1).max(500),
	}),
	z.object({
		type: z.literal("colors"),
		colors: z
			.array(z.string().regex(/^#?[0-9A-Fa-f]{6}$/))
			.min(1)
			.max(10),
	}),
]);

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validated = generateThemeRequestSchema.parse(body);

		let themeConfig: ThemeConfig;

		switch (validated.type) {
			case "logo":
				themeConfig = await generateThemeFromLogo(validated.logoUrl);
				break;
			case "description":
				themeConfig = await generateThemeFromDescription(validated.description);
				break;
			case "colors":
				themeConfig = await generateThemeFromColorPalette(validated.colors);
				break;
			default:
				return NextResponse.json(
					{ error: "Invalid request type" },
					{ status: 400 },
				);
		}

		return NextResponse.json({ themeConfig });
	} catch (error) {
		console.error("Error in generate-theme API route:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to generate theme" },
			{ status: 500 },
		);
	}
}
