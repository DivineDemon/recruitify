"use client";

import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import {
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
import type { ThemeConfig } from "@/types/theme";

export interface FontOption {
	label: string;
	value: string;
}

interface TypographyEditorProps<
	TFormValues extends FieldValues = FieldValues,
	TPrimaryField extends FieldPath<TFormValues> = FieldPath<TFormValues>,
	TSecondaryField extends FieldPath<TFormValues> = FieldPath<TFormValues>,
> {
	form: UseFormReturn<TFormValues>;
	fontOptions: FontOption[];
	primaryFontField: TPrimaryField;
	secondaryFontField: TSecondaryField;
	onFontChange: (path: string, value: string) => void;
	onNumericTokenChange: (path: string) => (value: string) => void;
	onTokenChange: (path: string) => (value: string) => void;
	typography: ThemeConfig["typography"];
}

const fontSizeFields = [
	{
		key: "xs",
		label: "XS",
		description: "Meta labels, badges, fine print.",
	},
	{
		key: "sm",
		label: "SM",
		description: "Navigation, helper text, form labels.",
	},
	{
		key: "base",
		label: "Base",
		description: "Primary body copy size.",
	},
	{
		key: "lg",
		label: "LG",
		description: "Supporting headings or emphasized text.",
	},
	{
		key: "xl",
		label: "XL",
		description: "Section headings and CTAs.",
	},
	{
		key: "2xl",
		label: "2XL",
		description: "Hero headlines on desktop.",
	},
	{
		key: "3xl",
		label: "3XL",
		description: "Primary hero display.",
	},
	{
		key: "4xl",
		label: "4XL",
		description: "Large hero text or marquee stats.",
	},
	{
		key: "5xl",
		label: "5XL",
		description: "Billboard or landing hero sizes.",
	},
] as const;

const fontWeightFields = [
	{ key: "light", label: "Light", description: "Subtle supporting text." },
	{ key: "normal", label: "Normal", description: "Body copy weight." },
	{ key: "medium", label: "Medium", description: "Buttons and tabs." },
	{ key: "semibold", label: "Semibold", description: "Headings." },
	{ key: "bold", label: "Bold", description: "Hero headlines." },
] as const;

const lineHeightFields = [
	{
		key: "tight",
		label: "Tight",
		description: "Headings or condensed stacks.",
	},
	{ key: "normal", label: "Normal", description: "Body copy readability." },
	{ key: "relaxed", label: "Relaxed", description: "Long-form content." },
] as const;

export function TypographyEditor<TFormValues extends FieldValues>({
	form,
	fontOptions,
	primaryFontField,
	secondaryFontField,
	onFontChange,
	onNumericTokenChange,
	onTokenChange,
	typography,
}: TypographyEditorProps<TFormValues>) {
	return (
		<section className="flex flex-col gap-4 rounded-lg border p-4">
			<header>
				<h3 className="font-semibold text-sm">Typography</h3>
				<p className="text-muted-foreground text-sm">
					Set your font families, scale, and rhythm so templates feel
					consistent.
				</p>
			</header>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					control={form.control}
					name={primaryFontField}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Primary Font</FormLabel>
							<FormDescription>
								Used for headings and emphasis text.
							</FormDescription>
							<FormControl>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										onFontChange("typography.fontFamily.primary", value);
									}}
									value={field.value}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a font" />
									</SelectTrigger>
									<SelectContent>
										{fontOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
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
					name={secondaryFontField}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Secondary Font</FormLabel>
							<FormDescription>
								Body copy, forms, supporting text.
							</FormDescription>
							<FormControl>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										onFontChange("typography.fontFamily.secondary", value);
									}}
									value={field.value}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a font" />
									</SelectTrigger>
									<SelectContent>
										{fontOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
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

			<div className="flex flex-col gap-2">
				<Label htmlFor="monospace-font">Monospace Font</Label>
				<p className="text-muted-foreground text-xs">
					Optional font for code blocks, stats, or tabular numerals.
				</p>
				<Input
					id="monospace-font"
					onChange={(event) =>
						onFontChange("typography.fontFamily.monospace", event.target.value)
					}
					placeholder="Space Mono, Menlo, monospace"
					value={typography.fontFamily.monospace ?? ""}
				/>
			</div>

			<div className="space-y-2">
				<Label>Font Sizes</Label>
				<p className="text-muted-foreground text-xs">
					Define the modular scale that powers headings, cards, and CTAs.
				</p>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{fontSizeFields.map((field) => (
						<div className="flex flex-col gap-2" key={`font-size-${field.key}`}>
							<Label htmlFor={`font-size-${field.key}`}>{field.label}</Label>
							<p className="text-muted-foreground text-xs">
								{field.description}
							</p>
							<Input
								id={`font-size-${field.key}`}
								onChange={(event) =>
									onTokenChange(`typography.fontSize.${field.key}`)(
										event.target.value,
									)
								}
								placeholder="1rem"
								value={
									typography.fontSize[
										field.key as keyof ThemeConfig["typography"]["fontSize"]
									]
								}
							/>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-2">
				<Label>Font Weights</Label>
				<p className="text-muted-foreground text-xs">
					Control emphasis levels for headings, buttons, and supporting copy.
				</p>
				<div className="grid gap-4 sm:grid-cols-3">
					{fontWeightFields.map((field) => (
						<div
							className="flex flex-col gap-2"
							key={`font-weight-${field.key}`}
						>
							<Label htmlFor={`font-weight-${field.key}`}>{field.label}</Label>
							<p className="text-muted-foreground text-xs">
								{field.description}
							</p>
							<Input
								id={`font-weight-${field.key}`}
								inputMode="numeric"
								onChange={(event) =>
									onNumericTokenChange(`typography.fontWeight.${field.key}`)(
										event.target.value,
									)
								}
								placeholder="400"
								type="number"
								value={
									typography.fontWeight[
										field.key as keyof ThemeConfig["typography"]["fontWeight"]
									]
								}
							/>
						</div>
					))}
				</div>
			</div>

			<div className="space-y-2">
				<Label>Line Heights</Label>
				<p className="text-muted-foreground text-xs">
					Keep rhythm consistent between headings, cards, and paragraphs.
				</p>
				<div className="grid gap-4 sm:grid-cols-3">
					{lineHeightFields.map((field) => (
						<div
							className="flex flex-col gap-2"
							key={`line-height-${field.key}`}
						>
							<Label htmlFor={`line-height-${field.key}`}>{field.label}</Label>
							<p className="text-muted-foreground text-xs">
								{field.description}
							</p>
							<Input
								id={`line-height-${field.key}`}
								onChange={(event) =>
									onNumericTokenChange(`typography.lineHeight.${field.key}`)(
										event.target.value,
									)
								}
								placeholder="1.5"
								step="0.05"
								type="number"
								value={
									typography.lineHeight[
										field.key as keyof ThemeConfig["typography"]["lineHeight"]
									]
								}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
