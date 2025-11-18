/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Loader2, Pencil } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@/components/builder/canvas";
import { Inspector } from "@/components/builder/inspector";
import { Palette } from "@/components/builder/palette";
import {
	BLOCKS,
	createInitialTree,
	PALETTE,
} from "@/components/builder/registry";
import type { BuilderNode } from "@/components/builder/types";
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog";
import { EditTemplateDialog } from "@/components/templates/edit-template-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

const findNode = (node: BuilderNode, id: string): BuilderNode | null => {
	if (node.id === id) return node;
	for (const child of node.children ?? []) {
		const found = findNode(child, id);
		if (found) return found;
	}
	return null;
};

const updateNodeProps = (
	node: BuilderNode,
	id: string,
	newProps: Record<string, unknown>,
): BuilderNode => {
	if (node.id === id) {
		return { ...node, props: newProps };
	}
	return {
		...node,
		children: node.children?.map((c) => updateNodeProps(c, id, newProps)),
	};
};

const insertChild = (
	node: BuilderNode,
	parentId: string,
	child: BuilderNode,
	index?: number,
): BuilderNode => {
	if (node.id === parentId) {
		const children = node.children ?? [];
		const nextChildren =
			index !== undefined
				? [...children.slice(0, index), child, ...children.slice(index)]
				: [...children, child];
		return { ...node, children: nextChildren };
	}
	return {
		...node,
		children: node.children?.map((c) => insertChild(c, parentId, child, index)),
	};
};

const removeNode = (node: BuilderNode, id: string): BuilderNode => {
	return {
		...node,
		children: (node.children ?? [])
			.filter((c) => c.id !== id)
			.map((c) => removeNode(c, id)),
	};
};

const moveNode = (
	node: BuilderNode,
	nodeId: string,
	targetParentId: string,
	targetIndex?: number,
): BuilderNode | null => {
	const findAndExtract = (
		parent: BuilderNode,
		id: string,
	): { node: BuilderNode; parent: BuilderNode; index: number } | null => {
		if (parent.children) {
			const index = parent.children.findIndex((c) => c.id === id);
			if (index !== -1) {
				const node = parent.children[index];
				if (node) {
					return { node, parent, index };
				}
			}
			for (const child of parent.children) {
				const found = findAndExtract(child, id);
				if (found) return found;
			}
		}
		return null;
	};

	const extracted = findAndExtract(node, nodeId);
	if (!extracted) return null;

	const removeFromParent = (n: BuilderNode): BuilderNode => {
		if (n.id === extracted.parent.id) {
			return {
				...n,
				children: n.children?.filter((c) => c.id !== nodeId) ?? [],
			};
		}
		return {
			...n,
			children: n.children?.map(removeFromParent),
		};
	};

	const treeWithoutNode = removeFromParent(node);
	const targetParent = findNode(treeWithoutNode, targetParentId);
	if (!targetParent) return null;

	let adjustedIndex = targetIndex;
	if (extracted.parent.id === targetParentId && targetIndex !== undefined) {
		if (extracted.index < targetIndex) {
			adjustedIndex = targetIndex - 1;
		}
	}

	return insertChild(
		treeWithoutNode,
		targetParentId,
		extracted.node,
		adjustedIndex,
	);
};

interface BuilderContainerProps {
	initialTree?: BuilderNode;
	onSave?: (tree: BuilderNode) => void | Promise<void>;
	onTreeChange?: (tree: BuilderNode) => void;
	onReset?: () => void;
	showSaveButton?: boolean;
	templateId?: string;
	agencyId?: string;
	templateTitle?: string;
	templateDescription?: string;
	onTemplateMetadataChange?: (
		title: string,
		description: string | null,
	) => void;
	hasUnsavedChanges?: boolean;
	isSaving?: boolean;
}

