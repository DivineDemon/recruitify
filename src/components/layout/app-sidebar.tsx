"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ChevronUp, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/assets/img/logo.svg";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem as DropdownMenuPrimitiveItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AppSidebarProps {
	avatar: string;
	displayName: string;
}

const AppSidebar = ({ avatar, displayName }: AppSidebarProps) => {
	const pathname = usePathname();

	return (
		<Sidebar
			className="border-r bg-card text-card-foreground"
			collapsible="none"
		>
			<SidebarHeader className="flex h-16 items-start justify-center border-b p-3.5">
				<Image
					alt="logo"
					className="w-[45px]"
					height={100}
					src={Logo}
					width={100}
				/>
			</SidebarHeader>
			<SidebarContent className="flex w-full flex-col items-start justify-start">
				<SidebarMenu>
					{SIDEBAR_ITEMS.map((item) => (
						<SidebarGroup key={item.category}>
							<SidebarGroupLabel>{item.category}</SidebarGroupLabel>
							<SidebarGroupContent>
								{item.items.map((item) => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											className="justify-start gap-2 transition-all duration-200 hover:bg-primary/20 hover:text-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground data-[active=true]:hover:opacity-75"
											isActive={pathname.endsWith(item.href)}
										>
											<Link href={item.href}>
												<item.icon className="size-4" />
												<span className="truncate">{item.text}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton className="gap-3">
										<div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border">
											{avatar ? (
												<Image
													alt={displayName ?? "User avatar"}
													className="shrink-0 rounded-full"
													fill
													src={avatar}
												/>
											) : (
												<span className="font-semibold text-sm uppercase">
													{displayName?.slice(0, 2) ?? "U"}
												</span>
											)}
										</div>
										<span className="truncate font-semibold text-sm leading-tight">
											{displayName}
										</span>
										<ChevronUp className="ml-auto" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-[239px]" side="top">
									<DropdownMenuPrimitiveItem asChild variant="destructive">
										<LogoutLink className="flex w-full items-center gap-2">
											<LogOut className="size-4" />
											<span>Logout</span>
										</LogoutLink>
									</DropdownMenuPrimitiveItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
