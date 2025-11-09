import type { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen w-full bg-background">
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
				<header className="flex items-center justify-between border-b pb-4">
					<h1 className="font-semibold text-2xl">
						Recruitify Dashboard (Placeholder)
					</h1>
				</header>
				<main>{children}</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
