"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ColorGroup } from "@/components/branding/color-group";
import {
	SpacingEditor,
	type SpacingField,
} from "@/components/branding/spacing-editor";
import { ThemePreview } from "@/components/branding/theme-preview";
import {
	type FontOption,
	TypographyEditor,
} from "@/components/branding/typography-editor";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDefaultThemeConfig } from "@/lib/theme";
import { api } from "@/trpc/react";
import type { ThemeConfig } from "@/types/theme";

interface ThemeCreatorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	agencyId: string;
}

export function ThemeCreator({
	open,
	onOpenChange,
	agencyId,
}: ThemeCreatorProps) {
	const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() =>
		getDefaultThemeConfig(),
	);

	const FONT_OPTIONS: FontOption[] = [
		{ label: "Inter", value: "Inter, system-ui, sans-serif" },
		{
			label: "Geist Sans",
			value: "var(--font-geist-sans), system-ui, sans-serif",
		},
		{ label: "Roboto", value: "Roboto, system-ui, sans-serif" },
		{ label: "Open Sans", value: '"Open Sans", system-ui, sans-serif' },
		{ label: "Playfair Display", value: '"Playfair Display", Georgia, serif' },
		{ label: "Merriweather", value: "Merriweather, Georgia, serif" },
		{ label: "Space Mono", value: '"Space Mono", Menlo, monospace' },
	];

	const metadataSchema = z.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		description: z.string().max(512).optional(),
		isDefault: z.boolean(),
		primaryFont: z.string().min(1),
		secondaryFont: z.string().min(1),
	});

	const form = useForm<z.infer<typeof metadataSchema>>({
		resolver: zodResolver(metadataSchema),
		defaultValues: {
			name: "",
			description: "",
			isDefault: false,
			primaryFont: getDefaultThemeConfig().typography.fontFamily.primary,
			secondaryFont: getDefaultThemeConfig().typography.fontFamily.secondary,
		},
	});

	const cloneThemeConfig = useCallback(
		(config: ThemeConfig) => JSON.parse(JSON.stringify(config)) as ThemeConfig,
		[],
	);

	const utils = api.useUtils();
	const createTheme = api.theme.create.useMutation({
		onSuccess: () => {
			utils.theme.list.invalidate();
			onOpenChange(false);
			resetForm();
			toast.success("Theme created successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create theme");
		},
	});

	const resetForm = useCallback(() => {
		const defaults = getDefaultThemeConfig();
		form.reset({
			name: "",
			description: "",
			isDefault: false,
			primaryFont: defaults.typography.fontFamily.primary,
			secondaryFont: defaults.typography.fontFamily.secondary,
		});
		setThemeConfig(defaults);
	}, [form]);

	useEffect(() => {
		if (!open) {
			resetForm();
		}
	}, [open, resetForm]);

	const updateConfigAtPath = useCallback(
		(path: string[], value: string | number) => {
			setThemeConfig((prev) => {
				const updated = cloneThemeConfig(prev);
				if (path.length === 0) {
					return updated;
				}

				let pointer: Record<string, unknown> = updated as unknown as Record<
					string,
					unknown
				>;

				path.forEach((segment, index) => {
					if (index === path.length - 1) {
						pointer[segment] = value;
						return;
					}

					const next = pointer[segment];
					if (typeof next !== "object" || next === null) {
						pointer[segment] = {};
					}
					pointer = pointer[segment] as Record<string, unknown>;
				});

				return updated;
			});
		},
		[cloneThemeConfig],
	);

	const handleColorGroupChange = useCallback(
		(id: string, value: string) => {
			updateConfigAtPath(id.split("."), value);
		},
		[updateConfigAtPath],
	);

	const handleTypographyChange = (path: string) => (value: string | number) => {
		updateConfigAtPath(path.split("."), value);
	};

	const handleNumericTypographyChange = (path: string) => (value: string) => {
		const numericValue = Number(value);
		updateConfigAtPath(
			path.split("."),
			Number.isNaN(numericValue) ? value : numericValue,
		);
	};

	const handleSpacingValueChange = useCallback(
		(key: keyof ThemeConfig["spacing"], value: string) => {
			updateConfigAtPath(["spacing", key], value);
		},
		[updateConfigAtPath],
	);

	const handleCreate = form.handleSubmit((values) => {
		createTheme.mutate({
			agencyId,
			name: values.name.trim(),
			description: values.description?.trim() || null,
			config: themeConfig,
			isDefault: values.isDefault,
		});
	});

	const handleClose = () => {
		onOpenChange(false);
		resetForm();
	};

	const brandColorFields = useMemo(
		() => [
			{
				id: "colors.primary",
				label: "Primary",
				value: themeConfig.colors.primary,
				description: "Buttons and key accents",
			},
			{
				id: "colors.primaryForeground",
				label: "Primary Foreground",
				value: themeConfig.colors.primaryForeground,
			},
			{
				id: "colors.secondary",
				label: "Secondary",
				value: themeConfig.colors.secondary,
				description: "Secondary emphasis elements",
			},
			{
				id: "colors.secondaryForeground",
				label: "Secondary Foreground",
				value: themeConfig.colors.secondaryForeground,
				description: "Text/icons on secondary elements",
			},
			{
				id: "colors.accent",
				label: "Accent",
				value: themeConfig.colors.accent,
				description: "Highlights like badges and chips",
			},
			{
				id: "colors.accentForeground",
				label: "Accent Foreground",
				value: themeConfig.colors.accentForeground,
				description: "Text/icons on accent surfaces",
			},
		],
		[themeConfig],
	);

	const surfaceColorFields = useMemo(
		() => [
			{
				id: "colors.background",
				label: "Background",
				value: themeConfig.colors.background,
				description: "Base canvas color",
			},
			{
				id: "colors.surface",
				label: "Surface",
				value: themeConfig.colors.surface,
				description: "Panels, sections, elevated surfaces",
			},
			{
				id: "colors.card",
				label: "Card",
				value: themeConfig.colors.card,
				description: "Cards, tiles, small containers",
			},
			{
				id: "colors.cardForeground",
				label: "Card Foreground",
				value: themeConfig.colors.cardForeground,
				description: "Text/icons on cards",
			},
			{
				id: "colors.border",
				label: "Border",
				value: themeConfig.colors.border,
				description: "Borders and dividers",
			},
			{
				id: "colors.input",
				label: "Input",
				value: themeConfig.colors.input,
				description: "Input backgrounds",
			},
			{
				id: "colors.ring",
				label: "Focus Ring",
				value: themeConfig.colors.ring,
				description: "Outline on focused controls",
			},
		],
		[themeConfig],
	);

	const textColorFields = useMemo(
		() => [
			{
				id: "colors.text.primary",
				label: "Text Primary",
				value: themeConfig.colors.text.primary,
				description: "Default body text",
			},
			{
				id: "colors.text.secondary",
				label: "Text Secondary",
				value: themeConfig.colors.text.secondary,
				description: "Muted labels and helper text",
			},
			{
				id: "colors.text.muted",
				label: "Text Muted",
				value: themeConfig.colors.text.muted,
				description: "Disabled or subtle copy",
			},
			{
				id: "colors.text.inverse",
				label: "Text Inverse",
				value: themeConfig.colors.text.inverse ?? "#ffffff",
				description: "Text/icons on dark backgrounds",
			},
		],
		[themeConfig],
	);

	const buttonColorFields = useMemo(
		() => [
			{
				id: "colors.button.primary",
				label: "Primary Button",
				value: themeConfig.colors.button.primary,
				description: "Primary call-to-action background",
			},
			{
				id: "colors.button.primaryHover",
				label: "Primary Hover",
				value: themeConfig.colors.button.primaryHover,
				description: "Hover state for primary CTAs",
			},
			{
				id: "colors.button.secondary",
				label: "Secondary Button",
				value: themeConfig.colors.button.secondary,
				description: "Secondary CTAs and ghost buttons",
			},
			{
				id: "colors.button.secondaryHover",
				label: "Secondary Hover",
				value: themeConfig.colors.button.secondaryHover,
				description: "Hover state for secondary CTAs",
			},
			{
				id: "colors.button.destructive",
				label: "Destructive Button",
				value: themeConfig.colors.button.destructive,
				description: "Danger actions like delete or reset",
			},
			{
				id: "colors.button.destructiveHover",
				label: "Destructive Hover",
				value: themeConfig.colors.button.destructiveHover,
				description: "Hover state for destructive actions",
			},
		],
		[themeConfig],
	);

	const feedbackColorFields = useMemo(
		() => [
			{
				id: "colors.success",
				label: "Success",
				value: themeConfig.colors.success ?? "#10b981",
				description: "Success alerts, badges, and charts",
			},
			{
				id: "colors.warning",
				label: "Warning",
				value: themeConfig.colors.warning ?? "#f59e0b",
				description: "Warnings, reminders, and banners",
			},
			{
				id: "colors.error",
				label: "Error",
				value: themeConfig.colors.error ?? "#ef4444",
				description: "Errors, destructive states, and alerts",
			},
			{
				id: "colors.info",
				label: "Info",
				value: themeConfig.colors.info ?? themeConfig.colors.primary,
				description: "Info chips, tooltips, and badges",
			},
		],
		[themeConfig],
	);

	const chartColorFields = useMemo(() => {
		const fallbackChart = {
			primary: themeConfig.colors.chart?.primary ?? themeConfig.colors.primary,
			secondary:
				themeConfig.colors.chart?.secondary ?? themeConfig.colors.secondary,
			tertiary: themeConfig.colors.chart?.tertiary ?? themeConfig.colors.accent,
		};

		return [
			{
				id: "colors.chart.primary",
				label: "Chart Primary",
				value: fallbackChart.primary,
				description: "Main data series",
			},
			{
				id: "colors.chart.secondary",
				label: "Chart Secondary",
				value: fallbackChart.secondary,
				description: "Comparative data series",
			},
			{
				id: "colors.chart.tertiary",
				label: "Chart Tertiary",
				value: fallbackChart.tertiary,
				description: "Highlights, tertiary data, or trendlines",
			},
		];
	}, [themeConfig]);

	const spacingFields = useMemo<SpacingField[]>(
		() => [
			{
				key: "0",
				label: "Spacing 0 (0px)",
				description: "Use when elements must sit flush without gaps.",
				placeholder: "0px",
			},
			{
				key: "1",
				label: "Spacing 1 (~4px)",
				description: "Micro spacing for tight iconography or label stacks.",
				placeholder: "0.25rem",
			},
			{
				key: "2",
				label: "Spacing 2 (~8px)",
				description: "Compact padding inside buttons or chips.",
				placeholder: "0.5rem",
			},
			{
				key: "3",
				label: "Spacing 3 (~12px)",
				description: "Comfortable gaps between text blocks.",
				placeholder: "0.75rem",
			},
			{
				key: "4",
				label: "Spacing 4 (~16px)",
				description: "Default padding for cards, modals, and panels.",
				placeholder: "1rem",
			},
			{
				key: "5",
				label: "Spacing 5 (~20px)",
				description: "Balanced spacing around form sections.",
				placeholder: "1.25rem",
			},
			{
				key: "6",
				label: "Spacing 6 (~24px)",
				description: "Spacing between stacked cards or CTA blocks.",
				placeholder: "1.5rem",
			},
			{
				key: "8",
				label: "Spacing 8 (~32px)",
				description: "Generous spacing for hero and feature bands.",
				placeholder: "2rem",
			},
			{
				key: "10",
				label: "Spacing 10 (~40px)",
				description: "Larger breathing room for pricing tables.",
				placeholder: "2.5rem",
			},
			{
				key: "12",
				label: "Spacing 12 (~48px)",
				description: "Use between major page sections.",
				placeholder: "3rem",
			},
			{
				key: "16",
				label: "Spacing 16 (~64px)",
				description: "Desktop gutters or wide section padding.",
				placeholder: "4rem",
			},
			{
				key: "20",
				label: "Spacing 20 (~80px)",
				description: "Hero-to-content spacing for landing pages.",
				placeholder: "5rem",
			},
			{
				key: "24",
				label: "Spacing 24 (~96px)",
				description: "Use for distinct content group separation.",
				placeholder: "6rem",
			},
			{
				key: "32",
				label: "Spacing 32 (~128px)",
				description: "Applies to billboard layouts on large screens.",
				placeholder: "8rem",
			},
			{
				key: "40",
				label: "Spacing 40 (~160px)",
				description: "Hero backgrounds with dramatic whitespace.",
				placeholder: "10rem",
			},
			{
				key: "48",
				label: "Spacing 48 (~192px)",
				description: "Campaign splash pages and full-bleed sections.",
				placeholder: "12rem",
			},
			{
				key: "64",
				label: "Spacing 64 (~256px)",
				description: "Maximum spacing for marquee elements.",
				placeholder: "16rem",
			},
		],
		[],
	);

	const borderRadiusFields = useMemo(
		() => [
			{ key: "none", label: "Radius None", description: "Sharp corners" },
			{ key: "sm", label: "Radius Small", description: "Subtle rounding" },
			{ key: "md", label: "Radius Medium", description: "Default rounding" },
			{ key: "lg", label: "Radius Large", description: "Large cards/sections" },
			{ key: "xl", label: "Radius XL", description: "Buttons, badges" },
			{
				key: "full",
				label: "Radius Full",
				description: "Pills/circular elements",
			},
		],
		[],
	);

	const shadowFields = useMemo(
		() => [
			{ key: "sm", label: "Shadow Small", description: "Subtle depth" },
			{ key: "md", label: "Shadow Medium", description: "Cards on hover" },
			{ key: "lg", label: "Shadow Large", description: "Modals and popovers" },
			{ key: "xl", label: "Shadow XL", description: "Deep elevations" },
			{ key: "2xl", label: "Shadow 2XL", description: "Hero sections" },
			{ key: "inner", label: "Shadow Inner", description: "Inset inputs" },
		],
		[],
	);

	const transitionDurationFields = useMemo(
		() => [
			{ key: "fast", label: "Fast", description: "Micro interactions (150ms)" },
			{ key: "normal", label: "Normal", description: "Buttons, menus (200ms)" },
			{ key: "slow", label: "Slow", description: "Large animations (300ms)" },
		],
		[],
	);

	const transitionEasingFields = useMemo(
		() => [
			{ key: "linear", label: "Linear", description: "Constant speed" },
			{
				key: "easeIn",
				label: "Ease In",
				description: "Accelerates into motion",
			},
			{ key: "easeOut", label: "Ease Out", description: "Decelerates to rest" },
			{
				key: "easeInOut",
				label: "Ease In-Out",
				description: "Smooth acceleration/deceleration",
			},
		],
		[],
	);

	return (
		<Dialog onOpenChange={handleClose} open={open}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>Create New Theme</DialogTitle>
					<DialogDescription>
						Define your agency's colors, typography, and spacing tokens. These
						will power templates and the builder.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className="flex flex-col gap-4 py-4" onSubmit={handleCreate}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name *</FormLabel>
									<FormControl>
										<Input placeholder="My Custom Theme" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="A theme for modern recruitment sites..."
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Optional description shown in template lists.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isDefault"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center gap-3">
									<FormControl>
										<input
											checked={field.value}
											className="rounded border-gray-300"
											onChange={(e) => field.onChange(e.target.checked)}
											type="checkbox"
										/>
									</FormControl>
									<FormLabel className="cursor-pointer">
										Set as default theme
									</FormLabel>
								</FormItem>
							)}
						/>

						<ColorGroup
							className="mt-4"
							fields={brandColorFields}
							onChange={handleColorGroupChange}
							title="Brand Colors"
						/>

						<ColorGroup
							fields={surfaceColorFields}
							onChange={handleColorGroupChange}
							title="Surface & Border"
						/>

						<ColorGroup
							fields={textColorFields}
							onChange={handleColorGroupChange}
							title="Text Colors"
						/>

						<ColorGroup
							fields={buttonColorFields}
							onChange={handleColorGroupChange}
							title="Buttons & CTAs"
						/>

						<ColorGroup
							fields={feedbackColorFields}
							onChange={handleColorGroupChange}
							title="Status & Feedback"
						/>

						<ColorGroup
							fields={chartColorFields}
							onChange={handleColorGroupChange}
							title="Data Visualization"
						/>

						<ThemePreview config={themeConfig} />

						<TypographyEditor
							fontOptions={FONT_OPTIONS}
							form={form}
							onFontChange={(path, value) =>
								handleTypographyChange(path)(value)
							}
							onNumericTokenChange={(path) => (value) =>
								handleNumericTypographyChange(path)(value)
							}
							onTokenChange={(path) => (value) =>
								handleTypographyChange(path)(value)
							}
							primaryFontField="primaryFont"
							secondaryFontField="secondaryFont"
							typography={themeConfig.typography}
						/>

						<SpacingEditor
							fields={spacingFields}
							onChange={handleSpacingValueChange}
							previewKeys={["1", "2", "4", "8", "16", "32"]}
							spacingValues={themeConfig.spacing}
						/>
						<section className="flex flex-col gap-4 rounded-lg border p-4">
							<header>
								<h3 className="font-semibold text-sm">Advanced</h3>
								<p className="text-muted-foreground text-sm">
									Fine-tune border radius, shadows, and transition tokens.
								</p>
							</header>
							<div className="grid gap-4 sm:grid-cols-2">
								{borderRadiusFields.map((field) => (
									<div
										className="flex flex-col gap-1"
										key={`radius-${field.key}`}
									>
										<Label htmlFor={`radius-${field.key}`}>{field.label}</Label>
										<p className="text-muted-foreground text-xs">
											{field.description}
										</p>
										<Input
											id={`radius-${field.key}`}
											onChange={(e) =>
												updateConfigAtPath(
													["borderRadius", field.key],
													e.target.value,
												)
											}
											value={
												themeConfig.borderRadius[
													field.key as keyof ThemeConfig["borderRadius"]
												]
											}
										/>
									</div>
								))}
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								{shadowFields.map((field) => (
									<div
										className="flex flex-col gap-1"
										key={`shadow-${field.key}`}
									>
										<Label htmlFor={`shadow-${field.key}`}>{field.label}</Label>
										<p className="text-muted-foreground text-xs">
											{field.description}
										</p>
										<Input
											id={`shadow-${field.key}`}
											onChange={(e) =>
												updateConfigAtPath(
													["shadows", field.key],
													e.target.value,
												)
											}
											value={
												themeConfig.shadows?.[
													field.key as keyof NonNullable<ThemeConfig["shadows"]>
												] ?? ""
											}
										/>
									</div>
								))}
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								{transitionDurationFields.map((field) => (
									<div
										className="flex flex-col gap-1"
										key={`duration-${field.key}`}
									>
										<Label htmlFor={`duration-${field.key}`}>
											{field.label} Duration
										</Label>
										<p className="text-muted-foreground text-xs">
											{field.description}
										</p>
										<Input
											id={`duration-${field.key}`}
											onChange={(e) =>
												updateConfigAtPath(
													["transitions", "duration", field.key],
													e.target.value,
												)
											}
											value={
												themeConfig.transitions?.duration?.[
													field.key as keyof NonNullable<
														ThemeConfig["transitions"]
													>["duration"]
												] ?? ""
											}
										/>
									</div>
								))}
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								{transitionEasingFields.map((field) => (
									<div
										className="flex flex-col gap-1"
										key={`easing-${field.key}`}
									>
										<Label htmlFor={`easing-${field.key}`}>
											{field.label} Easing
										</Label>
										<p className="text-muted-foreground text-xs">
											{field.description}
										</p>
										<Input
											id={`easing-${field.key}`}
											onChange={(e) =>
												updateConfigAtPath(
													["transitions", "easing", field.key],
													e.target.value,
												)
											}
											value={
												themeConfig.transitions?.easing?.[
													field.key as keyof NonNullable<
														ThemeConfig["transitions"]
													>["easing"]
												] ?? ""
											}
										/>
									</div>
								))}
							</div>
						</section>

						<DialogFooter>
							<Button onClick={handleClose} type="button" variant="outline">
								Cancel
							</Button>
							<Button disabled={createTheme.isPending} type="submit">
								{createTheme.isPending ? "Creating..." : "Create Theme"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
