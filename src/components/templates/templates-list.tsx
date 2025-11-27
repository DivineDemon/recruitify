"use client";

import { Copy, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createInitialTree } from "@/components/builder/registry";
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog";
import { Button } from "@/components/ui/button";
import WarningModal from "@/components/warning-modal";
import { api } from "@/trpc/react";

interface TemplatesListProps {
	agencyId: string;
}

const TemplatesList = ({ agencyId }: TemplatesListProps) => {
	const router = useRouter();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
	const [, setDuplicateDialogOpen] = useState<string | null>(null);

	const utils = api.useUtils();
	const { data: templates, isLoading } = api.template.list.useQuery({
		agencyId,
		status: "DRAFT" as const,
	});

	const createTemplate = api.template.create.useMutation({
		onSuccess: () => {
			utils.template.list.invalidate();
			setCreateDialogOpen(false);
			router.push("/dashboard/builder");
		},
	});

	const duplicateTemplate = api.template.duplicate.useMutation({
		onSuccess: () => {
			utils.template.list.invalidate();
			setDuplicateDialogOpen(null);
		},
	});

	const archiveTemplate = api.template.archive.useMutation({
		onSuccess: () => {
			utils.template.list.invalidate();
			setDeleteDialogOpen(null);
		},
	});

	const handleCreate = (title: string, description?: string) => {
		createTemplate.mutate({
			agencyId,
			title,
			description,
			pageTree: createInitialTree(),
		});
	};

	const handleDuplicate = (templateId: string) => {
		duplicateTemplate.mutate({ templateId });
	};

	const handleArchive = (templateId: string) => {
		archiveTemplate.mutate({ templateId });
	};

	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-5 p-5">
			<div className="flex w-full items-center justify-between">
				<div className="flex flex-col gap-2.5">
					<h1 className="font-semibold text-[24px] leading-[24px] tracking-tight">
						Templates
					</h1>
					<p className="text-[14px] text-muted-foreground leading-[14px]">
						Create and manage website templates for your recruitment agency.
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => router.push("/dashboard/templates/marketplace")}
						size="default"
						variant="outline"
					>
						Browse Marketplace
					</Button>
					<Button
						onClick={() => router.push("/dashboard/builder")}
						size="default"
					>
						<Plus />
						New Template
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex h-full w-full items-center justify-center">
					<p className="text-muted-foreground text-sm">Loading templates...</p>
				</div>
			) : !templates || templates.length === 0 ? (
				<div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed p-10">
					<p className="text-center text-muted-foreground text-sm">
						No templates yet. Create your first template to get started.
					</p>
					<Button onClick={() => router.push("/dashboard/builder")}>
						<Plus />
						Create Template
					</Button>
				</div>
			) : (
				<div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{templates.map((template) => (
						<div
							className="group relative flex flex-col gap-3 rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
							key={template.id}
						>
							<div className="flex items-start justify-between gap-2">
								<Link
									className="flex-1"
									href={`/dashboard/templates/${template.id}/builder`}
								>
									<h3 className="font-semibold text-base leading-tight hover:underline">
										{template.title}
									</h3>
								</Link>
								<div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
									<Button
										className="h-8 w-8 p-0"
										onClick={() => handleDuplicate(template.id)}
										size="icon"
										title="Duplicate"
										variant="ghost"
									>
										<Copy className="size-4" />
									</Button>
									<Button
										className="h-8 w-8 p-0"
										onClick={() => setDeleteDialogOpen(template.id)}
										size="icon"
										title="Delete"
										variant="ghost"
									>
										<Trash2 className="size-4 text-destructive" />
									</Button>
								</div>
							</div>
							{template.description && (
								<p className="line-clamp-2 text-muted-foreground text-sm">
									{template.description}
								</p>
							)}
							<div className="mt-auto flex items-center justify-between text-muted-foreground text-xs">
								<span>
									Updated {new Date(template.updatedAt).toLocaleDateString()}
								</span>
								<Link href={`/dashboard/templates/${template.id}/builder`}>
									<Button size="sm" variant="outline">
										<Edit className="mr-1 size-3" />
										Edit
									</Button>
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
			<CreateTemplateDialog
				isPending={createTemplate.isPending}
				onCreate={handleCreate}
				onOpenChange={setCreateDialogOpen}
				open={createDialogOpen}
			/>
			{deleteDialogOpen && (
				<WarningModal
					cta={() => {
						handleArchive(deleteDialogOpen);
					}}
					isLoading={archiveTemplate.isPending}
					open={true}
					setOpen={(open) => {
						if (!open) setDeleteDialogOpen(null);
					}}
					text="This will archive the template. You can restore it later if needed."
					title="Archive Template?"
				/>
			)}
		</div>
	);
};

export default TemplatesList;
