"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

interface EditTemplateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (title: string, description: string | null) => void;
	isPending?: boolean;
	initialTitle?: string;
	initialDescription?: string;
}

export const EditTemplateDialog = ({
	open,
	onOpenChange,
	onSave,
	isPending = false,
	initialTitle = "",
	initialDescription = "",
}: EditTemplateDialogProps) => {
	const [title, setTitle] = useState(initialTitle);
	const [description, setDescription] = useState(initialDescription);

	// Update fields when dialog opens or initial values change
	useEffect(() => {
		if (open) {
			setTitle(initialTitle);
			setDescription(initialDescription);
		}
	}, [open, initialTitle, initialDescription]);

	const handleSave = () => {
		if (!title.trim()) return;
		onSave(title.trim(), description.trim() || null);
	};

	const handleCancel = () => {
		onOpenChange(false);
		setTitle(initialTitle);
		setDescription(initialDescription);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Template</DialogTitle>
					<DialogDescription>
						Update your template name and description.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="edit-template-title">Title *</Label>
						<Input
							id="edit-template-title"
							onChange={(e) => setTitle(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && title.trim() && !isPending) {
									handleSave();
								}
							}}
							placeholder="My Recruitment Template"
							value={title}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="edit-template-description">Description</Label>
						<Textarea
							id="edit-template-description"
							onChange={(e) => setDescription(e.target.value)}
							placeholder="A template for showcasing open positions..."
							rows={3}
							value={description}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleCancel} variant="outline">
						Cancel
					</Button>
					<Button disabled={!title.trim() || isPending} onClick={handleSave}>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
