import { randomUUID } from "node:crypto";
import { ShieldX } from "lucide-react";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AgencyCard from "@/components/agencies/agency-card";
import CreateAgencyForm from "@/components/agencies/create-agency-form";
import {
	ACTIVE_AGENCY_COOKIE_MAX_AGE,
	ACTIVE_AGENCY_COOKIE_NAME,
} from "@/lib/constants";
import {
	type ArchiveAgencyFormValues,
	archiveAgencySchema,
	type CreateAgencyFormValues,
	createAgencySchema,
	type SwitchAgencyFormValues,
	switchAgencySchema,
	type UpdateAgencyFormValues,
	updateAgencySchema,
} from "@/lib/validations/agency";
import { resolveCurrentUser } from "@/server/auth";
import { $Enums, db } from "@/server/db";

const { AgencyRole, AgencyStatus, SubscriptionPlan, SubscriptionStatus } =
	$Enums;

const persistActiveAgencyCookie = async (agencyId: string) => {
	const cookieStore = await cookies();
	cookieStore.set({
		name: ACTIVE_AGENCY_COOKIE_NAME,
		value: agencyId,
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: ACTIVE_AGENCY_COOKIE_MAX_AGE,
	});
};

const clearActiveAgencyCookie = async () => {
	const cookieStore = await cookies();
	cookieStore.delete(ACTIVE_AGENCY_COOKIE_NAME);
};

const createAgency = async (
	values: CreateAgencyFormValues,
): Promise<{ success?: boolean; error?: string }> => {
	"use server";

	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const parsed = createAgencySchema.parse(values);

	const now = new Date();
	const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

	try {
		const agency = await db.$transaction(async (tx) => {
			const agency = await tx.agency.create({
				data: {
					slug: parsed.slug,
					displayName: parsed.displayName,
					description:
						parsed.description && parsed.description.trim().length > 0
							? parsed.description.trim()
							: null,
					members: {
						create: {
							userId: user.id,
							role: AgencyRole.OWNER,
							invitedAt: now,
							acceptedAt: now,
						},
					},
				},
			});

			await tx.user.update({
				where: { id: user.id },
				data: { activeAgencyId: agency.id },
			});

			await tx.subscription.create({
				data: {
					agencyId: agency.id,
					stripeCustomerId: `pending_${randomUUID()}`,
					plan: SubscriptionPlan.BASIC,
					status: SubscriptionStatus.TRIALING,
					trialEndsAt,
					currentPeriodEnd: trialEndsAt,
					metadata: {
						initializedVia: "dashboard",
					},
				},
			});

			return agency;
		});

		await persistActiveAgencyCookie(agency.id);
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code?: string }).code === "P2002"
		) {
			return {
				error: "That slug is already in use. Choose another one.",
			};
		}

		throw error;
	}

	revalidatePath("/dashboard/agencies");
	revalidatePath("/dashboard");

	return { success: true };
};

const updateAgency = async (
	values: UpdateAgencyFormValues,
): Promise<{ success?: boolean; error?: string }> => {
	"use server";

	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const parsed = updateAgencySchema.parse(values);

	const membership = await db.agencyMember.findFirst({
		where: {
			agencyId: parsed.agencyId,
			userId: user.id,
		},
	});

	if (!membership || membership.role !== AgencyRole.OWNER) {
		return {
			error: "Only owners can update agency details.",
		};
	}

	const sanitizedDescription =
		parsed.description && parsed.description.trim().length > 0
			? parsed.description.trim()
			: null;

	try {
		await db.agency.update({
			where: { id: parsed.agencyId },
			data: {
				displayName: parsed.displayName.trim(),
				slug: parsed.slug.trim(),
				description: sanitizedDescription,
			},
		});
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code?: string }).code === "P2002"
		) {
			return {
				error: "That slug is already in use. Choose another one.",
			};
		}

		throw error;
	}

	revalidatePath("/dashboard/agencies");

	return { success: true };
};

