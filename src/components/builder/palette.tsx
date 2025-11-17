import {
	AlignLeft,
	Badge,
	Briefcase,
	CheckSquare,
	ChevronDown,
	Columns,
	Container as ContainerIcon,
	Copyright,
	FileText,
	Heading1,
	Image as ImageIcon,
	Layout,
	Link as LinkIcon,
	List,
	Megaphone,
	Minus,
	MousePointerClick,
	Play,
	Quote,
	Radio,
	Rows,
	SeparatorHorizontal,
	Sparkles,
	Type,
	Users,
	Zap,
} from "lucide-react";
import type { BlockDefinition } from "./types";

interface PaletteProps {
	blocks: BlockDefinition[];
}

const blockIcons: Record<string, typeof Layout> = {
	section: Layout,
	container: ContainerIcon,
	"flex-row": Rows,
	"column-stack": Columns,
	spacer: Minus,
	heading: Heading1,
	text: AlignLeft,
	button: MousePointerClick,
	image: ImageIcon,
	link: LinkIcon,
	list: List,
	quote: Quote,
	badge: Badge,
	divider: SeparatorHorizontal,
	"rich-text": Type,
	video: Play,
	icon: Sparkles,
	input: FileText,
	textarea: FileText,
	select: ChevronDown,
	checkbox: CheckSquare,
	radio: Radio,
	"form-container": FileText,
	hero: Zap,
	features: Sparkles,
	testimonials: Users,
	cta: Megaphone,
	footer: Copyright,
	"job-list": Briefcase,
	"job-card": Briefcase,
	"application-form": FileText,
};

export const Palette = ({ blocks }: PaletteProps) => {
	return (
		<div className="w-full space-y-2.5 p-2.5">
			<h3 className="w-full text-left font-medium text-muted-foreground text-xs uppercase">
				Blocks
			</h3>
			<div className="grid w-full grid-cols-3 gap-2.5">
				{blocks.map((b) => {
					const Icon = blockIcons[b.key] ?? Layout;
					return (
						<button
							className="group flex aspect-square w-full flex-col items-center justify-center gap-2 rounded border bg-card p-2.5 text-sm transition-colors hover:bg-accent"
							draggable
							key={b.key}
							onDragStart={(e) => {
								e.dataTransfer.effectAllowed = "move";
								e.dataTransfer.setData("application/block-key", b.key);
							}}
							type="button"
						>
							<Icon className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
							<span className="text-xs">{b.label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};
