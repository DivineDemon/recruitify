"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoUploadDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	logoUrl: string;
	onLogoUrlChange: (value: string) => void;
	onFileUpload: (files: FileList | null) => void;
	onSubmitUrl: () => void;
	isUploading: boolean;
	isSubmitting: boolean;
}

export function LogoUploadDialog({
	open,
	onOpenChange,
	logoUrl,
	onLogoUrlChange,
	onFileUpload,
	onSubmitUrl,
	isUploading,
	isSubmitting,
}: LogoUploadDialogProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upload Logo</DialogTitle>
					<DialogDescription>
						Upload a logo file or provide a URL to an existing logo.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="logo-url">Logo URL</Label>
						<Input
							id="logo-url"
							onChange={(e) => onLogoUrlChange(e.target.value)}
							placeholder="https://example.com/logo.png"
							value={logoUrl}
						/>
						<p className="text-muted-foreground text-xs">
							Or upload a file below
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<Label>Upload File</Label>
						<input
							accept="image/*"
							className="text-sm"
							disabled={isUploading || isSubmitting}
							onChange={(e) => onFileUpload(e.target.files)}
							type="file"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={() => onOpenChange(false)} variant="outline">
						Cancel
					</Button>
					<Button
						disabled={!logoUrl.trim() || isSubmitting}
						onClick={onSubmitUrl}
					>
						{isSubmitting ? "Uploading..." : "Add from URL"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