export const BuilderContainer = ({
	initialTree,
	onSave,
	onTreeChange,
	onReset,
	showSaveButton = true,
	templateId,
	agencyId,
	templateTitle: propTemplateTitle,
	templateDescription: propTemplateDescription,
	onTemplateMetadataChange,
	hasUnsavedChanges = false,
	isSaving = false,
}: BuilderContainerProps) => {
	const router = useRouter();
	const { resolvedTheme } = useTheme();
	const gridColor =
		resolvedTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";

	const [tree, setTree] = useState<BuilderNode>(
		() => initialTree ?? createInitialTree(),
	);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);
	const [editMetadataDialogOpen, setEditMetadataDialogOpen] = useState(false);
	const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

	const utils = api.useUtils();
	const createTemplate = api.template.create.useMutation({
		onSuccess: () => {
			utils.template.list.invalidate();
			setSaveDialogOpen(false);
			router.push("/dashboard/templates");
		},
	});

	const updateMetadata = api.template.updateMetadata.useMutation({
		onSuccess: (template) => {
			if (templateId) {
				utils.template.get.invalidate({ templateId });
				utils.template.list.invalidate();
			}
			setEditMetadataDialogOpen(false);
			setLastSavedAt(new Date());
			if (onTemplateMetadataChange) {
				onTemplateMetadataChange(template.title, template.description);
			}
		},
	});

	const updatePageTree = api.template.updatePageTree.useMutation({
		onSuccess: () => {
			if (templateId) {
				utils.template.get.invalidate({ templateId });
				utils.template.list.invalidate();
			}
			setLastSavedAt(new Date());
			if (onSave) {
				onSave(tree);
			}
		},
	});

	const isInitialLoadRef = useRef(true);
	const prevInitialTreeRef = useRef<BuilderNode | undefined>(initialTree);

	useEffect(() => {
		if (initialTree && initialTree !== prevInitialTreeRef.current) {
			isInitialLoadRef.current = true;
			prevInitialTreeRef.current = initialTree;
			setTree(initialTree);
		}
	}, [initialTree]);

	useEffect(() => {
		if (isInitialLoadRef.current) {
			isInitialLoadRef.current = false;
			return;
		}

		if (onTreeChange) {
			onTreeChange(tree);
		}
	}, [tree, onTreeChange]);

	const selectedNode = useMemo(
		() => (selectedId ? findNode(tree, selectedId) : null),
		[tree, selectedId],
	);

	const handleDropBlock = (
		blockKey: string,
		targetParentId: string,
		targetIndex?: number,
	) => {
		const block = PALETTE.find((b) => b.key === blockKey);
		if (!block) return;
		const newNode = { ...block.create(), id: nanoid() };
		setTree((prev) => insertChild(prev, targetParentId, newNode, targetIndex));
		setSelectedId(newNode.id);
	};

	const handleMoveNode = (
		nodeId: string,
		targetParentId: string,
		targetIndex?: number,
	) => {
		const isDescendant = (node: BuilderNode, ancestorId: string): boolean => {
			if (node.id === ancestorId) return true;
			return (
				node.children?.some((child) => isDescendant(child, ancestorId)) ?? false
			);
		};

		const targetNode = findNode(tree, targetParentId);
		if (!targetNode) return;

		if (isDescendant(targetNode, nodeId)) {
			return;
		}

		setTree((prev) => {
			const newTree = moveNode(prev, nodeId, targetParentId, targetIndex);
			return newTree ?? prev;
		});
	};

	const handleSave = () => {
		if (templateId) {
			updatePageTree.mutate({
				templateId,
				pageTree: tree,
			});
			return;
		}

		if (agencyId) {
			setSaveDialogOpen(true);
			return;
		}

		if (onSave) {
			onSave(tree);
		}
	};

	const handleCreateTemplate = (title: string, description?: string) => {
		if (!agencyId) return;
		createTemplate.mutate({
			agencyId,
			title,
			description,
			pageTree: tree,
		});
	};

	const handleSaveMetadata = (title: string, description: string | null) => {
		if (!templateId) return;
		updateMetadata.mutate({
			templateId,
			title,
			description,
		});
	};

	const handleOpenEditDialog = () => {
		setEditMetadataDialogOpen(true);
	};

	const handleReset = () => {
		const newTree = createInitialTree();
		setTree(newTree);
		setSelectedId(null);
		if (onReset) {
			onReset();
		}
	};

	return (
		<div className="flex h-full w-full flex-col">
			<div
				className="flex h-full w-full flex-1 items-start justify-start"
				style={{
					backgroundImage: `
          repeating-linear-gradient(0deg, ${gridColor} 0px 1px, transparent 1px 40px),
          repeating-linear-gradient(90deg, ${gridColor} 0px 1px, transparent 1px 40px)
        `,
				}}
			>
				<div className="h-full flex-1 p-5">
					<Canvas
						onDropBlock={handleDropBlock}
						onMoveNode={handleMoveNode}
						onSelect={setSelectedId}
						registry={BLOCKS}
						selectedId={selectedId}
						tree={tree}
					/>
				</div>
				<div className="flex h-full w-[300px] flex-col items-start justify-start border-l bg-sidebar">
					<div
						className="flex h-[calc(100vh-121px)] w-full flex-col items-start justify-start overflow-y-auto"
						id="options"
					>
						{selectedNode ? (
							<Inspector
								isRootNode={selectedNode.type === "root"}
								node={selectedNode}
								onClose={() => setSelectedId(null)}
								onRemove={(id) => {
									setTree((prev) => removeNode(prev, id));
									if (selectedId === id) setSelectedId(null);
								}}
								onUpdate={(nodeId, newProps) =>
									setTree((prev) => updateNodeProps(prev, nodeId, newProps))
								}
								registry={BLOCKS}
							/>
						) : (
							<Palette blocks={PALETTE} />
						)}
					</div>
					{showSaveButton && (
						<div className="mt-auto flex w-full flex-col gap-2 border-t p-2.5">
							{templateId ? (
								<div className="flex w-full flex-col items-start justify-start gap-2.5">
									<div className="flex w-full items-center justify-center gap-2.5">
										<span className="w-full truncate text-left text-[14px] text-muted-foreground leading-[14px]">
											{propTemplateTitle}
										</span>
										<span className="w-full text-right text-[14px] text-muted-foreground leading-[14px]">
											{hasUnsavedChanges && !isSaving && (
												<span className="whitespace-nowrap text-muted-foreground text-xs">
													(Unsaved)
												</span>
											)}
											{isSaving && (
												<div className="flex items-center justify-end gap-2">
													<Loader2 className="size-3.5 animate-spin" />
													<span className="whitespace-nowrap text-muted-foreground text-xs">
														Saving...
													</span>
												</div>
											)}
											{!hasUnsavedChanges &&
												!isSaving &&
												lastSavedAt &&
												templateId && (
													<span className="whitespace-nowrap text-muted-foreground text-xs">
														Saved
													</span>
												)}
										</span>
									</div>
									<Button
										className="w-full"
										onClick={handleOpenEditDialog}
										size="sm"
										type="button"
										variant="outline"
									>
										<Pencil className="mr-2 size-3.5" />
										Edit Template Info
									</Button>
								</div>
							) : (
								<div className="flex w-full items-center justify-end gap-2.5">
									<Button
										className="w-[calc(50%-5px)]"
										onClick={handleReset}
										type="button"
										variant="destructive"
									>
										Reset
									</Button>
									<Button
										className="w-[calc(50%-5px)]"
										disabled={createTemplate.isPending}
										onClick={handleSave}
										type="button"
									>
										{createTemplate.isPending ? "Creating..." : "Save"}
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
			{!templateId && agencyId && (
				<CreateTemplateDialog
					isPending={createTemplate.isPending}
					onCreate={handleCreateTemplate}
					onOpenChange={setSaveDialogOpen}
					open={saveDialogOpen}
				/>
			)}
			{templateId && (
				<EditTemplateDialog
					initialDescription={propTemplateDescription ?? ""}
					initialTitle={propTemplateTitle ?? ""}
					isPending={updateMetadata.isPending}
					onOpenChange={setEditMetadataDialogOpen}
					onSave={handleSaveMetadata}
					open={editMetadataDialogOpen}
				/>
			)}
		</div>
	);
};
