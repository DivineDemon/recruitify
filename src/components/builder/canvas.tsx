import { Fragment, type ReactElement, useState } from "react";
import type { BlockDefinition, BuilderNode } from "./types";

interface CanvasProps {
	tree: BuilderNode;
	registry: Record<string, BlockDefinition>;
	selectedId: string | null;
	onSelect: (nodeId: string | null) => void;
	onDropBlock?: (
		blockKey: string,
		targetParentId: string,
		targetIndex?: number,
	) => void;
	onMoveNode?: (
		nodeId: string,
		targetParentId: string,
		targetIndex?: number,
	) => void;
}

export const Canvas = ({
	tree,
	registry,
	selectedId,
	onSelect,
	onDropBlock,
	onMoveNode,
}: CanvasProps) => {
	const [dragOverId, setDragOverId] = useState<string | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
	const renderNode = (
		node: BuilderNode,
		_parent: BuilderNode | null,
		index?: number,
	): ReactElement => {
		if (node.type === "root") {
			const children: ReactElement[] =
				node.children?.map((child, idx) => renderNode(child, node, idx)) ?? [];
			return <>{children}</>;
		}

		const def = registry[node.type];
		const isSelected = node.id === selectedId;
		const allowsDrop = def?.allowsChildren ?? false;

		const children =
			node.children?.map((child, idx) => renderNode(child, node, idx)) ?? null;

		const isDragging = draggedNodeId === node.id;
		const isDragOver = dragOverId === node.id;
		const isDropZoneActive =
			_parent && dragOverId === _parent.id && dragOverIndex === index;

		const DropZone = ({ position }: { position: "before" | "after" }) => {
			if (!_parent) return null;
			const dropIndex = position === "before" ? index : (index ?? 0) + 1;
			const isActive =
				isDropZoneActive ||
				(dragOverId === _parent.id && dragOverIndex === dropIndex);
			return (
				<div
					aria-label="Drop zone"
					className={[
						"-translate-y-1/2 absolute right-0 left-0 z-10 h-2 transition-colors",
						position === "before" ? "top-0" : "bottom-0",
						isActive ? "bg-primary" : "bg-transparent",
					].join(" ")}
					onDragLeave={() => {
						setDragOverIndex(null);
					}}
					onDragOver={(e) => {
						e.preventDefault();
						e.stopPropagation();
						e.dataTransfer.dropEffect = "move";
						setDragOverId(_parent.id);
						setDragOverIndex(dropIndex ?? null);
					}}
					onDrop={(e) => {
						e.preventDefault();
						e.stopPropagation();
						const blockKey = e.dataTransfer.getData("application/block-key");
						const nodeId = e.dataTransfer.getData("application/node-id");

						if (blockKey && onDropBlock) {
							onDropBlock(blockKey, _parent.id, dropIndex);
						} else if (nodeId && onMoveNode && nodeId !== node.id) {
							onMoveNode(nodeId, _parent.id, dropIndex);
						}
						setDragOverId(null);
						setDragOverIndex(null);
						setDraggedNodeId(null);
					}}
					role="application"
				/>
			);
		};

		return (
			<Fragment key={node.id}>
				<fieldset
					className={[
						"group relative rounded-md transition-all",
						"cursor-pointer border-2",
						isSelected
							? "border-primary/50 bg-primary/10 ring-2 ring-primary/20"
							: "border-primary/10 hover:border-primary/30",
						isSelected ? "" : "bg-primary/2 hover:bg-primary/5",
						isDragOver && allowsDrop ? "bg-primary/10" : "",
						isDragging ? "opacity-50" : "",
					].join(" ")}
					draggable={!!_parent}
					onClick={(e) => {
						e.stopPropagation();
						onSelect(node.id);
					}}
					onDragEnd={() => {
						setDraggedNodeId(null);
						setDragOverId(null);
						setDragOverIndex(null);
					}}
					onDragLeave={(e) => {
						if (allowsDrop) {
							e.stopPropagation();
							setDragOverId(null);
						}
					}}
					onDragOver={(e) => {
						if (allowsDrop && (onDropBlock || onMoveNode)) {
							e.preventDefault();
							e.stopPropagation();
							e.dataTransfer.dropEffect = "move";
							setDragOverId(node.id);
							setDragOverIndex(null);
						}
					}}
					onDragStart={(e) => {
						if (_parent) {
							e.dataTransfer.effectAllowed = "move";
							e.dataTransfer.setData("application/node-id", node.id);
							setDraggedNodeId(node.id);
						}
					}}
					onDrop={(e) => {
						if (allowsDrop) {
							e.preventDefault();
							e.stopPropagation();
							const blockKey = e.dataTransfer.getData("application/block-key");
							const nodeId = e.dataTransfer.getData("application/node-id");

							if (blockKey && onDropBlock) {
								onDropBlock(blockKey, node.id);
							} else if (nodeId && onMoveNode && nodeId !== node.id) {
								onMoveNode(nodeId, node.id);
							}
							setDragOverId(null);
							setDragOverIndex(null);
							setDraggedNodeId(null);
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.stopPropagation();
							onSelect(node.id);
						}
					}}
					onMouseDown={(e) => {
						if (
							e.target === e.currentTarget ||
							(e.target as HTMLElement).closest("fieldset") === e.currentTarget
						) {
							e.stopPropagation();
						}
					}}
				>
					{_parent && <DropZone position="before" />}
					{allowsDrop && (
						<>
							{/* biome-ignore lint/a11y/useSemanticElements: Need div for absolute positioning overlay */}
							<div
								aria-label="Select container"
								className="absolute top-0 right-0 left-0 z-20 h-2 cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									onSelect(node.id);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.stopPropagation();
										onSelect(node.id);
									}
								}}
								role="button"
								tabIndex={0}
							/>
							{/* biome-ignore lint/a11y/useSemanticElements: Need div for absolute positioning overlay */}
							<div
								aria-label="Select container"
								className="absolute right-0 bottom-0 left-0 z-20 h-2 cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									onSelect(node.id);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.stopPropagation();
										onSelect(node.id);
									}
								}}
								role="button"
								tabIndex={0}
							/>
							{/* biome-ignore lint/a11y/useSemanticElements: Need div for absolute positioning overlay */}
							<div
								aria-label="Select container"
								className="absolute top-0 bottom-0 left-0 z-20 w-2 cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									onSelect(node.id);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.stopPropagation();
										onSelect(node.id);
									}
								}}
								role="button"
								tabIndex={0}
							/>
							{/* biome-ignore lint/a11y/useSemanticElements: Need div for absolute positioning overlay */}
							<div
								aria-label="Select container"
								className="absolute top-0 right-0 bottom-0 z-20 w-2 cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									onSelect(node.id);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.stopPropagation();
										onSelect(node.id);
									}
								}}
								role="button"
								tabIndex={0}
							/>
						</>
					)}
					{/* biome-ignore lint/a11y/useSemanticElements: Need div wrapper to contain rendered content, cannot use button */}
					<div
						className="relative [&_a]:pointer-events-none [&_button]:pointer-events-none [&_input]:pointer-events-none [&_select]:pointer-events-none [&_textarea]:pointer-events-none"
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							onSelect(node.id);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.stopPropagation();
								e.preventDefault();
								onSelect(node.id);
							}
						}}
						onMouseDown={(e) => {
							e.stopPropagation();
						}}
						role="button"
						tabIndex={0}
					>
						{def ? (
							def.render(node, children, _parent?.type)
						) : (
							<div>Unknown block: {node.type}</div>
						)}
					</div>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 rounded-md border-2 border-primary/5 border-dashed transition-colors group-hover:border-primary/20"
					/>
					{_parent && <DropZone position="after" />}
				</fieldset>
			</Fragment>
		);
	};

	return (
		<fieldset
			className="h-full min-h-[600px] w-full cursor-default overflow-y-auto"
			onClick={() => onSelect(null)}
			onDragLeave={() => {
				setDragOverId(null);
				setDragOverIndex(null);
			}}
			onDragOver={(e) => {
				if (onDropBlock || onMoveNode) {
					e.preventDefault();
					e.dataTransfer.dropEffect = "move";
					setDragOverId(tree.id);
					setDragOverIndex(null);
				}
			}}
			onDrop={(e) => {
				if (onDropBlock || onMoveNode) {
					e.preventDefault();
					const blockKey = e.dataTransfer.getData("application/block-key");
					const nodeId = e.dataTransfer.getData("application/node-id");

					if (blockKey && onDropBlock) {
						onDropBlock(blockKey, tree.id);
					} else if (nodeId && onMoveNode && nodeId !== tree.id) {
						onMoveNode(nodeId, tree.id);
					}
					setDragOverId(null);
					setDragOverIndex(null);
					setDraggedNodeId(null);
				}
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onSelect(null);
				}
			}}
		>
			{tree.type === "root" ? (
				<div
					className={[
						"relative rounded-md transition-colors",
						dragOverId === tree.id && dragOverIndex === null
							? "bg-primary/10"
							: "",
					].join(" ")}
				>
					{tree.children?.map((child, idx) => {
						const DropZone = ({
							position,
						}: {
							position: "before" | "after";
						}) => {
							const dropIndex = position === "before" ? idx : idx + 1;
							const isActive =
								dragOverId === tree.id && dragOverIndex === dropIndex;
							return (
								<div
									aria-label="Drop zone"
									className={[
										"-translate-y-1/2 absolute right-0 left-0 z-10 h-2 transition-colors",
										position === "before" ? "top-0" : "bottom-0",
										isActive ? "bg-primary" : "bg-transparent",
									].join(" ")}
									onDragLeave={() => {
										setDragOverIndex(null);
									}}
									onDragOver={(e) => {
										e.preventDefault();
										e.stopPropagation();
										e.dataTransfer.dropEffect = "move";
										setDragOverId(tree.id);
										setDragOverIndex(dropIndex ?? null);
									}}
									onDrop={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const blockKey = e.dataTransfer.getData(
											"application/block-key",
										);
										const nodeId = e.dataTransfer.getData(
											"application/node-id",
										);

										if (blockKey && onDropBlock) {
											onDropBlock(blockKey, tree.id, dropIndex);
										} else if (nodeId && onMoveNode && nodeId !== child.id) {
											onMoveNode(nodeId, tree.id, dropIndex);
										}
										setDragOverId(null);
										setDragOverIndex(null);
										setDraggedNodeId(null);
									}}
									role="application"
								/>
							);
						};
						return (
							<div className="relative" key={child.id}>
								<DropZone position="before" />
								{renderNode(child, tree, idx)}
								<DropZone position="after" />
							</div>
						);
					})}
					{(!tree.children || tree.children.length === 0) && (
						<div
							className={[
								"flex h-[calc(100vh-104px)] items-center justify-center rounded-md text-muted-foreground text-sm transition-colors",
								dragOverId === tree.id ? "bg-primary/10" : "",
							].join(" ")}
						>
							Drop elements here to get started
						</div>
					)}
				</div>
			) : (
				renderNode(tree, null)
			)}
		</fieldset>
	);
};
