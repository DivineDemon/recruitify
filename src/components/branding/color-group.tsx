"use client";

import { ColorPicker } from "@/components/branding/color-picker";
import { cn } from "@/lib/utils";

interface ColorField {
	id: string;
	label: string;
	value: string;
	description?: string;
}

interface ColorGroupProps {
	title: string;
	fields: ColorField[];
	onChange: (id: string, value: string) => void;
	className?: string;
}

export const ColorGroup = ({
	title,
	fields,
	onChange,
	className,
}: ColorGroupProps) => {
	return (
		<section
			className={cn("flex flex-col gap-4 rounded-lg border p-4", className)}
		>
			<header>
				<h3 className="font-semibold text-sm">{title}</h3>
			</header>
			<div className="grid gap-4 sm:grid-cols-2">
				{fields.map((field) => (
					<ColorPicker
						description={field.description}
						id={field.id}
						key={field.id}
						label={field.label}
						onChange={(value) => onChange(field.id, value)}
						value={field.value}
					/>
				))}
			</div>
		</section>
	);
};
