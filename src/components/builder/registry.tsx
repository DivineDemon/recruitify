"use client";

import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	Badge,
	Check,
	Download,
	Edit,
	Heading1,
	Heart,
	Image as ImageIcon,
	Layout,
	Link as LinkIcon,
	List,
	Menu,
	Minus as MinusIcon,
	MousePointerClick,
	Play,
	Plus,
	Quote,
	Search,
	SeparatorHorizontal,
	Settings,
	Share,
	Sparkles,
	Star,
	Trash,
	Type,
	Upload as UploadIcon,
	User,
	X,
} from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import React, { type CSSProperties } from "react";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BlockDefinition, BuilderNode } from "./types";

const Section: BlockDefinition = {
	key: "section",
	label: "Section",
	category: "layout",
	allowsChildren: true,
	create: () => ({
		id: nanoid(),
		type: "section",
		props: {
			paddingTop: 0,
			paddingRight: 0,
			paddingBottom: 0,
			paddingLeft: 0,
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			background: "transparent",
			borderWidth: 0,
			borderStyle: "solid",
			borderColor: "#000000",
			borderRadius: 0,
			boxShadow: "none",
		},
		children: [],
	}),
	render: (node, children) => {
		const background = String(node.props.background ?? "transparent");
		const paddingTop = Number(node.props.paddingTop ?? 0);
		const paddingRight = Number(node.props.paddingRight ?? 0);
		const paddingBottom = Number(node.props.paddingBottom ?? 0);
		const paddingLeft = Number(node.props.paddingLeft ?? 0);
		const marginTop = Number(node.props.marginTop ?? 0);
		const marginRight = Number(node.props.marginRight ?? 0);
		const marginBottom = Number(node.props.marginBottom ?? 0);
		const marginLeft = Number(node.props.marginLeft ?? 0);
		const borderWidth = Number(node.props.borderWidth ?? 0);
		const borderStyle = String(node.props.borderStyle ?? "solid");
		const borderColor = String(node.props.borderColor ?? "#000000");
		const borderRadius = Number(node.props.borderRadius ?? 0);
		const boxShadow = String(node.props.boxShadow ?? "none");
		const hasChildren =
			children &&
			(Array.isArray(children)
				? children.length > 0
				: React.isValidElement(children));

		return (
			<section
				className="min-h-[200px] w-full"
				style={{
					background,
					padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
					margin: `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`,
					borderWidth: borderWidth > 0 ? `${borderWidth}px` : "0",
					borderStyle: borderWidth > 0 ? borderStyle : "none",
					borderColor: borderWidth > 0 ? borderColor : "transparent",
					borderRadius: `${borderRadius}px`,
					boxShadow: boxShadow !== "none" ? boxShadow : "none",
				}}
			>
				<div className="container mx-auto">
					{hasChildren ? (
						children
					) : (
						<div className="flex min-h-[200px] items-center justify-center text-muted-foreground text-sm">
							Drop elements here or click to select
						</div>
					)}
				</div>
			</section>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-2">
					<Label className="w-full text-left font-semibold text-xs">
						Padding
					</Label>
					<div className="grid grid-cols-4 gap-2">
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-paddingTop`}
							>
								Top
							</Label>
							<Input
								id={`${node.id}-paddingTop`}
								onChange={(e) => update({ paddingTop: Number(e.target.value) })}
								type="number"
								value={Number(node.props.paddingTop ?? 0)}
							/>
						</div>
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-paddingRight`}
							>
								Right
							</Label>
							<Input
								id={`${node.id}-paddingRight`}
								onChange={(e) =>
									update({ paddingRight: Number(e.target.value) })
								}
								type="number"
								value={Number(node.props.paddingRight ?? 0)}
							/>
						</div>
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-paddingBottom`}
							>
								Bottom
							</Label>
							<Input
								id={`${node.id}-paddingBottom`}
								onChange={(e) =>
									update({ paddingBottom: Number(e.target.value) })
								}
								type="number"
								value={Number(node.props.paddingBottom ?? 0)}
							/>
						</div>
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-paddingLeft`}
							>
								Left
							</Label>
							<Input
								id={`${node.id}-paddingLeft`}
								onChange={(e) =>
									update({ paddingLeft: Number(e.target.value) })
								}
								type="number"
								value={Number(node.props.paddingLeft ?? 0)}
							/>
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left font-semibold text-xs">
						Margin
					</Label>
					<div className="grid grid-cols-4 gap-2">
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-marginTop`}
							>
								Top
							</Label>
							<Input
								id={`${node.id}-marginTop`}
								onChange={(e) => update({ marginTop: Number(e.target.value) })}
								type="number"
								value={Number(node.props.marginTop ?? 0)}
							/>
						</div>
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-marginRight`}
							>
								Right
							</Label>
							<Input
								id={`${node.id}-marginRight`}
								onChange={(e) =>
									update({ marginRight: Number(e.target.value) })
								}
								type="number"
								value={Number(node.props.marginRight ?? 0)}
							/>
						</div>
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-marginBottom`}
							>
								Bottom
							</Label>
							<Input
								id={`${node.id}-marginBottom`}
								onChange={(e) =>
									update({ marginBottom: Number(e.target.value) })
								}
								type="number"
								value={Number(node.props.marginBottom ?? 0)}
							/>
						</div>
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-marginLeft`}
							>
								Left
							</Label>
							<Input
								id={`${node.id}-marginLeft`}
								onChange={(e) => update({ marginLeft: Number(e.target.value) })}
								type="number"
								value={Number(node.props.marginLeft ?? 0)}
							/>
						</div>
					</div>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-background`}
					>
						Background
					</Label>
					<Input
						id={`${node.id}-background`}
						onChange={(e) => update({ background: e.target.value })}
						placeholder="e.g. #fff or linear-gradient(...)"
						type="text"
						value={String(node.props.background ?? "transparent")}
					/>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left font-semibold text-xs">
						Border
					</Label>
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-borderWidth`}
							>
								Width
							</Label>
							<Input
								id={`${node.id}-borderWidth`}
								onChange={(e) =>
									update({ borderWidth: Number(e.target.value) })
								}
								type="number"
								value={Number(node.props.borderWidth ?? 0)}
							/>
						</div>
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-borderRadius`}
							>
								Radius
							</Label>
							<Input
								id={`${node.id}-borderRadius`}
								onChange={(e) =>
									update({ borderRadius: Number(e.target.value) })
								}
								type="number"
								value={Number(node.props.borderRadius ?? 0)}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-borderStyle`}
							>
								Style
							</Label>
							<Select
								onValueChange={(value) => update({ borderStyle: value })}
								value={String(node.props.borderStyle ?? "solid")}
							>
								<SelectTrigger id={`${node.id}-borderStyle`}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="solid">Solid</SelectItem>
									<SelectItem value="dashed">Dashed</SelectItem>
									<SelectItem value="dotted">Dotted</SelectItem>
									<SelectItem value="double">Double</SelectItem>
									<SelectItem value="none">None</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1">
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-borderColor`}
							>
								Color
							</Label>
							<Input
								id={`${node.id}-borderColor`}
								onChange={(e) => update({ borderColor: e.target.value })}
								type="text"
								value={String(node.props.borderColor ?? "#000000")}
							/>
						</div>
					</div>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-boxShadow`}
					>
						Box Shadow
					</Label>
					<Input
						id={`${node.id}-boxShadow`}
						onChange={(e) => update({ boxShadow: e.target.value })}
						placeholder="e.g. 0 2px 4px rgba(0,0,0,0.1) or none"
						type="text"
						value={String(node.props.boxShadow ?? "none")}
					/>
				</div>
			</div>
		);
	},
};

const Heading: BlockDefinition = {
	key: "heading",
	label: "Heading",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "heading",
		props: { text: "Your headline", level: 2, align: "left" },
	}),
	render: (node) => {
		const text = String(node.props.text ?? "Heading");
		const level = Math.min(6, Math.max(1, Number(node.props.level ?? 2)));
		const align = String(node.props.align ?? "left");
		return React.createElement(
			`h${level}`,
			{
				style: { textAlign: align as CSSProperties["textAlign"] },
				className: "font-semibold",
			},
			text,
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-heading-text`}
					>
						Text
					</Label>
					<Input
						id={`${node.id}-heading-text`}
						onChange={(e) => update({ text: e.target.value })}
						type="text"
						value={String(node.props.text ?? "")}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-heading-level`}
						>
							Level
						</Label>
						<Select
							onValueChange={(value) => update({ level: Number(value) })}
							value={String(node.props.level ?? 2)}
						>
							<SelectTrigger className="w-full" id={`${node.id}-heading-level`}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{[1, 2, 3, 4, 5, 6].map((l) => (
									<SelectItem key={l} value={String(l)}>
										h{l}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-heading-align`}
						>
							Align
						</Label>
						<Select
							onValueChange={(value) => update({ align: value })}
							value={String(node.props.align ?? "left")}
						>
							<SelectTrigger className="w-full" id={`${node.id}-heading-align`}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="left">Left</SelectItem>
								<SelectItem value="center">Center</SelectItem>
								<SelectItem value="right">Right</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		);
	},
};

const TextBlock: BlockDefinition = {
	key: "text",
	label: "Text",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "text",
		props: { text: "Tell your story…", align: "left" },
	}),
	render: (node) => {
		const text = String(node.props.text ?? "");
		const align = String(node.props.align ?? "left");
		return (
			<p
				className="text-muted-foreground"
				style={{ textAlign: align as CSSProperties["textAlign"] }}
			>
				{text}
			</p>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-text-text`}
					>
						Text
					</Label>
					<Textarea
						className="min-h-[120px]"
						id={`${node.id}-text-text`}
						onChange={(e) => update({ text: e.target.value })}
						value={String(node.props.text ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-text-align`}
					>
						Align
					</Label>
					<Select
						onValueChange={(value) => update({ align: value })}
						value={String(node.props.align ?? "left")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-text-align`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="left">Left</SelectItem>
							<SelectItem value="center">Center</SelectItem>
							<SelectItem value="right">Right</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const ButtonBlock: BlockDefinition = {
	key: "button",
	label: "Button",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "button",
		props: { label: "Click me", href: "#", variant: "default", type: "button" },
	}),
	render: (node, _children, parentType) => {
		const label = String(node.props.label ?? "Button");
		const href = String(node.props.href ?? "#");
		const buttonType = String(node.props.type ?? "button");

		const isInForm = parentType === "form-container";
		const finalType = isInForm ? "submit" : buttonType;

		if (href && href !== "#" && !isInForm) {
			return (
				<a
					className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
					href={href}
				>
					{label}
				</a>
			);
		}

		return (
			<button
				className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
				disabled
				type={finalType as "button" | "submit" | "reset"}
			>
				{label}
			</button>
		);
	},
	inspector: ({ node, update }) => {
		const href = String(node.props.href ?? "#");
		const buttonType = String(node.props.type ?? "button");

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-button-label`}
					>
						Label
					</Label>
					<Input
						id={`${node.id}-button-label`}
						onChange={(e) => update({ label: e.target.value })}
						type="text"
						value={String(node.props.label ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-button-type`}
					>
						Type
					</Label>
					<Select
						onValueChange={(value) => update({ type: value })}
						value={buttonType}
					>
						<SelectTrigger className="w-full" id={`${node.id}-button-type`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="button">Button</SelectItem>
							<SelectItem value="submit">Submit</SelectItem>
							<SelectItem value="reset">Reset</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-button-href`}
					>
						Link (optional - leave empty for button)
					</Label>
					<Input
						id={`${node.id}-button-href`}
						onChange={(e) => update({ href: e.target.value })}
						placeholder="# or URL"
						type="text"
						value={href}
					/>
				</div>
			</div>
		);
	},
};

const ImageBlock: BlockDefinition = {
	key: "image",
	label: "Image",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "image",
		props: { src: "/placeholder.svg", alt: "Image", width: 800, height: 400 },
	}),
	render: (node) => {
		const src = String(node.props.src ?? "/placeholder.svg");
		const alt = String(node.props.alt ?? "Image");
		const width = Number(node.props.width ?? 800);
		const height = Number(node.props.height ?? 400);
		return (
			<div className="relative">
				<Image alt={alt} height={height} src={src} width={width} />
			</div>
		);
	},
	inspector: ({ node, update }) => {
		const currentSrc = String(node.props.src ?? "/placeholder.svg");
		const isUploadThingUrl =
			currentSrc.startsWith("https://") &&
			(currentSrc.includes("uploadthing.com") ||
				currentSrc.includes("utfs.io"));

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label className="w-full text-left text-xs">Image</Label>
					{isUploadThingUrl || currentSrc === "/placeholder.svg" ? (
						<FileUploader
							accept="image/*"
							changeLabel="Change image"
							endpoint="mediaUploader"
							helperText="Upload an image file (max 4MB)"
							onChange={(url) => update({ src: url ?? "/placeholder.svg" })}
							removeLabel="Remove"
							uploadLabel="Upload image"
							value={currentSrc === "/placeholder.svg" ? null : currentSrc}
							withContainer={false}
						/>
					) : (
						<div className="space-y-2">
							<Input
								onChange={(e) => update({ src: e.target.value })}
								placeholder="Image URL"
								type="text"
								value={currentSrc}
							/>
							<Button
								className="w-full"
								onClick={() => update({ src: "/placeholder.svg" })}
								size="sm"
								type="button"
								variant="outline"
							>
								Use UploadThing instead
							</Button>
						</div>
					)}
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-image-width`}
						>
							Width
						</Label>
						<Input
							id={`${node.id}-image-width`}
							onChange={(e) => update({ width: Number(e.target.value) })}
							type="number"
							value={Number(node.props.width ?? 800)}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-image-height`}
						>
							Height
						</Label>
						<Input
							id={`${node.id}-image-height`}
							onChange={(e) => update({ height: Number(e.target.value) })}
							type="number"
							value={Number(node.props.height ?? 400)}
						/>
					</div>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-image-alt`}
					>
						Alt Text
					</Label>
					<Input
						id={`${node.id}-image-alt`}
						onChange={(e) => update({ alt: e.target.value })}
						placeholder="Image description"
						type="text"
						value={String(node.props.alt ?? "Image")}
					/>
				</div>
			</div>
		);
	},
};

