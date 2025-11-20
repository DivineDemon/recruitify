"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	description?: string;
	disabled?: boolean;
}

export const ColorPicker = ({
	id,
	label,
	value,
	onChange,
	description,
	disabled,
}: ColorPickerProps) => {
	const handleColorChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onChange(event.target.value);
		},
		[onChange],
	);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-3">
				<div className="flex flex-col gap-1">
					<Label htmlFor={id}>{label}</Label>
					{description ? (
						<p className="text-muted-foreground text-xs">{description}</p>
					) : null}
				</div>
				<div className="flex items-center gap-2">
					<input
						aria-label={`${label} color preview`}
						className="h-8 w-8 cursor-pointer rounded border"
						disabled={disabled}
						id={`${id}-color`}
						onChange={handleColorChange}
						type="color"
						value={value}
					/>
				</div>
			</div>
			<Input
				disabled={disabled}
				id={id}
				onChange={handleColorChange}
				placeholder="#000000"
				value={value}
			/>
		</div>
	);
};
