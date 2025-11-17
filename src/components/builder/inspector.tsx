import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlockDefinition, BuilderNode } from "./types";

interface InspectorProps {
	node: BuilderNode | null;
	registry: Record<string, BlockDefinition>;
	onUpdate: (nodeId: string, newProps: Record<string, unknown>) => void;
	onRemove?: (nodeId: string) => void;
	onClose?: () => void;
	isRootNode?: boolean;
}

export const Inspector = ({
	node,
	registry,
	onUpdate,
	onRemove,
	onClose,
	isRootNode = false,
}: InspectorProps) => {
	if (!node) {
		return (
			<div className="w-full p-2.5 text-center text-muted-foreground text-sm">
				Select an element to edit its properties.
			</div>
		);
	}

	const def = registry[node.type];
	if (!def) {
		return (
			<div className="w-full p-2.5 text-center text-muted-foreground text-sm">
				No inspector available for "{node.type}".
			</div>
		);
	}

	return (
		<div className="w-full space-y-2.5 p-2.5">
			<div className="flex items-center gap-2">
				{onClose && (
					<Button
						className="h-8 w-8 p-0"
						onClick={onClose}
						size="icon"
						type="button"
						variant="ghost"
					>
						<ArrowLeft className="size-4" />
					</Button>
				)}
				<h3 className="flex-1 font-semibold text-sm">{def.label}</h3>
				{!isRootNode && onRemove ? (
					<Button
						className="h-8 w-8 p-0"
						onClick={() => onRemove(node.id)}
						size="icon"
						title="Delete element"
						type="button"
						variant="destructive"
					>
						<Trash2 className="size-4" />
					</Button>
				) : null}
			</div>
			<def.inspector
				node={node}
				update={(props) => onUpdate(node.id, { ...node.props, ...props })}
			/>
		</div>
	);
};
