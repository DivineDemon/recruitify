"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import { themeConfigToCSSVariables } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { ThemeConfig } from "@/types/theme";

interface ThemePreviewProps {
	config: ThemeConfig;
	variant?: "full" | "compact";
	className?: string;
}

const statusChips = [
	{
		label: "Success",
		variable: "--theme-success",
		fallback: "--theme-primary",
	},
	{ label: "Warning", variable: "--theme-warning", fallback: "--theme-accent" },
	{
		label: "Error",
		variable: "--theme-error",
		fallback: "--theme-button-destructive",
	},
	{ label: "Info", variable: "--theme-info", fallback: "--theme-secondary" },
];

const chartBars = [
	{
		label: "Q1",
		variable: "--theme-chart-primary",
		fallback: "--theme-primary",
	},
	{
		label: "Q2",
		variable: "--theme-chart-secondary",
		fallback: "--theme-secondary",
	},
	{
		label: "Q3",
		variable: "--theme-chart-tertiary",
		fallback: "--theme-accent",
	},
];

export function ThemePreview({
	config,
	variant = "full",
	className,
}: ThemePreviewProps) {
	const cssVariables = useMemo(
		() => themeConfigToCSSVariables(config),
		[config],
	) as CSSProperties;

	const surfaceStyle: CSSProperties = {
		backgroundColor: "var(--theme-surface)",
		color: "var(--theme-text-primary)",
		padding: "var(--theme-spacing-4)",
		gap: "var(--theme-spacing-4)",
		fontFamily: "var(--theme-font-secondary)",
	};

	const cardStyle: CSSProperties = {
		backgroundColor: "var(--theme-card)",
		color: "var(--theme-card-foreground)",
		borderRadius: "var(--theme-radius-lg)",
		padding: "var(--theme-spacing-4)",
		boxShadow: "var(--theme-shadow-md)",
	};

	const headingStyle: CSSProperties = {
		fontFamily: "var(--theme-font-primary)",
		fontSize: "var(--theme-font-size-2xl)",
		fontWeight: "var(--theme-font-weight-semibold)",
		lineHeight: "var(--theme-line-height-tight)",
	};

	const bodyStyle: CSSProperties = {
		fontSize: "var(--theme-font-size-base)",
		lineHeight: "var(--theme-line-height-relaxed)",
		color: "var(--theme-text-secondary)",
	};

	const buttonBase: CSSProperties = {
		borderRadius: "var(--theme-radius-md)",
		padding: `calc(var(--theme-spacing-2)) calc(var(--theme-spacing-4))`,
		fontWeight: "var(--theme-font-weight-medium)",
		fontSize: "var(--theme-font-size-sm)",
		transition: `background-color var(--theme-transition-duration-normal, 200ms) var(--theme-transition-easing-default, ease)`,
	};

	const previewContent = (
		<div
			className={cn(
				"flex flex-col rounded-xl border",
				variant === "compact" ? "p-3" : "p-4",
			)}
			style={{
				...cssVariables,
				...surfaceStyle,
			}}
		>
			<div className="space-y-3" style={{ gap: "var(--theme-spacing-2)" }}>
				<p style={headingStyle}>Modern talent outreach</p>
				<p style={bodyStyle}>
					Keep every recruiter on brand with reusable themes, typography, and
					logo assets synced across templates.
				</p>
				<div
					className="flex flex-wrap gap-2"
					style={{ gap: "var(--theme-spacing-2)" }}
				>
					<button
						style={{
							...buttonBase,
							backgroundColor: "var(--theme-button-primary)",
							color: "var(--theme-primary-foreground)",
						}}
						type="button"
					>
						Primary
					</button>
					<button
						style={{
							...buttonBase,
							backgroundColor: "var(--theme-button-secondary)",
							color: "var(--theme-secondary-foreground)",
						}}
						type="button"
					>
						Secondary
					</button>
					<button
						style={{
							...buttonBase,
							backgroundColor: "var(--theme-button-destructive)",
							color: "var(--theme-text-inverse, #ffffff)",
						}}
						type="button"
					>
						Alert
					</button>
				</div>
			</div>

			<div
				className="grid gap-4 md:grid-cols-[1.6fr,1fr]"
				style={{ gap: "var(--theme-spacing-3)" }}
			>
				<div className="space-y-3" style={cardStyle}>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-xs uppercase tracking-wide">
								Hiring pipeline
							</p>
							<p
								style={{
									fontSize: "var(--theme-font-size-lg)",
									fontWeight: "var(--theme-font-weight-semibold)",
								}}
							>
								8 candidates
							</p>
						</div>
						<span
							className="rounded-full px-3 py-1 font-medium text-xs"
							style={{
								backgroundColor: "var(--theme-accent)",
								color: "var(--theme-accent-foreground)",
							}}
						>
							Active
						</span>
					</div>
					<div className="space-y-2 text-sm">
						<div className="flex items-center justify-between">
							<span>Applied</span>
							<span>120</span>
						</div>
						<div className="flex items-center justify-between">
							<span>Interviewing</span>
							<span>24</span>
						</div>
						<div className="flex items-center justify-between">
							<span>Offers</span>
							<span>3</span>
						</div>
					</div>
				</div>

				<div
					className="space-y-3 rounded-xl border p-3"
					style={{
						borderColor: "var(--theme-border)",
						backgroundColor: "var(--theme-background)",
					}}
				>
					<div className="flex flex-wrap gap-2">
						{statusChips.map((chip) => (
							<span
								className="rounded-full px-3 py-1 font-medium text-white text-xs"
								key={chip.label}
								style={{
									backgroundColor: `var(${chip.variable}, var(${chip.fallback}))`,
								}}
							>
								{chip.label}
							</span>
						))}
					</div>
					<div className="space-y-2">
						{chartBars.map((bar) => (
							<div className="flex flex-col gap-1" key={bar.label}>
								<div className="flex items-center justify-between text-muted-foreground text-xs">
									<span>{bar.label}</span>
									<span>+12%</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full"
										style={{
											width: "70%",
											backgroundColor: `var(${bar.variable}, var(${bar.fallback}))`,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap gap-3">
				{["1", "2", "4", "8"].map((token) => (
					<div
						className="flex flex-col items-center gap-2 rounded-lg border px-3 py-2"
						key={`spacing-${token}`}
						style={{
							borderColor: "var(--theme-border)",
							backgroundColor: "var(--theme-background)",
						}}
					>
						<span className="text-muted-foreground text-xs">
							Spacing {token}
						</span>
						<div
							className="w-12 rounded-full bg-muted"
							style={{ height: `var(--theme-spacing-${token})` }}
						/>
					</div>
				))}
			</div>
		</div>
	);

	if (variant === "compact") {
		return (
			<div className={cn("rounded-lg border bg-muted/20", className)}>
				{previewContent}
			</div>
		);
	}

	return (
		<section
			className={cn("flex flex-col gap-3 rounded-lg border p-4", className)}
		>
			<header>
				<h3 className="font-semibold text-sm">Live Preview</h3>
				<p className="text-muted-foreground text-sm">
					Color, typography, spacing, and state tokens refresh as you edit.
				</p>
			</header>
			{previewContent}
		</section>
	);
}
