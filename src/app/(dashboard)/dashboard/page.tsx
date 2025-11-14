import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { resolveCurrentUser } from "@/server/auth";
import { db } from "@/server/db";

const formatRelativeDate = (input: Date) => {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(input);
};

const DashboardHomePage = async () => {
	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const membership = await db.agencyMember.findFirst({
		where: { userId: user.id },
		orderBy: { createdAt: "asc" },
		include: { agency: true },
	});

	if (!membership?.agency) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-5 p-5 text-center">
				<h1 className="font-semibold text-2xl tracking-tight">
					Welcome to Recruitify
				</h1>
				<p className="max-w-md text-muted-foreground">
					Looks like you haven&apos;t created an agency yet. Create your first
					workspace to start building recruitment sites.
				</p>
				<Button asChild>
					<Link href="/dashboard/agencies">Create an agency</Link>
				</Button>
			</div>
		);
	}

	const agencyId = membership.agencyId;

	const [templateCount, jobCount, applicationCount, domainCount] =
		await Promise.all([
			db.template.count({ where: { agencyId } }),
			db.job.count({ where: { agencyId } }),
			db.application.count({ where: { agencyId } }),
			db.domain.count({ where: { agencyId } }),
		]);

	const [recentTemplates, recentApplications] = await Promise.all([
		db.template.findMany({
			where: { agencyId },
			select: { id: true, title: true, status: true, updatedAt: true },
			orderBy: { updatedAt: "desc" },
			take: 5,
		}),
		db.application.findMany({
			where: { agencyId },
			select: {
				id: true,
				applicantName: true,
				status: true,
				submittedAt: true,
				job: { select: { title: true } },
			},
			orderBy: { submittedAt: "desc" },
			take: 5,
		}),
	]);

	return (
		<div className="flex h-full w-full flex-col gap-5 p-5">
			<header className="flex flex-col gap-2">
				<p className="text-muted-foreground text-sm">Workspace overview</p>
				<h1 className="font-semibold text-3xl tracking-tight">
					Welcome back, {user.name ?? membership.agency.displayName}
				</h1>
				<p className="max-w-2xl text-muted-foreground">
					Here&apos;s a snapshot of what&apos;s happening across the&nbsp;
					{membership.agency.displayName} agency. Jump back into your workflows
					or explore quick stats below.
				</p>
			</header>
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					href="/dashboard/templates"
					label="Active templates"
					value={templateCount}
				/>
				<StatCard href="/dashboard/jobs" label="Open jobs" value={jobCount} />
				<StatCard
					href="/dashboard/applications"
					label="Applications"
					value={applicationCount}
				/>
				<StatCard
					href="/dashboard/domains"
					label="Connected domains"
					value={domainCount}
				/>
			</section>
			<section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-lg">Recent templates</h2>
						<Button asChild size="sm" variant="outline">
							<Link href="/dashboard/templates">View all</Link>
						</Button>
					</div>
					{recentTemplates.length === 0 ? (
						<div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
							No templates yet.&nbsp;
							<Link className="underline" href="/dashboard/templates/new">
								Create your first template.
							</Link>
						</div>
					) : (
						<ul className="divide-y rounded-lg border">
							{recentTemplates.map((template) => (
								<li
									className="flex items-center justify-between gap-3 p-4 text-sm"
									key={template.id}
								>
									<div className="flex flex-col">
										<span className="font-medium">{template.title}</span>
										<span className="text-muted-foreground text-xs">
											Status: {template.status.toLowerCase()}
										</span>
									</div>
									<time className="text-muted-foreground text-xs">
										Updated {formatRelativeDate(template.updatedAt)}
									</time>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="flex flex-col gap-4">
					<h2 className="font-semibold text-lg">Quick actions</h2>
					<div className="flex flex-col gap-2">
						<ActionButton
							href="/dashboard/templates/new"
							label="Create template"
						/>
						<ActionButton href="/dashboard/jobs/new" label="Create job" />
						<ActionButton
							href="/dashboard/domains/link"
							label="Connect domain"
						/>
					</div>
					<div className="mt-6 flex flex-col gap-3">
						<h3 className="font-semibold text-sm">Latest applications</h3>
						{recentApplications.length === 0 ? (
							<p className="rounded-lg border border-dashed p-4 text-muted-foreground text-sm">
								No applications yet. Promote your jobs to start receiving
								candidates.
							</p>
						) : (
							<ul className="divide-y rounded-lg border">
								{recentApplications.map((application) => (
									<li
										className="flex flex-col gap-1 p-3 text-sm"
										key={application.id}
									>
										<div className="flex items-center justify-between gap-2">
											<span className="font-medium">
												{application.applicantName}
											</span>
											<span className="text-muted-foreground text-xs">
												{formatRelativeDate(application.submittedAt)}
											</span>
										</div>
										<p className="text-muted-foreground text-xs">
											Applied for {application.job?.title ?? "a role"} •
											Status:&nbsp;
											{application.status.toLowerCase()}
										</p>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

const StatCard = ({
	label,
	value,
	href,
}: {
	label: string;
	value: number;
	href: string;
}) => {
	return (
		<Link
			className="flex flex-col gap-2 rounded-lg border p-4 transition hover:border-primary hover:bg-primary/5"
			href={href}
		>
			<span className="font-medium text-muted-foreground text-xs uppercase">
				{label}
			</span>
			<span className="font-semibold text-3xl">{value}</span>
			<span className="text-muted-foreground text-xs">View details</span>
		</Link>
	);
};

const ActionButton = ({ label, href }: { label: string; href: string }) => (
	<Button asChild size="sm" variant="ghost">
		<Link className="justify-start" href={href}>
			{label}
		</Link>
	</Button>
);

export default DashboardHomePage;
