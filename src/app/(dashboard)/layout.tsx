import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AppSidebar from "@/components/layout/app-sidebar";
import Navbar from "@/components/layout/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ACTIVE_AGENCY_COOKIE_NAME } from "@/lib/constants";
import { resolveCurrentUser } from "@/server/auth";
import { $Enums, db } from "@/server/db";

const { AgencyStatus } = $Enums;

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const { user, kindeUser } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const memberships = await db.agencyMember.findMany({
		where: {
			userId: user.id,
			agency: {
				status: AgencyStatus.ACTIVE,
			},
		},
		include: { agency: true },
		orderBy: { createdAt: "asc" },
	});

	const cookieStore = await cookies();
	const cookieActiveAgencyId =
		cookieStore.get(ACTIVE_AGENCY_COOKIE_NAME)?.value ?? null;

	const activeMembership =
		memberships.find(
			(membership) => membership.agency.id === cookieActiveAgencyId,
		) ??
		memberships.find(
			(membership) => membership.agency.id === user.activeAgencyId,
		) ??
		memberships[0] ??
		null;

	const displayName =
		kindeUser?.given_name && kindeUser.family_name
			? `${kindeUser.given_name} ${kindeUser.family_name}`.trim()
			: (kindeUser?.email ?? user.email);

	return (
		<SidebarProvider>
			<div className="flex h-screen w-full items-start justify-start">
				<AppSidebar
					activeAgencyName={activeMembership?.agency.displayName ?? null}
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
