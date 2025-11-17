import type { ReactElement } from "react";

export type BuilderNode = {
	id: string;
	type: string;
	props: Record<string, unknown>;
	children?: BuilderNode[];
};

export type BlockDefinition = {
	key: string;
	label: string;
	category: "layout" | "content" | "form" | "jobs";
	create: () => BuilderNode;
	render: (
		node: BuilderNode,
		children?: ReactElement | ReactElement[] | null,
		parentType?: string,
	) => ReactElement;
	inspector: (args: {
		node: BuilderNode;
		update: (props: Record<string, unknown>) => void;
	}) => ReactElement;
	allowsChildren?: boolean;
};

export type BuilderTree = {
	root: BuilderNode;
};

export type SelectionState = {
	selectedId: string | null;
};