const Container: BlockDefinition = {
	key: "container",
	label: "Container",
	category: "layout",
	allowsChildren: true,
	create: () => ({
		id: nanoid(),
		type: "container",
		props: {
			maxWidth: "1280px",
			paddingX: 16,
			paddingY: 16,
			background: "transparent",
		},
		children: [],
	}),
	render: (node, children) => {
		const maxWidth = String(node.props.maxWidth ?? "1280px");
		const paddingX = Number(node.props.paddingX ?? 16);
		const paddingY = Number(node.props.paddingY ?? 16);
		const background = String(node.props.background ?? "transparent");
		const hasChildren =
			children &&
			(Array.isArray(children)
				? children.length > 0
				: React.isValidElement(children));

		return (
			<div
				className="w-full"
				style={{
					maxWidth,
					margin: "0 auto",
					padding: `${paddingY}px ${paddingX}px`,
					background,
				}}
			>
				{hasChildren ? (
					children
				) : (
					<div className="flex min-h-[100px] items-center justify-center text-muted-foreground text-sm">
						Drop elements here
					</div>
				)}
			</div>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-container-maxWidth`}
					>
						Max Width
					</Label>
					<Input
						id={`${node.id}-container-maxWidth`}
						onChange={(e) => update({ maxWidth: e.target.value })}
						placeholder="e.g. 1280px, 100%, none"
						type="text"
						value={String(node.props.maxWidth ?? "1280px")}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-container-paddingX`}
						>
							Padding X
						</Label>
						<Input
							id={`${node.id}-container-paddingX`}
							onChange={(e) => update({ paddingX: Number(e.target.value) })}
							type="number"
							value={Number(node.props.paddingX ?? 16)}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-container-paddingY`}
						>
							Padding Y
						</Label>
						<Input
							id={`${node.id}-container-paddingY`}
							onChange={(e) => update({ paddingY: Number(e.target.value) })}
							type="number"
							value={Number(node.props.paddingY ?? 16)}
						/>
					</div>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-container-background`}
					>
						Background
					</Label>
					<Input
						id={`${node.id}-container-background`}
						onChange={(e) => update({ background: e.target.value })}
						placeholder="e.g. #fff or linear-gradient(...)"
						type="text"
						value={String(node.props.background ?? "transparent")}
					/>
				</div>
			</div>
		);
	},
};

