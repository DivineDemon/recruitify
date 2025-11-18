"use client";

import { useState } from "react";
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

interface CreateTemplateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreate: (title: string, description?: string) => void;
	isPending?: boolean;
}

export const CreateTemplateDialog = ({
	open,
	onOpenChange,
	onCreate,
	isPending = false,
}: CreateTemplateDialogProps) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleCreate = () => {
		if (!title.trim()) return;
		onCreate(title.trim(), description.trim() || undefined);
		setTitle("");
		setDescription("");
	};

	const handleCancel = () => {
		onOpenChange(false);
		setTitle("");
		setDescription("");
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Template</DialogTitle>
					<DialogDescription>
						Give your template a name and optional description to get started.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							onChange={(e) => setTitle(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && title.trim() && !isPending) {
									handleCreate();
								}
							}}
							placeholder="My Recruitment Template"
							value={title}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
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
					<Button disabled={!title.trim() || isPending} onClick={handleCreate}>
						{isPending ? "Creating..." : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
