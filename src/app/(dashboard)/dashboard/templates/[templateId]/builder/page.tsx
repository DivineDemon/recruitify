"use client";

import { use, useEffect, useRef, useState } from "react";
import { BuilderContainer } from "@/components/builder/builder-container";
import { createInitialTree } from "@/components/builder/registry";
import type { BuilderNode } from "@/components/builder/types";
import { api } from "@/trpc/react";

interface TemplateBuilderPageProps {
	params: Promise<{ templateId: string }>;
}

const normalizeTree = (pageTree: unknown): BuilderNode => {
	if (!pageTree || typeof pageTree !== "object") {
		return createInitialTree();
	}

	if ("id" in pageTree && "type" in pageTree && "props" in pageTree) {
		return pageTree as BuilderNode;
	}

	if ("version" in pageTree && "nodes" in pageTree) {
		return createInitialTree();
	}

	return createInitialTree();
};

const TemplateBuilderPage = ({ params }: TemplateBuilderPageProps) => {
	const { templateId } = use(params);
	const [tree, setTree] = useState<BuilderNode | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const isInitialLoadRef = useRef(true);

	const { data: template, isLoading } = api.template.get.useQuery({
		templateId,
	});

	const utils = api.useUtils();
	const updatePageTree = api.template.updatePageTree.useMutation({
		onSuccess: () => {
			if (!isInitialLoadRef.current) {
				utils.template.get.invalidate({ templateId });
			}
			setHasUnsavedChanges(false);
		},
	});

	const handleSave = () => {
		setHasUnsavedChanges(false);
	};

	useEffect(() => {
		if (template?.pageTree) {
			isInitialLoadRef.current = true;
			const normalized = normalizeTree(template.pageTree);
			setTree(normalized);
			setHasUnsavedChanges(false);
			setTimeout(() => {
				isInitialLoadRef.current = false;
			}, 100);
		}
	}, [template]);

	useEffect(() => {
		if (!tree || !hasUnsavedChanges || isInitialLoadRef.current) return;

		const timeoutId = setTimeout(() => {
			updatePageTree.mutate({
				templateId,
				pageTree: tree,
			});
		}, 2000);

		return () => clearTimeout(timeoutId);
	}, [tree, hasUnsavedChanges, templateId, updatePageTree]);

	const handleTreeChange = (newTree: BuilderNode) => {
		if (!isInitialLoadRef.current) {
			setTree(newTree);
			setHasUnsavedChanges(true);
		} else {
			setTree(newTree);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-muted-foreground text-sm">Loading template...</p>
			</div>
		);
	}

	if (!template) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-muted-foreground text-sm">Template not found</p>
			</div>
		);
	}

	if (tree === null) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-muted-foreground text-sm">Initializing builder...</p>
			</div>
		);
	}

	return (
		<BuilderContainer
			hasUnsavedChanges={hasUnsavedChanges}
			initialTree={tree}
			isSaving={updatePageTree.isPending}
			onSave={handleSave}
			onTreeChange={handleTreeChange}
			showSaveButton={true}
			templateDescription={template.description ?? undefined}
			templateId={templateId}
			templateTitle={template.title}
		/>
	);
};

export default TemplateBuilderPage;
