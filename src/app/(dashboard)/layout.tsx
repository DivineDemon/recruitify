import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { resolveCurrentUser } from "@/server/auth";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const { user, kindeUser } = await resolveCurrentUser();

	if (!user) {
		redirect("/auth/callback");
	}

	const displayName =
		kindeUser?.given_name && kindeUser.family_name
			? `${kindeUser.given_name} ${kindeUser.family_name}`.trim()
			: (kindeUser?.email ?? user.email);

	return (
		<div className="min-h-screen w-full bg-background">
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
				<header className="flex items-center justify-between border-b pb-4">
					<h1 className="font-semibold text-2xl">Recruitify Dashboard</h1>
					<p className="text-muted-foreground text-sm">{displayName}</p>
				</header>
				<main>{children}</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
