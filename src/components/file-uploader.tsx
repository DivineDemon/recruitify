"use client";

import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
	value?: string | null;
	onChange?: (url: string | null) => void;
	endpoint: keyof OurFileRouter;
	className?: string;
	accept?: string;
	uploadLabel?: string;
	changeLabel?: string;
	removeLabel?: string;
	helperText?: string;
	preview?: boolean;
	disabled?: boolean;
	withContainer?: boolean;
}

const FileUploader = ({
	value,
	onChange,
	endpoint,
	className,
	accept = "*",
	uploadLabel = "Select file",
	changeLabel = "Change file",
	removeLabel = "Remove",
	helperText,
	preview = true,
	disabled = false,
	withContainer = true,
}: FileUploaderProps) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { startUpload, isUploading: uploadThingUploading } =
		useUploadThing(endpoint);

	const showPreview = Boolean(value) && preview && accept.includes("image");

	const reset = () => {
		onChange?.(null);
		setError(null);
	};

	const handleFileSelection = async (fileList: FileList | null) => {
		if (!fileList || fileList.length === 0) return;

		const files = Array.from(fileList);
		setIsUploading(true);
		setError(null);

		try {
			const result = await startUpload(files);

			const url = result?.[0]?.url;

			if (url) {
				onChange?.(url);
			} else {
				setError("Unable to upload file. Please try again.");
			}
		} catch (uploadError) {
			console.error(uploadError);
			setError("Something went wrong while uploading. Please try again.");
		} finally {
			setIsUploading(false);
		}
	};

	const isBusy = isUploading || uploadThingUploading;

	const Wrapper = withContainer ? "div" : "section";

	return (
		<Wrapper
			className={cn(
				"flex w-full flex-col gap-3",
				withContainer &&
					"rounded-lg border border-border border-dashed bg-muted/30 p-4",
				className,
			)}
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="relative flex size-18 items-center justify-center overflow-hidden rounded-md bg-muted">
						{showPreview ? (
							<Image
								alt="Uploaded file preview"
								className="object-cover"
								fill
								src={value as string}
							/>
						) : (
							<Upload className="size-6 text-muted-foreground" />
						)}
					</div>
					<input
						accept={accept}
						className="hidden"
						disabled={isBusy || disabled}
						onChange={(event) => handleFileSelection(event.target.files)}
						ref={inputRef}
						type="file"
					/>
					<div className="flex flex-col items-center gap-2">
						<Button
							className="w-full"
							disabled={isBusy || disabled}
							onClick={() => inputRef.current?.click()}
							size="sm"
							type="button"
						>
							{isBusy ? (
								<Loader2 className="animate-spin" />
							) : value ? (
								changeLabel
							) : (
								uploadLabel
							)}
						</Button>
						{value ? (
							<Button
								className="w-full"
								disabled={isBusy || disabled}
								onClick={reset}
								size="sm"
								type="button"
								variant="destructive"
							>
								<Trash2 />
								{removeLabel}
							</Button>
						) : null}
					</div>
				</div>
			</div>
			{helperText ? (
				<p className="text-muted-foreground text-xs">{helperText}</p>
			) : null}
			{error ? <p className="text-destructive text-xs">{error}</p> : null}
		</Wrapper>
	);
};

export default FileUploader;
