"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ColorGroup } from "@/components/branding/color-group";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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

	const FONT_OPTIONS = [
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
		(path: string[], value: string) => {
			setThemeConfig((prev) => {
				const updated = cloneThemeConfig(prev);
				const segments = [...path];

				if (segments.length === 0) {
					return updated;
				}

				const targetParent = segments
					.slice(0, -1)
					.reduce<Record<string, unknown>>(
						(acc, key) => {
							const next = acc[key];
							if (typeof next === "object" && next !== null) {
								return next as Record<string, unknown>;
							}
							return acc;
						},
						updated as unknown as Record<string, unknown>,
					);

				const lastKey = segments[segments.length - 1] as string;
				targetParent[lastKey] = value;
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

	const handleTypographyChange = (path: string) => (value: string) => {
		updateConfigAtPath(path.split("."), value);
	};

	const handleSpacingChange =
		(key: keyof ThemeConfig["spacing"]) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			updateConfigAtPath(["spacing", key], event.target.value);
		};

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
		],
		[themeConfig],
	);

	const spacingFields = useMemo(
		() =>
			[
				{ key: "0", description: "Zero spacing (tight)" },
				{ key: "1", description: "2px spacing" },
				{ key: "2", description: "4px spacing" },
				{ key: "3", description: "6px spacing" },
				{ key: "4", description: "8px spacing" },
				{ key: "5", description: "10px spacing" },
				{ key: "6", description: "12px spacing" },
				{ key: "8", description: "16px spacing" },
			] as Array<{ key: keyof ThemeConfig["spacing"]; description: string }>,
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

						<section className="flex flex-col gap-4 rounded-lg border p-4">
							<header>
								<h3 className="font-semibold text-sm">Typography</h3>
							</header>
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="primaryFont"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Primary Font</FormLabel>
											<FormDescription>
												Used for headings, buttons, emphasis text.
											</FormDescription>
											<FormControl>
												<Select
													onValueChange={(value) => {
														field.onChange(value);
														handleTypographyChange(
															"typography.fontFamily.primary",
														)(value);
													}}
													value={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select a font" />
													</SelectTrigger>
													<SelectContent>
														{FONT_OPTIONS.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="secondaryFont"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Secondary Font</FormLabel>
											<FormDescription>
												Body copy, paragraphs, supporting text.
											</FormDescription>
											<FormControl>
												<Select
													onValueChange={(value) => {
														field.onChange(value);
														handleTypographyChange(
															"typography.fontFamily.secondary",
														)(value);
													}}
													value={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select a font" />
													</SelectTrigger>
													<SelectContent>
														{FONT_OPTIONS.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="flex flex-col gap-2">
									<Label htmlFor="font-size-base">Base Font Size</Label>
									<Input
										id="font-size-base"
										onChange={(e) =>
											handleTypographyChange("typography.fontSize.base")(
												e.target.value,
											)
										}
										placeholder="1rem"
										value={themeConfig.typography.fontSize.base}
									/>
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="line-height-normal">Line Height</Label>
									<Input
										id="line-height-normal"
										onChange={(e) =>
											handleTypographyChange("typography.lineHeight.normal")(
												e.target.value,
											)
										}
										placeholder="1.5"
										value={themeConfig.typography.lineHeight.normal}
									/>
								</div>
							</div>
						</section>

						<section className="flex flex-col gap-4 rounded-lg border p-4">
							<header>
								<h3 className="font-semibold text-sm">Spacing Scale</h3>
							</header>
							<div className="grid gap-4 sm:grid-cols-2">
								{spacingFields.map((field) => (
									<div
										className="flex flex-col gap-2"
										key={`spacing-${field.key}`}
									>
										<div className="flex flex-col gap-1">
											<Label htmlFor={`spacing-${field.key}`}>
												Spacing {field.key}
											</Label>
											<p className="text-muted-foreground text-xs">
												{field.description}
											</p>
										</div>
										<Input
											id={`spacing-${field.key}`}
											onChange={handleSpacingChange(field.key)}
											placeholder="0.25rem"
											value={themeConfig.spacing[field.key]}
										/>
									</div>
								))}
							</div>
						</section>
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
