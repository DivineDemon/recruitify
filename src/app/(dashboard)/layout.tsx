import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AppSidebar from "@/components/layout/app-sidebar";
import Navbar from "@/components/layout/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
		<SidebarProvider>
			<div className="flex h-screen w-full items-start justify-start">
				<AppSidebar
					avatar={user.imageUrl ?? ""}
					displayName={displayName ?? ""}
				/>
				<div className="flex h-full w-[calc(100vw-256px)] flex-col items-start justify-start overflow-hidden">
					<Navbar />
					<main className="h-[calc(100vh-64px)] w-full overflow-hidden">
						{children}
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default DashboardLayout;
