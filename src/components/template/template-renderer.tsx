"use client";

import { Fragment, type ReactElement } from "react";
import { BLOCKS } from "@/components/builder/registry";
import type { BlockDefinition, BuilderNode } from "@/components/builder/types";

interface TemplateRendererProps {
	tree: BuilderNode;
	registry?: Record<string, BlockDefinition>;
}

/**
 * Renders a template's pageTree using the block registry.
 * This is a simplified version of Canvas without builder-specific UI.
 */
export function TemplateRenderer({
	tree,
	registry = BLOCKS,
}: TemplateRendererProps) {
	const renderNode = (
		node: BuilderNode,
		_parent: BuilderNode | null,
	): ReactElement => {
		if (node.type === "root") {
			const children: ReactElement[] =
				node.children?.map((child) => renderNode(child, node)) ?? [];
			return <>{children}</>;
		}

		const def = registry[node.type];
		const children =
			node.children?.map((child) => renderNode(child, node)) ?? null;

		return (
			<Fragment key={node.id}>
				{def ? (
					def.render(node, children, _parent?.type)
				) : (
					<div>Unknown block: {node.type}</div>
				)}
			</Fragment>
		);
	};

	if (tree.type === "root") {
		return (
			<div>
				{tree.children?.map((child) => renderNode(child, tree))}
				{(!tree.children || tree.children.length === 0) && (
					<div className="flex min-h-[400px] items-center justify-center text-muted-foreground text-sm">
						No content available
					</div>
				)}
			</div>
		);
	}

	return renderNode(tree, null);
}
