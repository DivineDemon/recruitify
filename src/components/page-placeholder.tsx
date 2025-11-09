import type { ReactNode } from "react";

interface PagePlaceholderProps {
	title: string;
	description?: string;
	actions?: ReactNode;
}

export const PagePlaceholder = ({
	title,
	description,
	actions,
}: PagePlaceholderProps) => {
	return (
		<div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 text-center">
			<h1 className="font-semibold text-3xl">{title}</h1>
			{description ? (
				<p className="max-w-xl text-muted-foreground text-sm">{description}</p>
			) : null}
			{actions}
		</div>
	);
};