const FlexRow: BlockDefinition = {
	key: "flex-row",
	label: "Row",
	category: "layout",
	allowsChildren: true,
	create: () => ({
		id: nanoid(),
		type: "flex-row",
		props: {
			gap: 16,
			alignItems: "stretch",
			justifyContent: "flex-start",
			wrap: false,
		},
		children: [],
	}),
	render: (node, children) => {
		const gap = Number(node.props.gap ?? 16);
		const alignItems = String(node.props.alignItems ?? "stretch");
		const justifyContent = String(node.props.justifyContent ?? "flex-start");
		const wrap = Boolean(node.props.wrap ?? false);
		const hasChildren =
			children &&
			(Array.isArray(children)
				? children.length > 0
				: React.isValidElement(children));

		return (
			<div
				className="flex w-full"
				style={{
					gap: `${gap}px`,
					alignItems: alignItems as CSSProperties["alignItems"],
					justifyContent: justifyContent as CSSProperties["justifyContent"],
					flexWrap: wrap ? "wrap" : "nowrap",
				}}
			>
				{hasChildren ? (
					children
				) : (
					<div className="flex min-h-[100px] w-full items-center justify-center text-muted-foreground text-sm">
						Drop elements here
					</div>
				)}
			</div>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-flex-row-gap`}
					>
						Gap
					</Label>
					<Input
						id={`${node.id}-flex-row-gap`}
						onChange={(e) => update({ gap: Number(e.target.value) })}
						type="number"
						value={Number(node.props.gap ?? 16)}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-flex-row-alignItems`}
					>
						Align Items
					</Label>
					<Select
						onValueChange={(value) => update({ alignItems: value })}
						value={String(node.props.alignItems ?? "stretch")}
					>
						<SelectTrigger
							className="w-full"
							id={`${node.id}-flex-row-alignItems`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="stretch">Stretch</SelectItem>
							<SelectItem value="flex-start">Start</SelectItem>
							<SelectItem value="flex-end">End</SelectItem>
							<SelectItem value="center">Center</SelectItem>
							<SelectItem value="baseline">Baseline</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-flex-row-justifyContent`}
					>
						Justify Content
					</Label>
					<Select
						onValueChange={(value) => update({ justifyContent: value })}
						value={String(node.props.justifyContent ?? "flex-start")}
					>
						<SelectTrigger
							className="w-full"
							id={`${node.id}-flex-row-justifyContent`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="flex-start">Start</SelectItem>
							<SelectItem value="flex-end">End</SelectItem>
							<SelectItem value="center">Center</SelectItem>
							<SelectItem value="space-between">Space Between</SelectItem>
							<SelectItem value="space-around">Space Around</SelectItem>
							<SelectItem value="space-evenly">Space Evenly</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-flex-row-wrap`}
					>
						Wrap
					</Label>
					<Select
						onValueChange={(value) => update({ wrap: value === "true" })}
						value={String(node.props.wrap ?? false)}
					>
						<SelectTrigger className="w-full" id={`${node.id}-flex-row-wrap`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="false">No Wrap</SelectItem>
							<SelectItem value="true">Wrap</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const ColumnStack: BlockDefinition = {
	key: "column-stack",
	label: "Stack",
	category: "layout",
	allowsChildren: true,
	create: () => ({
		id: nanoid(),
		type: "column-stack",
		props: {
			gap: 16,
			alignItems: "stretch",
		},
		children: [],
	}),
	render: (node, children) => {
		const gap = Number(node.props.gap ?? 16);
		const alignItems = String(node.props.alignItems ?? "stretch");
		const hasChildren =
			children &&
			(Array.isArray(children)
				? children.length > 0
				: React.isValidElement(children));

		return (
			<div
				className="flex w-full flex-col"
				style={{
					gap: `${gap}px`,
					alignItems: alignItems as CSSProperties["alignItems"],
				}}
			>
				{hasChildren ? (
					children
				) : (
					<div className="flex min-h-[100px] w-full items-center justify-center text-muted-foreground text-sm">
						Drop elements here
					</div>
				)}
			</div>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-column-stack-gap`}
					>
						Gap
					</Label>
					<Input
						id={`${node.id}-column-stack-gap`}
						onChange={(e) => update({ gap: Number(e.target.value) })}
						type="number"
						value={Number(node.props.gap ?? 16)}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-column-stack-alignItems`}
					>
						Align Items
					</Label>
					<Select
						onValueChange={(value) => update({ alignItems: value })}
						value={String(node.props.alignItems ?? "stretch")}
					>
						<SelectTrigger
							className="w-full"
							id={`${node.id}-column-stack-alignItems`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="stretch">Stretch</SelectItem>
							<SelectItem value="flex-start">Start</SelectItem>
							<SelectItem value="flex-end">End</SelectItem>
							<SelectItem value="center">Center</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const Spacer: BlockDefinition = {
	key: "spacer",
	label: "Spacer",
	category: "layout",
	create: () => ({
		id: nanoid(),
		type: "spacer",
		props: { height: 32 },
	}),
	render: (node) => {
		const height = Number(node.props.height ?? 32);
		return <div style={{ height: `${height}px`, width: "100%" }} />;
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-spacer-height`}
					>
						Height
					</Label>
					<Input
						id={`${node.id}-spacer-height`}
						onChange={(e) => update({ height: Number(e.target.value) })}
						type="number"
						value={Number(node.props.height ?? 32)}
					/>
				</div>
			</div>
		);
	},
};

const LinkBlock: BlockDefinition = {
	key: "link",
	label: "Link",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "link",
		props: { text: "Link text", href: "#", target: "_self" },
	}),
	render: (node) => {
		const text = String(node.props.text ?? "Link");
		const href = String(node.props.href ?? "#");
		const target = String(node.props.target ?? "_self");
		return (
			<a
				className="text-primary underline underline-offset-4 hover:no-underline"
				href={href}
				target={target}
			>
				{text}
			</a>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-link-text`}
					>
						Text
					</Label>
					<Input
						id={`${node.id}-link-text`}
						onChange={(e) => update({ text: e.target.value })}
						type="text"
						value={String(node.props.text ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-link-href`}
					>
						URL
					</Label>
					<Input
						id={`${node.id}-link-href`}
						onChange={(e) => update({ href: e.target.value })}
						type="text"
						value={String(node.props.href ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-link-target`}
					>
						Target
					</Label>
					<Select
						onValueChange={(value) => update({ target: value })}
						value={String(node.props.target ?? "_self")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-link-target`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="_self">Same Window</SelectItem>
							<SelectItem value="_blank">New Window</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const ListBlock: BlockDefinition = {
	key: "list",
	label: "List",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "list",
		props: {
			type: "unordered",
			items: ["Item 1", "Item 2", "Item 3"],
		},
	}),
	render: (node) => {
		const type = String(node.props.type ?? "unordered");
		const items = Array.isArray(node.props.items)
			? node.props.items.map(String)
			: [String(node.props.items ?? "")];
		const ListTag = type === "ordered" ? "ol" : "ul";
		return React.createElement(
			ListTag,
			{ className: "list-inside space-y-1" },
			items.map((item, idx) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: List items are user-defined and stable
				<li className="text-muted-foreground" key={`${item}-${idx}`}>
					{item}
				</li>
			)),
		);
	},
	inspector: ({ node, update }) => {
		const items = Array.isArray(node.props.items)
			? node.props.items.map(String)
			: [String(node.props.items ?? "")];
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-list-type`}
					>
						Type
					</Label>
					<Select
						onValueChange={(value) => update({ type: value })}
						value={String(node.props.type ?? "unordered")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-list-type`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="unordered">Unordered</SelectItem>
							<SelectItem value="ordered">Ordered</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-list-items`}
					>
						Items (one per line)
					</Label>
					<Textarea
						className="min-h-[120px]"
						id={`${node.id}-list-items`}
						onChange={(e) => {
							const lines = e.target.value
								.split("\n")
								.map((line) => line.trim())
								.filter((line) => line.length > 0);
							update({ items: lines.length > 0 ? lines : ["Item 1"] });
						}}
						value={items.join("\n")}
					/>
				</div>
			</div>
		);
	},
};

const QuoteBlock: BlockDefinition = {
	key: "quote",
	label: "Quote",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "quote",
		props: {
			text: "This is a quote",
			author: "",
		},
	}),
	render: (node) => {
		const text = String(node.props.text ?? "");
		const author = String(node.props.author ?? "");
		return (
			<blockquote className="border-primary border-l-4 pl-4 italic">
				<p className="text-muted-foreground">{text}</p>
				{author && (
					<footer className="mt-2 text-muted-foreground text-sm">
						— {author}
					</footer>
				)}
			</blockquote>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-quote-text`}
					>
						Quote Text
					</Label>
					<Textarea
						className="min-h-[100px]"
						id={`${node.id}-quote-text`}
						onChange={(e) => update({ text: e.target.value })}
						value={String(node.props.text ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-quote-author`}
					>
						Author (optional)
					</Label>
					<Input
						id={`${node.id}-quote-author`}
						onChange={(e) => update({ author: e.target.value })}
						placeholder="Author name"
						type="text"
						value={String(node.props.author ?? "")}
					/>
				</div>
			</div>
		);
	},
};

const BadgeBlock: BlockDefinition = {
	key: "badge",
	label: "Badge",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "badge",
		props: { text: "Badge", variant: "default" },
	}),
	render: (node) => {
		const text = String(node.props.text ?? "Badge");
		const variant = String(node.props.variant ?? "default");
		const variantClasses: Record<string, string> = {
			default: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			outline: "border border-input bg-background",
			destructive: "bg-destructive text-destructive-foreground",
		};
		return (
			<span
				className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${variantClasses[variant] ?? variantClasses.default}`}
			>
				{text}
			</span>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-badge-text`}
					>
						Text
					</Label>
					<Input
						id={`${node.id}-badge-text`}
						onChange={(e) => update({ text: e.target.value })}
						type="text"
						value={String(node.props.text ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-badge-variant`}
					>
						Variant
					</Label>
					<Select
						onValueChange={(value) => update({ variant: value })}
						value={String(node.props.variant ?? "default")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-badge-variant`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="default">Default</SelectItem>
							<SelectItem value="secondary">Secondary</SelectItem>
							<SelectItem value="outline">Outline</SelectItem>
							<SelectItem value="destructive">Destructive</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const DividerBlock: BlockDefinition = {
	key: "divider",
	label: "Divider",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "divider",
		props: { orientation: "horizontal", style: "solid" },
	}),
	render: (node) => {
		const orientation = String(node.props.orientation ?? "horizontal");
		const style = String(node.props.style ?? "solid");
		if (orientation === "vertical") {
			return (
				<div
					className="h-full w-px bg-border"
					style={{
						borderLeftStyle: style as CSSProperties["borderLeftStyle"],
					}}
				/>
			);
		}
		return (
			<hr
				className="border-0 border-border border-t"
				style={{
					borderTopStyle: style as CSSProperties["borderTopStyle"],
				}}
			/>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-divider-orientation`}
					>
						Orientation
					</Label>
					<Select
						onValueChange={(value) => update({ orientation: value })}
						value={String(node.props.orientation ?? "horizontal")}
					>
						<SelectTrigger
							className="w-full"
							id={`${node.id}-divider-orientation`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="horizontal">Horizontal</SelectItem>
							<SelectItem value="vertical">Vertical</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-divider-style`}
					>
						Style
					</Label>
					<Select
						onValueChange={(value) => update({ style: value })}
						value={String(node.props.style ?? "solid")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-divider-style`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="solid">Solid</SelectItem>
							<SelectItem value="dashed">Dashed</SelectItem>
							<SelectItem value="dotted">Dotted</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const RichTextBlock: BlockDefinition = {
	key: "rich-text",
	label: "Rich Text",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "rich-text",
		props: {
			content: "<p>Your <strong>formatted</strong> text here</p>",
			align: "left",
		},
	}),
	render: (node) => {
		const content = String(node.props.content ?? "");
		const align = String(node.props.align ?? "left");
		return (
			<div
				className="prose prose-sm dark:prose-invert max-w-none"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Rich text block intentionally allows HTML content
				dangerouslySetInnerHTML={{ __html: content }}
				style={{ textAlign: align as CSSProperties["textAlign"] }}
			/>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-rich-text-content`}
					>
						HTML Content
					</Label>
					<Textarea
						className="min-h-[150px] font-mono"
						id={`${node.id}-rich-text-content`}
						onChange={(e) => update({ content: e.target.value })}
						placeholder="<p>Your <strong>formatted</strong> text</p>"
						value={String(node.props.content ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-rich-text-align`}
					>
						Align
					</Label>
					<Select
						onValueChange={(value) => update({ align: value })}
						value={String(node.props.align ?? "left")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-rich-text-align`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="left">Left</SelectItem>
							<SelectItem value="center">Center</SelectItem>
							<SelectItem value="right">Right</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const VideoBlock: BlockDefinition = {
	key: "video",
	label: "Video",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "video",
		props: {
			src: "",
			poster: "",
			width: 800,
			height: 450,
			controls: true,
			autoplay: false,
			loop: false,
		},
	}),
	render: (node) => {
		const src = String(node.props.src ?? "");
		const poster = String(node.props.poster ?? "");
		const width = Number(node.props.width ?? 800);
		const height = Number(node.props.height ?? 450);
		const controls = Boolean(node.props.controls ?? true);
		const autoplay = Boolean(node.props.autoplay ?? false);
		const loop = Boolean(node.props.loop ?? false);

		if (!src) {
			return (
				<div className="flex min-h-[200px] items-center justify-center rounded border border-dashed bg-muted text-muted-foreground text-sm">
					Upload a video to display
				</div>
			);
		}

		return (
			<div className="relative w-full">
				<video
					autoPlay={autoplay}
					className="w-full rounded"
					controls={controls}
					height={height}
					loop={loop}
					poster={poster || undefined}
					src={src}
					width={width}
				>
					<track kind="captions" />
				</video>
			</div>
		);
	},
	inspector: ({ node, update }) => {
		const currentSrc = String(node.props.src ?? "");
		const isUploadThingUrl =
			currentSrc.startsWith("https://") &&
			(currentSrc.includes("uploadthing.com") ||
				currentSrc.includes("utfs.io"));

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label className="w-full text-left text-xs">Video</Label>
					{isUploadThingUrl || currentSrc === "" ? (
						<FileUploader
							accept="video/*"
							changeLabel="Change video"
							endpoint="mediaUploader"
							helperText="Upload a video file (max 1GB)"
							onChange={(url) => update({ src: url ?? "" })}
							preview={false}
							removeLabel="Remove"
							uploadLabel="Upload video"
							value={currentSrc || null}
							withContainer={false}
						/>
					) : (
						<div className="space-y-2">
							<Input
								onChange={(e) => update({ src: e.target.value })}
								placeholder="Video URL"
								type="text"
								value={currentSrc}
							/>
							<Button
								className="w-full"
								onClick={() => update({ src: "" })}
								size="sm"
								type="button"
								variant="outline"
							>
								Upload instead
							</Button>
						</div>
					)}
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-video-poster`}
					>
						Poster Image URL (optional)
					</Label>
					<Input
						id={`${node.id}-video-poster`}
						onChange={(e) => update({ poster: e.target.value })}
						placeholder="Poster image URL"
						type="text"
						value={String(node.props.poster ?? "")}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-video-width`}
						>
							Width
						</Label>
						<Input
							id={`${node.id}-video-width`}
							onChange={(e) => update({ width: Number(e.target.value) })}
							type="number"
							value={Number(node.props.width ?? 800)}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-video-height`}
						>
							Height
						</Label>
						<Input
							id={`${node.id}-video-height`}
							onChange={(e) => update({ height: Number(e.target.value) })}
							type="number"
							value={Number(node.props.height ?? 450)}
						/>
					</div>
				</div>
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Checkbox
							checked={Boolean(node.props.controls ?? true)}
							id={`${node.id}-video-controls`}
							onCheckedChange={(checked) => update({ controls: checked })}
						/>
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-video-controls`}
						>
							Show Controls
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							checked={Boolean(node.props.autoplay ?? false)}
							id={`${node.id}-video-autoplay`}
							onCheckedChange={(checked) => update({ autoplay: checked })}
						/>
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-video-autoplay`}
						>
							Autoplay
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							checked={Boolean(node.props.loop ?? false)}
							id={`${node.id}-video-loop`}
							onCheckedChange={(checked) => update({ loop: checked })}
						/>
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-video-loop`}
						>
							Loop
						</Label>
					</div>
				</div>
			</div>
		);
	},
};