const archiveAgency = async (
	values: ArchiveAgencyFormValues,
): Promise<{ success?: boolean; error?: string }> => {
	"use server";

	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const parsed = archiveAgencySchema.parse(values);

	const membership = await db.agencyMember.findFirst({
		where: {
			agencyId: parsed.agencyId,
			userId: user.id,
		},
	});

	if (!membership || membership.role !== AgencyRole.OWNER) {
		return {
			error: "Only owners can archive an agency.",
		};
	}

	await db.agency.update({
		where: { id: parsed.agencyId },
		data: {
			status: AgencyStatus.ARCHIVED,
			archivedAt: new Date(),
		},
	});

	if (user.activeAgencyId === parsed.agencyId) {
		await db.user.update({
			where: { id: user.id },
			data: { activeAgencyId: null },
		});
		await clearActiveAgencyCookie();
	}

	revalidatePath("/dashboard");

	revalidatePath("/dashboard/agencies");

	return { success: true };
};

const switchAgency = async (
	values: SwitchAgencyFormValues,
): Promise<{ success?: boolean; error?: string }> => {
	"use server";

	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const parsed = switchAgencySchema.parse(values);

	const membership = await db.agencyMember.findFirst({
		where: {
			agencyId: parsed.agencyId,
			userId: user.id,
			agency: {
				status: AgencyStatus.ACTIVE,
			},
		},
		include: { agency: true },
	});

	if (!membership) {
		return { error: "You no longer have access to that workspace." };
	}

	if (user.activeAgencyId !== membership.agency.id) {
		await db.user.update({
			where: { id: user.id },
			data: { activeAgencyId: membership.agency.id },
		});
	}

	await persistActiveAgencyCookie(membership.agency.id);

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/agencies");

	return { success: true };
};

const AgenciesPage = async () => {
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

	const hasMemberships = memberships.length > 0;
	const cookieStore = await cookies();
	const cookieActiveAgencyId =
		cookieStore.get(ACTIVE_AGENCY_COOKIE_NAME)?.value ?? null;

	const activeMembership = hasMemberships
		? (memberships.find(
				(membership) => membership.agency.id === cookieActiveAgencyId,
			) ??
			memberships.find(
				(membership) => membership.agency.id === user.activeAgencyId,
			) ??
			memberships[0] ??
			null)
		: null;

	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-5 p-5">
			<div className="flex w-full max-w-3xl flex-col items-center justify-center gap-2.5">
				<h1 className="w-full text-left font-semibold text-[24px] leading-[24px] tracking-tight">
					Agencies
				</h1>
				<p className="w-full text-left text-[14px] text-muted-foreground leading-[14px]">
					{activeMembership
						? `Current workspace: ${activeMembership.agency.displayName}`
						: "Workspaces you belong to and your role within each agency."}
				</p>
			</div>
			<div className="grid h-full w-full grid-cols-3 items-start justify-start gap-5">
				<CreateAgencyForm className="self-start" onSubmit={createAgency} />
				{hasMemberships ? (
					<div className="col-span-2 h-full max-h-full w-full overflow-y-auto rounded-lg border-2 border-dashed p-5">
						<div className="grid grid-cols-3 items-start justify-start gap-5">
							{memberships.map((membership) => (
								<AgencyCard
									isActive={Boolean(
										activeMembership &&
											activeMembership.agency.id === membership.agency.id,
									)}
									key={membership.id}
									membership={membership}
									onArchive={archiveAgency}
									onSwitch={switchAgency}
									onUpdate={updateAgency}
								/>
							))}
						</div>
					</div>
				) : (
					<div className="col-span-2 flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed">
						<ShieldX className="size-14 text-primary" />
						<h2 className="mt-5 mb-2.5 font-semibold text-[18px] leading-[18px] tracking-tight">
							No agencies yet.
						</h2>
						<p className="w-full max-w-prose text-center text-muted-foreground text-sm">
							Use the form to the left to create your
							<br />
							first workspace and start building recruitment experiences.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AgenciesPage;
