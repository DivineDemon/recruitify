"use client";

import { useEffect, useState } from "react";
import { BuilderContainer } from "@/components/builder/builder-container";
import { createInitialTree } from "@/components/builder/registry";
import type { BuilderNode } from "@/components/builder/types";

const STORAGE_KEY = "recruitify:builder:draft";

interface BuilderPageClientProps {
	agencyId: string;
}

const BuilderPageClient = ({ agencyId }: BuilderPageClientProps) => {
	const [tree, setTree] = useState<BuilderNode | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") {
			setTree(createInitialTree());
			return;
		}
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			setTree(raw ? (JSON.parse(raw) as BuilderNode) : createInitialTree());
		} catch {
			setTree(createInitialTree());
		}
	}, []);

	useEffect(() => {
		if (!tree) return;
		const timeoutId = setTimeout(() => {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
		}, 600);
		return () => clearTimeout(timeoutId);
	}, [tree]);

	const handleTreeChange = (newTree: BuilderNode) => {
		setTree(newTree);
	};

	const handleReset = () => {
		const newTree = createInitialTree();
		setTree(newTree);
		window.localStorage.removeItem(STORAGE_KEY);
	};

	if (tree === null) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-muted-foreground text-sm">Loading builder...</p>
			</div>
		);
	}

	return (
		<BuilderContainer
			agencyId={agencyId}
			initialTree={tree}
			onReset={handleReset}
			onTreeChange={handleTreeChange}
			showSaveButton={true}
		/>
	);
};

export default BuilderPageClient;
