import "@/assets/css/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
	title: "Recruitify",
	description:
		"Recruitment agency website builder with custom domains, billing, and analytics.",
	icons: [{ rel: "icon", url: "/logo.svg" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(geist.variable)}>
				<AuthProvider>
					<TRPCReactProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							disableTransitionOnChange
							enableSystem
						>
							{children}
						</ThemeProvider>
					</TRPCReactProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
