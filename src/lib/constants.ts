import { Home, User } from "lucide-react";

export const SIDEBAR_ITEMS = [
	{
		category: "Overview",
		items: [{ href: "/dashboard", icon: Home, text: "Dashboard" }],
	},
	{
		category: "Settings",
		items: [
			{ href: "/dashboard/settings/profile", icon: User, text: "Profile" },
		],
	},
];
