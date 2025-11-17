import {
	Activity,
	BarChart3,
	Building2,
	Cog,
	CreditCard,
	Crown,
	FileText,
	Globe,
	Hammer,
	Home,
	LayoutTemplate,
	Puzzle,
	Settings,
	User,
	Users,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
	{
		category: "Overview",
		items: [
			{ href: "/dashboard", icon: Home, text: "Dashboard" },
			{ href: "/dashboard/jobs", icon: FileText, text: "Jobs" },
			{ href: "/dashboard/applications", icon: Activity, text: "Applications" },
			{ href: "/dashboard/domains", icon: Globe, text: "Domains" },
			{ href: "/dashboard/analytics", icon: BarChart3, text: "Analytics" },
		],
	},
	{
		category: "Builder & Templates",
		items: [
			{
				href: "/dashboard/builder",
				icon: Hammer,
				text: "Builder",
			},
			{
				href: "/dashboard/templates",
				icon: LayoutTemplate,
				text: "Templates",
			},
		],
	},
	{
		category: "Settings & Billing",
		items: [
			{ href: "/dashboard/settings/profile", icon: User, text: "Profile" },
			{
				href: "/dashboard/settings/branding",
				icon: Settings,
				text: "Branding",
			},
			{ href: "/dashboard/settings/team", icon: Users, text: "Team" },
			{
				href: "/dashboard/settings/integrations",
				icon: Puzzle,
				text: "Integrations",
			},
			{ href: "/dashboard/settings/api", icon: Cog, text: "API & Keys" },
			{ href: "/dashboard/billing", icon: CreditCard, text: "Billing" },
			{ href: "/dashboard/upgrade", icon: Crown, text: "Upgrade" },
			{ href: "/dashboard/agencies", icon: Building2, text: "Agencies" },
		],
	},
];

export const ACTIVE_AGENCY_COOKIE_NAME = "active-agency-id";
export const ACTIVE_AGENCY_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
