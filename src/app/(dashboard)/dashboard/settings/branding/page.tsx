import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BrandingSettingsClient } from "@/components/branding/branding-settings-client";
import { ACTIVE_AGENCY_COOKIE_NAME } from "@/lib/constants";
import { resolveCurrentUser } from "@/server/auth";
import { $Enums, db } from "@/server/db";

const { AgencyStatus } = $Enums;

const BrandingSettingsPage = async () => {
	const { user } = await resolveCurrentUser();

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

	if (memberships.length === 0) {
		redirect("/dashboard/agencies");
	}

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

	if (!activeMembership) {
		redirect("/dashboard/agencies");
	}

	return <BrandingSettingsClient agencyId={activeMembership.agency.id} />;
};

export default BrandingSettingsPage;
