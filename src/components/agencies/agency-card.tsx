import AgencyActions from "@/components/agencies/agency-actions";
import SwitchAgencyButton from "@/components/agencies/switch-agency-button";
import type {
	ArchiveAgencyFormValues,
	SwitchAgencyFormValues,
	UpdateAgencyFormValues,
} from "@/lib/validations/agency";
import type { Prisma } from "@/server/db";

type MembershipWithAgency = Prisma.AgencyMemberGetPayload<{
	include: { agency: true };
}>;

const AgencyCard = ({
	membership,
	isActive,
	onUpdate,
	onArchive,
	onSwitch,
}: {
	membership: MembershipWithAgency;
	isActive: boolean;
	onUpdate: (values: UpdateAgencyFormValues) => Promise<{
		success?: boolean;
		error?: string;
	}>;
	onArchive: (values: ArchiveAgencyFormValues) => Promise<{
		success?: boolean;
		error?: string;
	}>;
	onSwitch: (values: SwitchAgencyFormValues) => Promise<{
		success?: boolean;
		error?: string;
	}>;
}) => {
	const formatRole = (role: string) =>
		role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

	return (
		<div className="hover:-translate-y-0.5 flex h-full flex-col justify-start rounded-lg border bg-card shadow-sm transition hover:border-primary/60 hover:shadow-md">
			<div className="flex w-full items-center justify-center border-b p-2.5">
				<h2 className="flex flex-1 items-center justify-start gap-2 text-left font-semibold text-[18px] text-card-foreground leading-[18px]">
					{isActive && (
						<div className="relative size-2 rounded-full bg-primary">
							<div className="absolute inset-0 size-2 animate-ping rounded-full bg-primary" />
						</div>
					)}
					{membership.agency.displayName}
				</h2>
				<div className="flex items-center gap-2">
					<span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-medium text-primary text-xs uppercase">
						{formatRole(membership.role)}
					</span>
					{membership.role === "OWNER" ? (
						<AgencyActions
							agency={membership.agency}
							canEdit={membership.role === "OWNER"}
							onArchive={onArchive}
							onUpdate={onUpdate}
						/>
					) : null}
				</div>
			</div>
			<p className="w-full px-2.5 pt-2.5 text-left text-muted-foreground text-sm">
				{membership.agency.description ?? "No description provided."}
			</p>
			<div className="mt-auto space-y-2 p-2.5 text-sm">
				<div>
					<span className="text-muted-foreground text-xs uppercase">Slug</span>
					<p className="font-mono text-sm">{membership.agency.slug}</p>
				</div>
				<p className="text-muted-foreground text-xs">
					Joined {membership.agency.createdAt.toLocaleDateString()}
				</p>
			</div>
			<div className="border-t p-2.5">
				<SwitchAgencyButton
					agencyId={membership.agency.id}
					agencyName={membership.agency.displayName}
					isActive={isActive}
					onSwitch={onSwitch}
				/>
			</div>
		</div>
	);
};

export default AgencyCard;