const IconBlock: BlockDefinition = {
	key: "icon",
	label: "Icon",
	category: "content",
	create: () => ({
		id: nanoid(),
		type: "icon",
		props: { name: "Star", size: 24, color: "currentColor" },
	}),
	render: (node) => {
		const name = String(node.props.name ?? "Star");
		const size = Number(node.props.size ?? 24);
		const color = String(node.props.color ?? "currentColor");

		const iconMap: Record<
			string,
			React.ComponentType<{
				size?: number;
				className?: string;
				style?: CSSProperties;
			}>
		> = {
			Star,
			Heart,
			Check,
			X,
			ArrowRight,
			ArrowLeft,
			ArrowUp,
			ArrowDown,
			Search,
			Menu,
			Plus,
			Minus: MinusIcon,
			Edit,
			Trash,
			Download,
			Upload: UploadIcon,
			Share,
			Settings,
			User,
		};

		const IconComponent = iconMap[name];
		if (!IconComponent) {
			return (
				<div className="flex items-center justify-center text-muted-foreground text-sm">
					Icon: {name}
				</div>
			);
		}

		return (
			<div className="inline-flex items-center justify-center">
				<IconComponent
					className="text-foreground"
					size={size}
					style={{ color }}
				/>
			</div>
		);
	},
	inspector: ({ node, update }) => {
		const availableIcons = [
			"Star",
			"Heart",
			"Check",
			"X",
			"ArrowRight",
			"ArrowLeft",
			"ArrowUp",
			"ArrowDown",
			"Search",
			"Menu",
			"Plus",
			"Minus",
			"Edit",
			"Trash",
			"Download",
			"Upload",
			"Share",
			"Settings",
			"User",
		];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-icon-name`}
					>
						Icon
					</Label>
					<Select
						onValueChange={(value) => update({ name: value })}
						value={String(node.props.name ?? "Star")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-icon-name`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{availableIcons.map((icon) => (
								<SelectItem key={icon} value={icon}>
									{icon}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-icon-size`}
						>
							Size
						</Label>
						<Input
							id={`${node.id}-icon-size`}
							onChange={(e) => update({ size: Number(e.target.value) })}
							type="number"
							value={Number(node.props.size ?? 24)}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-icon-color`}
						>
							Color
						</Label>
						<Input
							id={`${node.id}-icon-color`}
							onChange={(e) => update({ color: e.target.value })}
							placeholder="e.g. #000 or currentColor"
							type="text"
							value={String(node.props.color ?? "currentColor")}
						/>
					</div>
				</div>
			</div>
		);
	},
};

const InputBlock: BlockDefinition = {
	key: "input",
	label: "Input",
	category: "form",
	create: () => ({
		id: nanoid(),
		type: "input",
		props: {
			type: "text",
			label: "Label",
			placeholder: "Enter text...",
			required: false,
			name: "",
		},
	}),
	render: (node) => {
		const type = String(node.props.type ?? "text");
		const label = String(node.props.label ?? "");
		const placeholder = String(node.props.placeholder ?? "");
		const required = Boolean(node.props.required ?? false);
		const name = String(node.props.name ?? "");
		const inputId = `input-${node.id}`;

		return (
			<div className="space-y-2">
				{label && (
					<Label className="font-medium text-sm" htmlFor={inputId}>
						{label}
						{required && <span className="text-destructive"> *</span>}
					</Label>
				)}
				<Input
					disabled
					id={inputId}
					name={name || undefined}
					placeholder={placeholder}
					required={required}
					type={type}
				/>
			</div>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-input-label`}
					>
						Label
					</Label>
					<Input
						id={`${node.id}-input-label`}
						onChange={(e) => update({ label: e.target.value })}
						type="text"
						value={String(node.props.label ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-input-type`}
					>
						Type
					</Label>
					<Select
						onValueChange={(value) => update({ type: value })}
						value={String(node.props.type ?? "text")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-input-type`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="text">Text</SelectItem>
							<SelectItem value="email">Email</SelectItem>
							<SelectItem value="password">Password</SelectItem>
							<SelectItem value="number">Number</SelectItem>
							<SelectItem value="tel">Telephone</SelectItem>
							<SelectItem value="url">URL</SelectItem>
							<SelectItem value="date">Date</SelectItem>
							<SelectItem value="time">Time</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-input-placeholder`}
					>
						Placeholder
					</Label>
					<Input
						id={`${node.id}-input-placeholder`}
						onChange={(e) => update({ placeholder: e.target.value })}
						placeholder="Enter placeholder text"
						type="text"
						value={String(node.props.placeholder ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-input-name`}
					>
						Name (for form submission)
					</Label>
					<Input
						id={`${node.id}-input-name`}
						onChange={(e) => update({ name: e.target.value })}
						placeholder="field-name"
						type="text"
						value={String(node.props.name ?? "")}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={Boolean(node.props.required ?? false)}
						id={`${node.id}-input-required`}
						onCheckedChange={(checked) => update({ required: checked })}
					/>
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-input-required`}
					>
						Required
					</Label>
				</div>
			</div>
		);
	},
};

const TextareaBlock: BlockDefinition = {
	key: "textarea",
	label: "Textarea",
	category: "form",
	create: () => ({
		id: nanoid(),
		type: "textarea",
		props: {
			label: "Label",
			placeholder: "Enter text...",
			required: false,
			rows: 4,
			name: "",
		},
	}),
	render: (node) => {
		const label = String(node.props.label ?? "");
		const placeholder = String(node.props.placeholder ?? "");
		const required = Boolean(node.props.required ?? false);
		const rows = Number(node.props.rows ?? 4);
		const name = String(node.props.name ?? "");
		const textareaId = `textarea-${node.id}`;

		return (
			<div className="space-y-2">
				{label && (
					<Label className="font-medium text-sm" htmlFor={textareaId}>
						{label}
						{required && <span className="text-destructive"> *</span>}
					</Label>
				)}
				<Textarea
					className="min-h-[80px]"
					disabled
					id={textareaId}
					name={name || undefined}
					placeholder={placeholder}
					required={required}
					rows={rows}
				/>
			</div>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-textarea-label`}
					>
						Label
					</Label>
					<Input
						id={`${node.id}-textarea-label`}
						onChange={(e) => update({ label: e.target.value })}
						type="text"
						value={String(node.props.label ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-textarea-placeholder`}
					>
						Placeholder
					</Label>
					<Input
						id={`${node.id}-textarea-placeholder`}
						onChange={(e) => update({ placeholder: e.target.value })}
						placeholder="Enter placeholder text"
						type="text"
						value={String(node.props.placeholder ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-textarea-rows`}
					>
						Rows
					</Label>
					<Input
						id={`${node.id}-textarea-rows`}
						onChange={(e) => update({ rows: Number(e.target.value) })}
						type="number"
						value={Number(node.props.rows ?? 4)}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-textarea-name`}
					>
						Name (for form submission)
					</Label>
					<Input
						id={`${node.id}-textarea-name`}
						onChange={(e) => update({ name: e.target.value })}
						placeholder="field-name"
						type="text"
						value={String(node.props.name ?? "")}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={Boolean(node.props.required ?? false)}
						id={`${node.id}-textarea-required`}
						onCheckedChange={(checked) => update({ required: checked })}
					/>
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-textarea-required`}
					>
						Required
					</Label>
				</div>
			</div>
		);
	},
};

const SelectBlock: BlockDefinition = {
	key: "select",
	label: "Select",
	category: "form",
	create: () => ({
		id: nanoid(),
		type: "select",
		props: {
			label: "Label",
			options: ["Option 1", "Option 2", "Option 3"],
			required: false,
			name: "",
		},
	}),
	render: (node) => {
		const label = String(node.props.label ?? "");
		const options = Array.isArray(node.props.options)
			? node.props.options.map(String)
			: [String(node.props.options ?? "")];
		const required = Boolean(node.props.required ?? false);
		const _name = String(node.props.name ?? "");
		const selectId = `select-${node.id}`;

		return (
			<div className="space-y-2">
				{label && (
					<Label className="font-medium text-sm" htmlFor={selectId}>
						{label}
						{required && <span className="text-destructive"> *</span>}
					</Label>
				)}
				<Select disabled>
					<SelectTrigger className="w-full" id={selectId}>
						<SelectValue placeholder="Select an option" />
					</SelectTrigger>
					<SelectContent>
						{options.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	},
	inspector: ({ node, update }) => {
		const options = Array.isArray(node.props.options)
			? node.props.options.map(String)
			: [String(node.props.options ?? "")];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-select-label`}
					>
						Label
					</Label>
					<Input
						id={`${node.id}-select-label`}
						onChange={(e) => update({ label: e.target.value })}
						type="text"
						value={String(node.props.label ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-select-options`}
					>
						Options (one per line)
					</Label>
					<Textarea
						className="min-h-[100px]"
						id={`${node.id}-select-options`}
						onChange={(e) => {
							const lines = e.target.value
								.split("\n")
								.map((line) => line.trim())
								.filter((line) => line.length > 0);
							update({ options: lines.length > 0 ? lines : ["Option 1"] });
						}}
						value={options.join("\n")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-select-name`}
					>
						Name (for form submission)
					</Label>
					<Input
						id={`${node.id}-select-name`}
						onChange={(e) => update({ name: e.target.value })}
						placeholder="field-name"
						type="text"
						value={String(node.props.name ?? "")}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={Boolean(node.props.required ?? false)}
						id={`${node.id}-select-required`}
						onCheckedChange={(checked) => update({ required: checked })}
					/>
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-select-required`}
					>
						Required
					</Label>
				</div>
			</div>
		);
	},
};

const CheckboxBlock: BlockDefinition = {
	key: "checkbox",
	label: "Checkbox",
	category: "form",
	create: () => ({
		id: nanoid(),
		type: "checkbox",
		props: {
			label: "Checkbox label",
			checked: false,
			required: false,
			name: "",
		},
	}),
	render: (node) => {
		const label = String(node.props.label ?? "");
		const checked = Boolean(node.props.checked ?? false);
		const required = Boolean(node.props.required ?? false);
		const name = String(node.props.name ?? "");

		const checkboxId = `checkbox-${node.id}`;
		return (
			<div className="flex items-center gap-2">
				<Checkbox
					checked={checked}
					disabled
					id={checkboxId}
					name={name || undefined}
					required={required}
				/>
				<Label className="text-sm" htmlFor={checkboxId}>
					{label}
					{required && <span className="text-destructive"> *</span>}
				</Label>
			</div>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-checkbox-label`}
					>
						Label
					</Label>
					<Input
						id={`${node.id}-checkbox-label`}
						onChange={(e) => update({ label: e.target.value })}
						type="text"
						value={String(node.props.label ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-checkbox-name`}
					>
						Name (for form submission)
					</Label>
					<Input
						id={`${node.id}-checkbox-name`}
						onChange={(e) => update({ name: e.target.value })}
						placeholder="field-name"
						type="text"
						value={String(node.props.name ?? "")}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={Boolean(node.props.checked ?? false)}
						id={`${node.id}-checkbox-checked`}
						onCheckedChange={(checked) => update({ checked: checked })}
					/>
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-checkbox-checked`}
					>
						Checked by default
					</Label>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={Boolean(node.props.required ?? false)}
						id={`${node.id}-checkbox-required`}
						onCheckedChange={(checked) => update({ required: checked })}
					/>
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-checkbox-required`}
					>
						Required
					</Label>
				</div>
			</div>
		);
	},
};

const RadioBlock: BlockDefinition = {
	key: "radio",
	label: "Radio",
	category: "form",
	create: () => ({
		id: nanoid(),
		type: "radio",
		props: {
			label: "Radio group",
			options: ["Option 1", "Option 2", "Option 3"],
			selected: "",
			required: false,
			name: "",
		},
	}),
	render: (node) => {
		const label = String(node.props.label ?? "");
		const options = Array.isArray(node.props.options)
			? node.props.options.map(String)
			: [String(node.props.options ?? "")];
		const selected = String(node.props.selected ?? "");
		const required = Boolean(node.props.required ?? false);
		const name = String(node.props.name ?? "");

		const radioName = name || `radio-${node.id}`;
		return (
			<div className="space-y-2">
				{label && (
					<div className="font-medium text-sm">
						{label}
						{required && <span className="text-destructive"> *</span>}
					</div>
				)}
				<RadioGroup disabled name={radioName} value={selected || undefined}>
					{options.map((option) => {
						const radioId = `radio-${node.id}-${option}`;
						return (
							<div className="flex items-center gap-2" key={option}>
								<RadioGroupItem id={radioId} value={option} />
								<Label className="text-sm" htmlFor={radioId}>
									{option}
								</Label>
							</div>
						);
					})}
				</RadioGroup>
			</div>
		);
	},
	inspector: ({ node, update }) => {
		const options = Array.isArray(node.props.options)
			? node.props.options.map(String)
			: [String(node.props.options ?? "")];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-radio-label`}
					>
						Group Label
					</Label>
					<Input
						id={`${node.id}-radio-label`}
						onChange={(e) => update({ label: e.target.value })}
						type="text"
						value={String(node.props.label ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-radio-options`}
					>
						Options (one per line)
					</Label>
					<Textarea
						className="min-h-[100px]"
						id={`${node.id}-radio-options`}
						onChange={(e) => {
							const lines = e.target.value
								.split("\n")
								.map((line) => line.trim())
								.filter((line) => line.length > 0);
							update({ options: lines.length > 0 ? lines : ["Option 1"] });
						}}
						value={options.join("\n")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-radio-name`}
					>
						Name (for form submission)
					</Label>
					<Input
						id={`${node.id}-radio-name`}
						onChange={(e) => update({ name: e.target.value })}
						placeholder="field-name"
						type="text"
						value={String(node.props.name ?? "")}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={Boolean(node.props.required ?? false)}
						id={`${node.id}-radio-required`}
						onCheckedChange={(checked) => update({ required: checked })}
					/>
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-radio-required`}
					>
						Required
					</Label>
				</div>
			</div>
		);
	},
};

const FormContainerBlock: BlockDefinition = {
	key: "form-container",
	label: "Form",
	category: "form",
	allowsChildren: true,
	create: () => ({
		id: nanoid(),
		type: "form-container",
		props: {
			action: "",
			method: "post",
			name: "form",
		},
		children: [],
	}),
	render: (node, children) => {
		const action = String(node.props.action ?? "");
		const method = String(node.props.method ?? "post");
		const name = String(node.props.name ?? "form");
		const hasChildren =
			children &&
			(Array.isArray(children)
				? children.length > 0
				: React.isValidElement(children));

		return (
			<form
				action={action || undefined}
				className="space-y-4"
				method={method as "get" | "post"}
				name={name}
			>
				{hasChildren ? (
					children
				) : (
					<div className="flex min-h-[100px] items-center justify-center rounded border border-dashed bg-muted text-muted-foreground text-sm">
						Drop form elements here
					</div>
				)}
			</form>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-form-name`}
					>
						Form Name
					</Label>
					<Input
						id={`${node.id}-form-name`}
						onChange={(e) => update({ name: e.target.value })}
						placeholder="form-name"
						type="text"
						value={String(node.props.name ?? "form")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-form-action`}
					>
						Action URL (optional)
					</Label>
					<Input
						id={`${node.id}-form-action`}
						onChange={(e) => update({ action: e.target.value })}
						placeholder="/api/submit"
						type="text"
						value={String(node.props.action ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-form-method`}
					>
						Method
					</Label>
					<Select
						onValueChange={(value) => update({ method: value })}
						value={String(node.props.method ?? "post")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-form-method`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="get">GET</SelectItem>
							<SelectItem value="post">POST</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const HeroBlock: BlockDefinition = {
	key: "hero",
	label: "Hero",
	category: "content",
	allowsChildren: false,
	create: () => ({
		id: nanoid(),
		type: "hero",
		props: {
			title: "Welcome to Our Platform",
			subtitle: "Build amazing experiences with our powerful tools",
			primaryButtonText: "Get Started",
			primaryButtonHref: "#",
			secondaryButtonText: "Learn More",
			secondaryButtonHref: "#",
			background: "transparent",
			align: "center",
			paddingY: 80,
		},
	}),
	render: (node) => {
		const title = String(node.props.title ?? "");
		const subtitle = String(node.props.subtitle ?? "");
		const primaryButtonText = String(node.props.primaryButtonText ?? "");
		const primaryButtonHref = String(node.props.primaryButtonHref ?? "#");
		const secondaryButtonText = String(node.props.secondaryButtonText ?? "");
		const secondaryButtonHref = String(node.props.secondaryButtonHref ?? "#");
		const background = String(node.props.background ?? "transparent");
		const align = String(node.props.align ?? "center");
		const paddingY = Number(node.props.paddingY ?? 80);

		return (
			<section
				className="w-full"
				style={{
					background,
					paddingTop: `${paddingY}px`,
					paddingBottom: `${paddingY}px`,
					textAlign: align as CSSProperties["textAlign"],
				}}
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-3xl space-y-6">
						{title && (
							<h1 className="font-bold text-4xl md:text-5xl lg:text-6xl">
								{title}
							</h1>
						)}
						{subtitle && (
							<p className="text-lg text-muted-foreground md:text-xl">
								{subtitle}
							</p>
						)}
						{(primaryButtonText || secondaryButtonText) && (
							<div className="flex flex-wrap items-center justify-center gap-4">
								{primaryButtonText && (
									<a
										className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-base text-primary-foreground transition-colors hover:bg-primary/90"
										href={primaryButtonHref}
									>
										{primaryButtonText}
									</a>
								)}
								{secondaryButtonText && (
									<a
										className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 font-medium text-base transition-colors hover:bg-accent"
										href={secondaryButtonHref}
									>
										{secondaryButtonText}
									</a>
								)}
							</div>
						)}
					</div>
				</div>
			</section>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-title`}
					>
						Title
					</Label>
					<Input
						id={`${node.id}-hero-title`}
						onChange={(e) => update({ title: e.target.value })}
						type="text"
						value={String(node.props.title ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-subtitle`}
					>
						Subtitle
					</Label>
					<Textarea
						className="min-h-[80px]"
						id={`${node.id}-hero-subtitle`}
						onChange={(e) => update({ subtitle: e.target.value })}
						value={String(node.props.subtitle ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-primaryButtonText`}
					>
						Primary Button Text
					</Label>
					<Input
						id={`${node.id}-hero-primaryButtonText`}
						onChange={(e) => update({ primaryButtonText: e.target.value })}
						type="text"
						value={String(node.props.primaryButtonText ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-primaryButtonHref`}
					>
						Primary Button Link
					</Label>
					<Input
						id={`${node.id}-hero-primaryButtonHref`}
						onChange={(e) => update({ primaryButtonHref: e.target.value })}
						type="text"
						value={String(node.props.primaryButtonHref ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-secondaryButtonText`}
					>
						Secondary Button Text
					</Label>
					<Input
						id={`${node.id}-hero-secondaryButtonText`}
						onChange={(e) => update({ secondaryButtonText: e.target.value })}
						type="text"
						value={String(node.props.secondaryButtonText ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-secondaryButtonHref`}
					>
						Secondary Button Link
					</Label>
					<Input
						id={`${node.id}-hero-secondaryButtonHref`}
						onChange={(e) => update({ secondaryButtonHref: e.target.value })}
						type="text"
						value={String(node.props.secondaryButtonHref ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-align`}
					>
						Text Align
					</Label>
					<Select
						onValueChange={(value) => update({ align: value })}
						value={String(node.props.align ?? "center")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-hero-align`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="left">Left</SelectItem>
							<SelectItem value="center">Center</SelectItem>
							<SelectItem value="right">Right</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-background`}
					>
						Background
					</Label>
					<Input
						id={`${node.id}-hero-background`}
						onChange={(e) => update({ background: e.target.value })}
						placeholder="transparent, #fff, or gradient"
						type="text"
						value={String(node.props.background ?? "transparent")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-hero-paddingY`}
					>
						Vertical Padding
					</Label>
					<Input
						id={`${node.id}-hero-paddingY`}
						onChange={(e) => update({ paddingY: Number(e.target.value) })}
						type="number"
						value={Number(node.props.paddingY ?? 80)}
					/>
				</div>
			</div>
		);
	},
};

const FeaturesBlock: BlockDefinition = {
	key: "features",
	label: "Features",
	category: "content",
	allowsChildren: false,
	create: () => ({
		id: nanoid(),
		type: "features",
		props: {
			title: "Our Features",
			subtitle: "Everything you need to succeed",
			features: [
				{
					icon: "Star",
					title: "Feature One",
					description: "Description of the first feature",
				},
				{
					icon: "Star",
					title: "Feature Two",
					description: "Description of the second feature",
				},
				{
					icon: "Star",
					title: "Feature Three",
					description: "Description of the third feature",
				},
			],
			columns: 3,
		},
	}),
	render: (node) => {
		const title = String(node.props.title ?? "");
		const subtitle = String(node.props.subtitle ?? "");
		const features = Array.isArray(node.props.features)
			? node.props.features
			: [];
		const columns = Number(node.props.columns ?? 3);

		const iconMap: Record<
			string,
			React.ComponentType<{
				size?: number;
				className?: string;
				style?: CSSProperties;
			}>
		> = {
			Star,
			Heart,
			Check,
			X,
			ArrowRight,
			ArrowLeft,
			ArrowUp,
			ArrowDown,
			Search,
			Menu,
			Plus,
			Minus: MinusIcon,
			Edit,
			Trash,
			Download,
			Upload: UploadIcon,
			Share,
			Settings,
			User,
			Sparkles,
			Layout,
			Heading1,
			ImageIcon,
			MousePointerClick,
			LinkIcon,
			List,
			Quote,
			Badge,
			SeparatorHorizontal,
			Type,
			Play,
		};

		return (
			<section className="w-full py-16">
				<div className="container mx-auto px-4">
					{(title || subtitle) && (
						<div className="mb-12 text-center">
							{title && (
								<h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>
							)}
							{subtitle && (
								<p className="text-lg text-muted-foreground">{subtitle}</p>
							)}
						</div>
					)}
					<div
						className="grid gap-8"
						style={{
							gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
						}}
					>
						{features.map((feature: unknown, idx: number) => {
							const f = feature as {
								icon?: string;
								title?: string;
								description?: string;
							};
							const IconComponent = iconMap[String(f.icon ?? "Star")] ?? Star;
							return (
								<div className="space-y-3" key={`${f.title ?? ""}-${idx}`}>
									<IconComponent className="size-8 text-primary" />
									<h3 className="font-semibold text-xl">
										{String(f.title ?? "")}
									</h3>
									<p className="text-muted-foreground text-sm">
										{String(f.description ?? "")}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>
		);
	},
	inspector: ({ node, update }) => {
		const features = Array.isArray(node.props.features)
			? node.props.features
			: [];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-features-title`}
					>
						Title
					</Label>
					<Input
						id={`${node.id}-features-title`}
						onChange={(e) => update({ title: e.target.value })}
						type="text"
						value={String(node.props.title ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-features-subtitle`}
					>
						Subtitle
					</Label>
					<Input
						id={`${node.id}-features-subtitle`}
						onChange={(e) => update({ subtitle: e.target.value })}
						type="text"
						value={String(node.props.subtitle ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-features-columns`}
					>
						Columns
					</Label>
					<Select
						onValueChange={(value) => update({ columns: Number(value) })}
						value={String(node.props.columns ?? 3)}
					>
						<SelectTrigger
							className="w-full"
							id={`${node.id}-features-columns`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left text-xs">Features</Label>
					<div className="space-y-2">
						{features.map((_feature: unknown, idx: number) => {
							const f = _feature as {
								icon?: string;
								title?: string;
								description?: string;
							};
							return (
								<div
									className="space-y-2 rounded border p-2"
									key={`${f.title ?? ""}-${idx}`}
								>
									<Select
										onValueChange={(value) => {
											const newFeatures = [...features];
											newFeatures[idx] = {
												...f,
												icon: value,
											};
											update({ features: newFeatures });
										}}
										value={String(f.icon ?? "Star")}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Star">Star</SelectItem>
											<SelectItem value="Heart">Heart</SelectItem>
											<SelectItem value="Check">Check</SelectItem>
											<SelectItem value="Sparkles">Sparkles</SelectItem>
											<SelectItem value="Settings">Settings</SelectItem>
											<SelectItem value="User">User</SelectItem>
											<SelectItem value="Share">Share</SelectItem>
											<SelectItem value="Download">Download</SelectItem>
											<SelectItem value="Upload">Upload</SelectItem>
											<SelectItem value="Search">Search</SelectItem>
											<SelectItem value="Menu">Menu</SelectItem>
										</SelectContent>
									</Select>
									<Input
										onChange={(e) => {
											const newFeatures = [...features];
											newFeatures[idx] = {
												...f,
												title: e.target.value,
											};
											update({ features: newFeatures });
										}}
										placeholder="Feature title"
										type="text"
										value={String(f.title ?? "")}
									/>
									<Textarea
										className="min-h-[60px]"
										onChange={(e) => {
											const newFeatures = [...features];
											newFeatures[idx] = {
												...f,
												description: e.target.value,
											};
											update({ features: newFeatures });
										}}
										placeholder="Feature description"
										value={String(f.description ?? "")}
									/>
								</div>
							);
						})}
					</div>
					<Button
						className="w-full"
						onClick={() => {
							update({
								features: [
									...features,
									{
										icon: "Star",
										title: "New Feature",
										description: "Feature description",
									},
								],
							});
						}}
						size="sm"
						type="button"
						variant="outline"
					>
						Add Feature
					</Button>
				</div>
			</div>
		);
	},
};

const TestimonialsBlock: BlockDefinition = {
	key: "testimonials",
	label: "Testimonials",
	category: "content",
	allowsChildren: false,
	create: () => ({
		id: nanoid(),
		type: "testimonials",
		props: {
			title: "What Our Customers Say",
			testimonials: [
				{
					name: "John Doe",
					role: "CEO, Company",
					avatar: "",
					quote: "This is an amazing product!",
				},
				{
					name: "Jane Smith",
					role: "CTO, Startup",
					avatar: "",
					quote: "Highly recommended!",
				},
			],
			columns: 2,
		},
	}),
	render: (node) => {
		const title = String(node.props.title ?? "");
		const testimonials = Array.isArray(node.props.testimonials)
			? node.props.testimonials
			: [];
		const columns = Number(node.props.columns ?? 2);

		return (
			<section className="w-full bg-muted py-16">
				<div className="container mx-auto px-4">
					{title && (
						<h2 className="mb-12 text-center font-bold text-3xl md:text-4xl">
							{title}
						</h2>
					)}
					<div
						className="grid gap-6"
						style={{
							gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
						}}
					>
						{testimonials.map((testimonial: unknown, idx: number) => {
							const t = testimonial as {
								name?: string;
								role?: string;
								avatar?: string;
								quote?: string;
							};
							return (
								<div
									className="space-y-4 rounded-lg border bg-card p-6"
									key={`${t.name ?? ""}-${idx}`}
								>
									<p className="text-muted-foreground italic">
										"{String(t.quote ?? "")}"
									</p>
									<div className="flex items-center gap-3">
										{t.avatar ? (
											<Image
												alt={String(t.name ?? "")}
												className="rounded-full"
												height={48}
												src={String(t.avatar)}
												width={48}
											/>
										) : (
											<div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
												{String(t.name ?? "")
													.charAt(0)
													.toUpperCase()}
											</div>
										)}
										<div>
											<p className="font-semibold">{String(t.name ?? "")}</p>
											<p className="text-muted-foreground text-sm">
												{String(t.role ?? "")}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>
		);
	},
	inspector: ({ node, update }) => {
		const testimonials = Array.isArray(node.props.testimonials)
			? node.props.testimonials
			: [];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-testimonials-title`}
					>
						Title
					</Label>
					<Input
						id={`${node.id}-testimonials-title`}
						onChange={(e) => update({ title: e.target.value })}
						type="text"
						value={String(node.props.title ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-testimonials-columns`}
					>
						Columns
					</Label>
					<Select
						onValueChange={(value) => update({ columns: Number(value) })}
						value={String(node.props.columns ?? 2)}
					>
						<SelectTrigger
							className="w-full"
							id={`${node.id}-testimonials-columns`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left text-xs">Testimonials</Label>
					<div className="space-y-2">
						{testimonials.map((_testimonial: unknown, idx: number) => {
							const t = _testimonial as {
								name?: string;
								role?: string;
								avatar?: string;
								quote?: string;
							};
							return (
								<div
									className="space-y-2 rounded border p-2"
									key={`${t.name ?? ""}-${idx}`}
								>
									<Input
										onChange={(e) => {
											const newTestimonials = [...testimonials];
											newTestimonials[idx] = {
												...t,
												name: e.target.value,
											};
											update({ testimonials: newTestimonials });
										}}
										placeholder="Name"
										type="text"
										value={String(t.name ?? "")}
									/>
									<Input
										onChange={(e) => {
											const newTestimonials = [...testimonials];
											newTestimonials[idx] = {
												...t,
												role: e.target.value,
											};
											update({ testimonials: newTestimonials });
										}}
										placeholder="Role"
										type="text"
										value={String(t.role ?? "")}
									/>
									<Textarea
										className="min-h-[60px]"
										onChange={(e) => {
											const newTestimonials = [...testimonials];
											newTestimonials[idx] = {
												...t,
												quote: e.target.value,
											};
											update({ testimonials: newTestimonials });
										}}
										placeholder="Quote"
										value={String(t.quote ?? "")}
									/>
									<div className="space-y-2">
										<Label className="w-full text-left text-xs">Avatar</Label>
										{String(t.avatar ?? "").startsWith("https://") &&
										(String(t.avatar ?? "").includes("uploadthing.com") ||
											String(t.avatar ?? "").includes("utfs.io")) ? (
											<FileUploader
												accept="image/*"
												changeLabel="Change avatar"
												endpoint="mediaUploader"
												helperText="Upload an avatar image (max 4MB)"
												onChange={(url) => {
													const newTestimonials = [...testimonials];
													newTestimonials[idx] = {
														...t,
														avatar: url ?? "",
													};
													update({ testimonials: newTestimonials });
												}}
												removeLabel="Remove"
												uploadLabel="Upload avatar"
												value={String(t.avatar ?? "") || null}
												withContainer={false}
											/>
										) : (
											<>
												<Input
													onChange={(e) => {
														const newTestimonials = [...testimonials];
														newTestimonials[idx] = {
															...t,
															avatar: e.target.value,
														};
														update({ testimonials: newTestimonials });
													}}
													placeholder="Avatar URL (optional)"
													type="text"
													value={String(t.avatar ?? "")}
												/>
												<Button
													className="w-full"
													onClick={() => {
														const newTestimonials = [...testimonials];
														newTestimonials[idx] = {
															...t,
															avatar: "",
														};
														update({ testimonials: newTestimonials });
													}}
													size="sm"
													type="button"
													variant="outline"
												>
													Upload instead
												</Button>
											</>
										)}
									</div>
								</div>
							);
						})}
					</div>
					<Button
						className="w-full"
						onClick={() => {
							update({
								testimonials: [
									...testimonials,
									{
										name: "New Customer",
										role: "Role",
										avatar: "",
										quote: "Testimonial quote",
									},
								],
							});
						}}
						size="sm"
						type="button"
						variant="outline"
					>
						Add Testimonial
					</Button>
				</div>
			</div>
		);
	},
};

const CTABlock: BlockDefinition = {
	key: "cta",
	label: "CTA",
	category: "content",
	allowsChildren: false,
	create: () => ({
		id: nanoid(),
		type: "cta",
		props: {
			title: "Ready to get started?",
			subtitle: "Join thousands of satisfied customers",
			buttonText: "Get Started",
			buttonHref: "#",
			background: "primary",
			align: "center",
		},
	}),
	render: (node) => {
		const title = String(node.props.title ?? "");
		const subtitle = String(node.props.subtitle ?? "");
		const buttonText = String(node.props.buttonText ?? "");
		const buttonHref = String(node.props.buttonHref ?? "#");
		const background = String(node.props.background ?? "primary");
		const align = String(node.props.align ?? "center");

		const bgClass =
			background === "primary"
				? "bg-primary text-primary-foreground"
				: background === "muted"
					? "bg-muted"
					: "";

		return (
			<section
				className={`w-full py-16 ${bgClass}`}
				style={{
					background:
						background !== "primary" && background !== "muted"
							? background
							: undefined,
					textAlign: align as CSSProperties["textAlign"],
				}}
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-2xl space-y-6">
						{title && (
							<h2 className="font-bold text-3xl md:text-4xl">{title}</h2>
						)}
						{subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
						{buttonText && (
							<div>
								<a
									className={`inline-flex items-center justify-center rounded-md px-6 py-3 font-medium text-base transition-colors ${
										background === "primary"
											? "bg-background text-foreground hover:bg-background/90"
											: "bg-primary text-primary-foreground hover:bg-primary/90"
									}`}
									href={buttonHref}
								>
									{buttonText}
								</a>
							</div>
						)}
					</div>
				</div>
			</section>
		);
	},
	inspector: ({ node, update }) => {
		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-cta-title`}
					>
						Title
					</Label>
					<Input
						id={`${node.id}-cta-title`}
						onChange={(e) => update({ title: e.target.value })}
						type="text"
						value={String(node.props.title ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-cta-subtitle`}
					>
						Subtitle
					</Label>
					<Input
						id={`${node.id}-cta-subtitle`}
						onChange={(e) => update({ subtitle: e.target.value })}
						type="text"
						value={String(node.props.subtitle ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-cta-buttonText`}
					>
						Button Text
					</Label>
					<Input
						id={`${node.id}-cta-buttonText`}
						onChange={(e) => update({ buttonText: e.target.value })}
						type="text"
						value={String(node.props.buttonText ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-cta-buttonHref`}
					>
						Button Link
					</Label>
					<Input
						id={`${node.id}-cta-buttonHref`}
						onChange={(e) => update({ buttonHref: e.target.value })}
						type="text"
						value={String(node.props.buttonHref ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-cta-background`}
					>
						Background
					</Label>
					<Select
						onValueChange={(value) => update({ background: value })}
						value={String(node.props.background ?? "primary")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-cta-background`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="primary">Primary</SelectItem>
							<SelectItem value="muted">Muted</SelectItem>
							<SelectItem value="transparent">Transparent</SelectItem>
							<SelectItem value="custom">Custom</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{String(node.props.background) === "custom" && (
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-cta-customBackground`}
						>
							Custom Background
						</Label>
						<Input
							id={`${node.id}-cta-customBackground`}
							onChange={(e) => update({ background: e.target.value })}
							placeholder="#fff or gradient"
							type="text"
							value={String(node.props.background ?? "")}
						/>
					</div>
				)}
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-cta-align`}
					>
						Text Align
					</Label>
					<Select
						onValueChange={(value) => update({ align: value })}
						value={String(node.props.align ?? "center")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-cta-align`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="left">Left</SelectItem>
							<SelectItem value="center">Center</SelectItem>
							<SelectItem value="right">Right</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		);
	},
};

const FooterBlock: BlockDefinition = {
	key: "footer",
	label: "Footer",
	category: "content",
	allowsChildren: false,
	create: () => ({
		id: nanoid(),
		type: "footer",
		props: {
			copyright: "© 2024 Company Name. All rights reserved.",
			links: [
				{ label: "About", href: "#" },
				{ label: "Contact", href: "#" },
				{ label: "Privacy", href: "#" },
			],
			socialLinks: [
				{ platform: "Twitter", href: "#" },
				{ platform: "LinkedIn", href: "#" },
			],
		},
	}),
	render: (node) => {
		const copyright = String(node.props.copyright ?? "");
		const links = Array.isArray(node.props.links) ? node.props.links : [];
		const socialLinks = Array.isArray(node.props.socialLinks)
			? node.props.socialLinks
			: [];

		return (
			<footer className="w-full border-t bg-muted py-12">
				<div className="container mx-auto px-4">
					<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
						<div className="flex flex-wrap items-center gap-4">
							{links.map((link: unknown, idx: number) => {
								const l = link as { label?: string; href?: string };
								return (
									<a
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
										href={String(l.href ?? "#")}
										key={`${l.label ?? ""}-${idx}`}
									>
										{String(l.label ?? "")}
									</a>
								);
							})}
						</div>
						<div className="flex items-center gap-4">
							{socialLinks.map((social: unknown, idx: number) => {
								const s = social as { platform?: string; href?: string };
								return (
									<a
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
										href={String(s.href ?? "#")}
										key={`${s.platform ?? ""}-${idx}`}
									>
										{String(s.platform ?? "")}
									</a>
								);
							})}
						</div>
						{copyright && (
							<p className="text-muted-foreground text-sm">{copyright}</p>
						)}
					</div>
				</div>
			</footer>
		);
	},
	inspector: ({ node, update }) => {
		const links = Array.isArray(node.props.links) ? node.props.links : [];
		const socialLinks = Array.isArray(node.props.socialLinks)
			? node.props.socialLinks
			: [];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-footer-copyright`}
					>
						Copyright Text
					</Label>
					<Input
						id={`${node.id}-footer-copyright`}
						onChange={(e) => update({ copyright: e.target.value })}
						type="text"
						value={String(node.props.copyright ?? "")}
					/>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left text-xs">Links</Label>
					<div className="space-y-2">
						{links.map((_link: unknown, idx: number) => {
							const l = _link as { label?: string; href?: string };
							return (
								<div className="flex gap-2" key={`${l.label ?? ""}-${idx}`}>
									<Input
										onChange={(e) => {
											const newLinks = [...links];
											newLinks[idx] = { ...l, label: e.target.value };
											update({ links: newLinks });
										}}
										placeholder="Label"
										type="text"
										value={String(l.label ?? "")}
									/>
									<Input
										onChange={(e) => {
											const newLinks = [...links];
											newLinks[idx] = { ...l, href: e.target.value };
											update({ links: newLinks });
										}}
										placeholder="URL"
										type="text"
										value={String(l.href ?? "")}
									/>
								</div>
							);
						})}
					</div>
					<Button
						className="w-full"
						onClick={() => {
							update({
								links: [...links, { label: "New Link", href: "#" }],
							});
						}}
						size="sm"
						type="button"
						variant="outline"
					>
						Add Link
					</Button>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left text-xs">Social Links</Label>
					<div className="space-y-2">
						{socialLinks.map((_social: unknown, idx: number) => {
							const s = _social as { platform?: string; href?: string };
							return (
								<div className="flex gap-2" key={`${s.platform ?? ""}-${idx}`}>
									<Input
										onChange={(e) => {
											const newSocialLinks = [...socialLinks];
											newSocialLinks[idx] = {
												...s,
												platform: e.target.value,
											};
											update({ socialLinks: newSocialLinks });
										}}
										placeholder="Platform"
										type="text"
										value={String(s.platform ?? "")}
									/>
									<Input
										onChange={(e) => {
											const newSocialLinks = [...socialLinks];
											newSocialLinks[idx] = { ...s, href: e.target.value };
											update({ socialLinks: newSocialLinks });
										}}
										placeholder="URL"
										type="text"
										value={String(s.href ?? "")}
									/>
								</div>
							);
						})}
					</div>
					<Button
						className="w-full"
						onClick={() => {
							update({
								socialLinks: [
									...socialLinks,
									{ platform: "Platform", href: "#" },
								],
							});
						}}
						size="sm"
						type="button"
						variant="outline"
					>
						Add Social Link
					</Button>
				</div>
			</div>
		);
	},
};

const JobListBlock: BlockDefinition = {
	key: "job-list",
	label: "Job List",
	category: "jobs",
	allowsChildren: false,
	create: () => ({
		id: nanoid(),
		type: "job-list",
		props: {
			title: "Open Positions",
			layout: "list",
			showFilters: true,
			jobs: [
				{
					title: "Senior Software Engineer",
					company: "Tech Corp",
					location: "San Francisco, CA",
					type: "Full-time",
					salary: "$120k - $180k",
					description: "We are looking for an experienced software engineer...",
				},
				{
					title: "Product Designer",
					company: "Design Studio",
					location: "Remote",
					type: "Full-time",
					salary: "$90k - $130k",
					description: "Join our design team to create amazing products...",
				},
			],
		},
	}),
	render: (node) => {
		const title = String(node.props.title ?? "");
		const layout = String(node.props.layout ?? "list");
		const showFilters = Boolean(node.props.showFilters ?? true);
		const jobs = Array.isArray(node.props.jobs) ? node.props.jobs : [];

		return (
			<section className="w-full py-16">
				<div className="container mx-auto px-4">
					{title && (
						<h2 className="mb-8 text-center font-bold text-3xl md:text-4xl">
							{title}
						</h2>
					)}
					{showFilters && (
						<div className="mb-6 flex flex-wrap gap-4">
							<Select disabled>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="All Locations" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Locations</SelectItem>
									<SelectItem value="sf">San Francisco, CA</SelectItem>
									<SelectItem value="remote">Remote</SelectItem>
								</SelectContent>
							</Select>
							<Select disabled>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="All Types" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									<SelectItem value="full-time">Full-time</SelectItem>
									<SelectItem value="part-time">Part-time</SelectItem>
									<SelectItem value="contract">Contract</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
					<div
						className={
							layout === "grid"
								? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
								: "space-y-4"
						}
					>
						{jobs.map((job: unknown, idx: number) => {
							const j = job as {
								title?: string;
								company?: string;
								location?: string;
								type?: string;
								salary?: string;
								description?: string;
								applyUrl?: string;
							};
							return (
								<div
									className="space-y-3 rounded-lg border bg-card p-6"
									key={`${j.title ?? ""}-${idx}`}
								>
									<div>
										<h3 className="font-semibold text-xl">
											{String(j.title ?? "")}
										</h3>
										<p className="text-muted-foreground text-sm">
											{String(j.company ?? "")}
										</p>
									</div>
									<div className="flex flex-wrap gap-2 text-muted-foreground text-sm">
										{j.location && (
											<span className="flex items-center gap-1">
												📍 {String(j.location)}
											</span>
										)}
										{j.type && (
											<span className="flex items-center gap-1">
												⏰ {String(j.type)}
											</span>
										)}
										{j.salary && (
											<span className="flex items-center gap-1">
												💰 {String(j.salary)}
											</span>
										)}
									</div>
									{j.description && (
										<p className="text-muted-foreground text-sm">
											{String(j.description)}
										</p>
									)}
								</div>
							);
						})}
					</div>
					{jobs.length === 0 && (
						<div className="flex min-h-[200px] items-center justify-center rounded border border-dashed bg-muted text-muted-foreground text-sm">
							No jobs available
						</div>
					)}
				</div>
			</section>
		);
	},
	inspector: ({ node, update }) => {
		const jobs = Array.isArray(node.props.jobs) ? node.props.jobs : [];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-job-list-title`}
					>
						Title
					</Label>
					<Input
						id={`${node.id}-job-list-title`}
						onChange={(e) => update({ title: e.target.value })}
						type="text"
						value={String(node.props.title ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-job-list-layout`}
					>
						Layout
					</Label>
					<Select
						onValueChange={(value) => update({ layout: value })}
						value={String(node.props.layout ?? "list")}
					>
						<SelectTrigger className="w-full" id={`${node.id}-job-list-layout`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="list">List</SelectItem>
							<SelectItem value="grid">Grid</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={Boolean(node.props.showFilters ?? true)}
						id={`${node.id}-job-list-showFilters`}
						onCheckedChange={(checked) => update({ showFilters: checked })}
					/>
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-job-list-showFilters`}
					>
						Show Filters
					</Label>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left text-xs">Jobs</Label>
					<div className="space-y-2">
						{jobs.map((_job: unknown, idx: number) => {
							const j = _job as {
								title?: string;
								company?: string;
								location?: string;
								type?: string;
								salary?: string;
								description?: string;
							};
							return (
								<div
									className="space-y-2 rounded border p-2"
									key={`${j.title ?? ""}-${idx}`}
								>
									<Input
										onChange={(e) => {
											const newJobs = [...jobs];
											newJobs[idx] = { ...j, title: e.target.value };
											update({ jobs: newJobs });
										}}
										placeholder="Job Title"
										type="text"
										value={String(j.title ?? "")}
									/>
									<Input
										onChange={(e) => {
											const newJobs = [...jobs];
											newJobs[idx] = { ...j, company: e.target.value };
											update({ jobs: newJobs });
										}}
										placeholder="Company"
										type="text"
										value={String(j.company ?? "")}
									/>
									<div className="grid grid-cols-2 gap-2">
										<Input
											onChange={(e) => {
												const newJobs = [...jobs];
												newJobs[idx] = { ...j, location: e.target.value };
												update({ jobs: newJobs });
											}}
											placeholder="Location"
											type="text"
											value={String(j.location ?? "")}
										/>
										<Input
											onChange={(e) => {
												const newJobs = [...jobs];
												newJobs[idx] = { ...j, type: e.target.value };
												update({ jobs: newJobs });
											}}
											placeholder="Type (e.g., Full-time)"
											type="text"
											value={String(j.type ?? "")}
										/>
									</div>
									<Input
										onChange={(e) => {
											const newJobs = [...jobs];
											newJobs[idx] = { ...j, salary: e.target.value };
											update({ jobs: newJobs });
										}}
										placeholder="Salary Range"
										type="text"
										value={String(j.salary ?? "")}
									/>
									<Textarea
										className="min-h-[60px]"
										onChange={(e) => {
											const newJobs = [...jobs];
											newJobs[idx] = { ...j, description: e.target.value };
											update({ jobs: newJobs });
										}}
										placeholder="Job Description"
										value={String(j.description ?? "")}
									/>
								</div>
							);
						})}
					</div>
					<Button
						className="w-full"
						onClick={() => {
							update({
								jobs: [
									...jobs,
									{
										title: "New Job",
										company: "Company Name",
										location: "Location",
										type: "Full-time",
										salary: "",
										description: "Job description",
									},
								],
							});
						}}
						size="sm"
						type="button"
						variant="outline"
					>
						Add Job
					</Button>
				</div>
			</div>
		);
	},
};

const JobCardBlock: BlockDefinition = {
	key: "job-card",
	label: "Job Card",
	category: "jobs",
	allowsChildren: false,
	create: () => ({
		id: nanoid(),
		type: "job-card",
		props: {
			title: "Senior Software Engineer",
			company: "Tech Corp",
			location: "San Francisco, CA",
			type: "Full-time",
			salary: "$120k - $180k",
			description:
				"We are looking for an experienced software engineer to join our team.",
			requirements: [
				"5+ years of experience",
				"React/Next.js expertise",
				"Team leadership",
			],
			showCompany: true,
			showLocation: true,
			showType: true,
			showSalary: true,
			showRequirements: true,
		},
	}),
	render: (node) => {
		const title = String(node.props.title ?? "");
		const company = String(node.props.company ?? "");
		const location = String(node.props.location ?? "");
		const type = String(node.props.type ?? "");
		const salary = String(node.props.salary ?? "");
		const description = String(node.props.description ?? "");
		const requirements = Array.isArray(node.props.requirements)
			? node.props.requirements.map(String)
			: [];
		const showCompany = Boolean(node.props.showCompany ?? true);
		const showLocation = Boolean(node.props.showLocation ?? true);
		const showType = Boolean(node.props.showType ?? true);
		const showSalary = Boolean(node.props.showSalary ?? true);
		const showRequirements = Boolean(node.props.showRequirements ?? true);

		return (
			<section className="w-full py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-3xl space-y-6 rounded-lg border bg-card p-8">
						<div>
							<h1 className="mb-2 font-bold text-3xl md:text-4xl">{title}</h1>
							{showCompany && company && (
								<p className="text-lg text-muted-foreground">{company}</p>
							)}
						</div>
						<div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
							{showLocation && location && (
								<span className="flex items-center gap-1">📍 {location}</span>
							)}
							{showType && type && (
								<span className="flex items-center gap-1">⏰ {type}</span>
							)}
							{showSalary && salary && (
								<span className="flex items-center gap-1">💰 {salary}</span>
							)}
						</div>
						{description && (
							<div>
								<h2 className="mb-2 font-semibold text-lg">Description</h2>
								<p className="text-muted-foreground">{description}</p>
							</div>
						)}
						{showRequirements && requirements.length > 0 && (
							<div>
								<h2 className="mb-2 font-semibold text-lg">Requirements</h2>
								<ul className="list-disc space-y-1 pl-5 text-muted-foreground">
									{requirements.map((req) => (
										<li key={req}>{req}</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			</section>
		);
	},
	inspector: ({ node, update }) => {
		const requirements = Array.isArray(node.props.requirements)
			? node.props.requirements.map(String)
			: [];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-job-card-title`}
					>
						Job Title
					</Label>
					<Input
						id={`${node.id}-job-card-title`}
						onChange={(e) => update({ title: e.target.value })}
						type="text"
						value={String(node.props.title ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-job-card-company`}
					>
						Company
					</Label>
					<Input
						id={`${node.id}-job-card-company`}
						onChange={(e) => update({ company: e.target.value })}
						type="text"
						value={String(node.props.company ?? "")}
					/>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-job-card-location`}
						>
							Location
						</Label>
						<Input
							id={`${node.id}-job-card-location`}
							onChange={(e) => update({ location: e.target.value })}
							type="text"
							value={String(node.props.location ?? "")}
						/>
					</div>
					<div className="space-y-1">
						<Label
							className="w-full text-left text-xs"
							htmlFor={`${node.id}-job-card-type`}
						>
							Type
						</Label>
						<Input
							id={`${node.id}-job-card-type`}
							onChange={(e) => update({ type: e.target.value })}
							type="text"
							value={String(node.props.type ?? "")}
						/>
					</div>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-job-card-salary`}
					>
						Salary
					</Label>
					<Input
						id={`${node.id}-job-card-salary`}
						onChange={(e) => update({ salary: e.target.value })}
						type="text"
						value={String(node.props.salary ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-job-card-description`}
					>
						Description
					</Label>
					<Textarea
						className="min-h-[80px]"
						id={`${node.id}-job-card-description`}
						onChange={(e) => update({ description: e.target.value })}
						value={String(node.props.description ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-job-card-requirements`}
					>
						Requirements (one per line)
					</Label>
					<Textarea
						className="min-h-[100px]"
						id={`${node.id}-job-card-requirements`}
						onChange={(e) => {
							const lines = e.target.value
								.split("\n")
								.map((line) => line.trim())
								.filter((line) => line.length > 0);
							update({ requirements: lines.length > 0 ? lines : [] });
						}}
						value={requirements.join("\n")}
					/>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left text-xs">Display Options</Label>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Checkbox
								checked={Boolean(node.props.showCompany ?? true)}
								id={`${node.id}-job-card-showCompany`}
								onCheckedChange={(checked) => update({ showCompany: checked })}
							/>
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-job-card-showCompany`}
							>
								Show Company
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								checked={Boolean(node.props.showLocation ?? true)}
								id={`${node.id}-job-card-showLocation`}
								onCheckedChange={(checked) => update({ showLocation: checked })}
							/>
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-job-card-showLocation`}
							>
								Show Location
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								checked={Boolean(node.props.showType ?? true)}
								id={`${node.id}-job-card-showType`}
								onCheckedChange={(checked) => update({ showType: checked })}
							/>
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-job-card-showType`}
							>
								Show Type
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								checked={Boolean(node.props.showSalary ?? true)}
								id={`${node.id}-job-card-showSalary`}
								onCheckedChange={(checked) => update({ showSalary: checked })}
							/>
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-job-card-showSalary`}
							>
								Show Salary
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								checked={Boolean(node.props.showRequirements ?? true)}
								id={`${node.id}-job-card-showRequirements`}
								onCheckedChange={(checked) =>
									update({ showRequirements: checked })
								}
							/>
							<Label
								className="w-full text-left text-xs"
								htmlFor={`${node.id}-job-card-showRequirements`}
							>
								Show Requirements
							</Label>
						</div>
					</div>
				</div>
			</div>
		);
	},
};

const ApplicationFormBlock: BlockDefinition = {
	key: "application-form",
	label: "Application Form",
	category: "jobs",
	allowsChildren: false,
	create: () => ({
		id: nanoid(),
		type: "application-form",
		props: {
			title: "Apply for this Position",
			action: "",
			method: "post",
			showJobSelect: true,
			jobs: [
				{ id: "1", title: "Senior Software Engineer", company: "Tech Corp" },
				{ id: "2", title: "Product Designer", company: "Design Studio" },
			],
			fields: {
				name: { label: "Full Name", required: true, show: true },
				email: { label: "Email", required: true, show: true },
				phone: { label: "Phone", required: false, show: true },
				resume: { label: "Resume", required: true, show: true },
				coverLetter: { label: "Cover Letter", required: false, show: true },
			},
		},
	}),
	render: (node) => {
		const title = String(node.props.title ?? "");
		const action = String(node.props.action ?? "");
		const method = String(node.props.method ?? "post");
		const showJobSelect = Boolean(node.props.showJobSelect ?? true);
		const jobs = Array.isArray(node.props.jobs) ? node.props.jobs : [];
		const fields = node.props.fields as {
			name?: { label?: string; required?: boolean; show?: boolean };
			email?: { label?: string; required?: boolean; show?: boolean };
			phone?: { label?: string; required?: boolean; show?: boolean };
			resume?: { label?: string; required?: boolean; show?: boolean };
			coverLetter?: { label?: string; required?: boolean; show?: boolean };
		} | null;

		return (
			<section className="w-full py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-2xl">
						{title && (
							<h2 className="mb-6 text-center font-bold text-3xl md:text-4xl">
								{title}
							</h2>
						)}
						<form
							action={action || undefined}
							className="space-y-6 rounded-lg border bg-card p-6"
							method={method as "get" | "post"}
						>
							{showJobSelect && jobs.length > 0 && (
								<div className="space-y-2">
									<Label
										className="font-medium text-sm"
										htmlFor={`${node.id}-application-form-job`}
									>
										Select Position
										<span className="text-destructive"> *</span>
									</Label>
									<Select disabled>
										<SelectTrigger
											className="w-full"
											id={`${node.id}-application-form-job`}
										>
											<SelectValue placeholder="Choose a position" />
										</SelectTrigger>
										<SelectContent>
											{jobs.map((job: unknown) => {
												const j = job as {
													id?: string;
													title?: string;
													company?: string;
												};
												return (
													<SelectItem
														key={String(j.id ?? j.title ?? "")}
														value={String(j.id ?? j.title ?? "")}
													>
														{String(j.title ?? "")}
														{String(j.company ?? "") && (
															<span className="text-muted-foreground text-sm">
																{" "}
																- {String(j.company)}
															</span>
														)}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</div>
							)}
							{fields?.name?.show && (
								<div className="space-y-2">
									<Label
										className="font-medium text-sm"
										htmlFor={`${node.id}-application-form-name`}
									>
										{fields.name.label ?? "Full Name"}
										{fields.name.required && (
											<span className="text-destructive"> *</span>
										)}
									</Label>
									<Input
										disabled
										id={`${node.id}-application-form-name`}
										name="name"
										required={fields.name.required}
										type="text"
									/>
								</div>
							)}
							{fields?.email?.show && (
								<div className="space-y-2">
									<Label
										className="font-medium text-sm"
										htmlFor={`${node.id}-application-form-email`}
									>
										{fields.email.label ?? "Email"}
										{fields.email.required && (
											<span className="text-destructive"> *</span>
										)}
									</Label>
									<Input
										disabled
										id={`${node.id}-application-form-email`}
										name="email"
										required={fields.email.required}
										type="email"
									/>
								</div>
							)}
							{fields?.phone?.show && (
								<div className="space-y-2">
									<Label
										className="font-medium text-sm"
										htmlFor={`${node.id}-application-form-phone`}
									>
										{fields.phone.label ?? "Phone"}
										{fields.phone.required && (
											<span className="text-destructive"> *</span>
										)}
									</Label>
									<Input
										disabled
										id={`${node.id}-application-form-phone`}
										name="phone"
										required={fields.phone.required}
										type="tel"
									/>
								</div>
							)}
							{fields?.resume?.show && (
								<div className="space-y-2">
									<Label
										className="font-medium text-sm"
										htmlFor={`${node.id}-application-form-resume`}
									>
										{fields.resume.label ?? "Resume"}
										{fields.resume.required && (
											<span className="text-destructive"> *</span>
										)}
									</Label>
									<div
										className="flex min-h-[100px] items-center justify-center rounded border border-dashed bg-muted text-muted-foreground text-sm"
										id={`${node.id}-application-form-resume`}
									>
										Upload resume (PDF, DOC, DOCX - max 5MB)
									</div>
								</div>
							)}
							{fields?.coverLetter?.show && (
								<div className="space-y-2">
									<Label
										className="font-medium text-sm"
										htmlFor={`${node.id}-application-form-coverLetter`}
									>
										{fields.coverLetter.label ?? "Cover Letter"}
										{fields.coverLetter.required && (
											<span className="text-destructive"> *</span>
										)}
									</Label>
									<Textarea
										className="min-h-[120px]"
										disabled
										id={`${node.id}-application-form-coverLetter`}
										name="coverLetter"
										required={fields.coverLetter.required}
									/>
								</div>
							)}
							<Button disabled type="submit">
								Submit Application
							</Button>
						</form>
					</div>
				</div>
			</section>
		);
	},
	inspector: ({ node, update }) => {
		const fields =
			(node.props.fields as {
				name?: { label?: string; required?: boolean; show?: boolean };
				email?: { label?: string; required?: boolean; show?: boolean };
				phone?: { label?: string; required?: boolean; show?: boolean };
				resume?: { label?: string; required?: boolean; show?: boolean };
				coverLetter?: { label?: string; required?: boolean; show?: boolean };
			}) ?? {};
		const jobs = Array.isArray(node.props.jobs) ? node.props.jobs : [];

		return (
			<div className="space-y-3">
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-application-form-title`}
					>
						Form Title
					</Label>
					<Input
						id={`${node.id}-application-form-title`}
						onChange={(e) => update({ title: e.target.value })}
						type="text"
						value={String(node.props.title ?? "")}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={Boolean(node.props.showJobSelect ?? true)}
						id={`${node.id}-application-form-showJobSelect`}
						onCheckedChange={(checked) => update({ showJobSelect: checked })}
					/>
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-application-form-showJobSelect`}
					>
						Show Job Selection
					</Label>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left text-xs">Available Jobs</Label>
					<div className="space-y-2">
						{jobs.map((_job: unknown, idx: number) => {
							const j = _job as {
								id?: string;
								title?: string;
								company?: string;
							};
							return (
								<div
									className="space-y-2 rounded border p-2"
									key={`${j.id ?? j.title ?? ""}-${idx}`}
								>
									<Input
										onChange={(e) => {
											const newJobs = [...jobs];
											newJobs[idx] = { ...j, id: e.target.value };
											update({ jobs: newJobs });
										}}
										placeholder="Job ID (unique identifier)"
										type="text"
										value={String(j.id ?? "")}
									/>
									<Input
										onChange={(e) => {
											const newJobs = [...jobs];
											newJobs[idx] = { ...j, title: e.target.value };
											update({ jobs: newJobs });
										}}
										placeholder="Job Title"
										type="text"
										value={String(j.title ?? "")}
									/>
									<Input
										onChange={(e) => {
											const newJobs = [...jobs];
											newJobs[idx] = { ...j, company: e.target.value };
											update({ jobs: newJobs });
										}}
										placeholder="Company (optional)"
										type="text"
										value={String(j.company ?? "")}
									/>
								</div>
							);
						})}
					</div>
					<Button
						className="w-full"
						onClick={() => {
							update({
								jobs: [
									...jobs,
									{
										id: `job-${Date.now()}`,
										title: "New Job",
										company: "",
									},
								],
							});
						}}
						size="sm"
						type="button"
						variant="outline"
					>
						Add Job
					</Button>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-application-form-action`}
					>
						Form Action URL
					</Label>
					<Input
						id={`${node.id}-application-form-action`}
						onChange={(e) => update({ action: e.target.value })}
						placeholder="/api/apply"
						type="text"
						value={String(node.props.action ?? "")}
					/>
				</div>
				<div className="space-y-1">
					<Label
						className="w-full text-left text-xs"
						htmlFor={`${node.id}-application-form-method`}
					>
						Method
					</Label>
					<Select
						onValueChange={(value) => update({ method: value })}
						value={String(node.props.method ?? "post")}
					>
						<SelectTrigger
							className="w-full"
							id={`${node.id}-application-form-method`}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="get">GET</SelectItem>
							<SelectItem value="post">POST</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label className="w-full text-left text-xs">Form Fields</Label>
					{Object.entries(fields).map(([key, field]) => (
						<div className="space-y-2 rounded border p-2" key={key}>
							<div className="flex items-center justify-between">
								<Label className="text-xs capitalize">{key}</Label>
								<div className="flex items-center gap-2">
									<Checkbox
										checked={Boolean(field?.show ?? true)}
										id={`${node.id}-application-form-${key}-show`}
										onCheckedChange={(checked) => {
											update({
												fields: {
													...fields,
													[key]: { ...field, show: checked },
												},
											});
										}}
									/>
									<Label
										className="text-xs"
										htmlFor={`${node.id}-application-form-${key}-show`}
									>
										Show
									</Label>
								</div>
							</div>
							{field?.show && (
								<>
									<Input
										onChange={(e) => {
											update({
												fields: {
													...fields,
													[key]: { ...field, label: e.target.value },
												},
											});
										}}
										placeholder="Field Label"
										type="text"
										value={String(field?.label ?? "")}
									/>
									<div className="flex items-center gap-2">
										<Checkbox
											checked={Boolean(field?.required ?? false)}
											id={`${node.id}-application-form-${key}-required`}
											onCheckedChange={(checked) => {
												update({
													fields: {
														...fields,
														[key]: { ...field, required: checked },
													},
												});
											}}
										/>
										<Label
											className="text-xs"
											htmlFor={`${node.id}-application-form-${key}-required`}
										>
											Required
										</Label>
									</div>
								</>
							)}
						</div>
					))}
				</div>
			</div>
		);
	},
};

export const BLOCKS: Record<string, BlockDefinition> = {
	section: Section,
	container: Container,
	"flex-row": FlexRow,
	"column-stack": ColumnStack,
	spacer: Spacer,
	heading: Heading,
	text: TextBlock,
	button: ButtonBlock,
	image: ImageBlock,
	link: LinkBlock,
	list: ListBlock,
	quote: QuoteBlock,
	badge: BadgeBlock,
	divider: DividerBlock,
	"rich-text": RichTextBlock,
	video: VideoBlock,
	icon: IconBlock,
	input: InputBlock,
	textarea: TextareaBlock,
	select: SelectBlock,
	checkbox: CheckboxBlock,
	radio: RadioBlock,
	"form-container": FormContainerBlock,
	hero: HeroBlock,
	features: FeaturesBlock,
	testimonials: TestimonialsBlock,
	cta: CTABlock,
	footer: FooterBlock,
	"job-list": JobListBlock,
	"job-card": JobCardBlock,
	"application-form": ApplicationFormBlock,
};

export const PALETTE: BlockDefinition[] = [
	Section,
	Container,
	FlexRow,
	ColumnStack,
	Spacer,
	Heading,
	TextBlock,
	ButtonBlock,
	ImageBlock,
	LinkBlock,
	ListBlock,
	QuoteBlock,
	BadgeBlock,
	DividerBlock,
	RichTextBlock,
	VideoBlock,
	IconBlock,
	InputBlock,
	TextareaBlock,
	SelectBlock,
	CheckboxBlock,
	RadioBlock,
	FormContainerBlock,
	HeroBlock,
	FeaturesBlock,
	TestimonialsBlock,
	CTABlock,
	FooterBlock,
	JobListBlock,
	JobCardBlock,
	ApplicationFormBlock,
];

export const createInitialTree = (): BuilderNode => {
	return {
		id: nanoid(),
		type: "root",
		props: {},
		children: [],
	};
};
