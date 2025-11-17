/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { nanoid } from "nanoid";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@/components/builder/canvas";
import { Inspector } from "@/components/builder/inspector";
import { Palette } from "@/components/builder/palette";
import {
	BLOCKS,
	createInitialTree,
	PALETTE,
} from "@/components/builder/registry";
import type { BuilderNode } from "@/components/builder/types";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "recruitify:builder:draft";

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

const _moveNode = (
	node: BuilderNode,
	id: string,
	direction: "up" | "down",
): BuilderNode => {
	const children = node.children ?? [];
	const index = children.findIndex((c) => c.id === id);
	if (index !== -1) {
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= children.length) {
			return node;
		}
		const copy = [...children];
		const item = copy[index];
		if (!item) {
			return node;
		}
		copy.splice(index, 1);
		copy.splice(targetIndex, 0, item);
		return { ...node, children: copy };
	}
	return {
		...node,
		children: children.map((c) => _moveNode(c, id, direction)),
	};
};

const BuilderPage = () => {
	const { resolvedTheme } = useTheme();
	const gridColor =
		resolvedTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";

	const [tree, setTree] = useState<BuilderNode>(() => {
		if (typeof window === "undefined") return createInitialTree();
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			return raw ? (JSON.parse(raw) as BuilderNode) : createInitialTree();
		} catch {
			return createInitialTree();
		}
	});
	const [selectedId, setSelectedId] = useState<string | null>(null);

	useEffect(() => {
		const id = setTimeout(() => {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
		}, 600);
		return () => clearTimeout(id);
	}, [tree]);

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

	return (
		<div
			className="flex h-full w-full items-start justify-start"
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
				<div className="mt-auto flex w-full items-center justify-end gap-2.5 border-t p-2.5">
					<Button
						className="w-[calc(50%-5px)]"
						onClick={() => {
							setTree(createInitialTree());
							setSelectedId(null);
						}}
						type="button"
						variant="destructive"
					>
						Reset
					</Button>
					<Button
						className="w-[calc(50%-5px)]"
						onClick={() => {
							window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
						}}
						type="button"
					>
						Save draft
					</Button>
				</div>
			</div>
		</div>
	);
};

export default BuilderPage;
