import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { KindeLoginButtons } from "@/components/auth/kinde-login-buttons";
import { PagePlaceholder } from "@/components/page-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { env } from "@/env";
import { cn } from "@/lib/utils";

const SignInPage = () => {
	const providers = [
		env.KINDE_CONNECTION_PASSWORD
			? {
					label: "Continue with Email & Password",
					connectionId: env.KINDE_CONNECTION_PASSWORD,
				}
			: { label: "Continue with Email" },
		env.KINDE_CONNECTION_GOOGLE && {
			label: "Continue with Google",
			connectionId: env.KINDE_CONNECTION_GOOGLE,
		},
		env.KINDE_CONNECTION_MICROSOFT && {
			label: "Continue with Microsoft",
			connectionId: env.KINDE_CONNECTION_MICROSOFT,
		},
		env.KINDE_CONNECTION_APPLE && {
			label: "Continue with Apple",
			connectionId: env.KINDE_CONNECTION_APPLE,
		},
		env.KINDE_CONNECTION_LINKEDIN && {
			label: "Continue with LinkedIn",
			connectionId: env.KINDE_CONNECTION_LINKEDIN,
		},
	].filter((provider): provider is { label: string; connectionId?: string } =>
		Boolean(provider),
	);

	return (
		<PagePlaceholder
			actions={
				<div className="flex w-full flex-col items-center gap-4">
					<KindeLoginButtons providers={providers} />
					<p className="text-muted-foreground text-sm">
						Don&apos;t have an account?&nbsp;
						<RegisterLink
							className={cn(
								buttonVariants({ variant: "link" }),
								"h-auto p-0 text-sm",
							)}
						>
							Register
						</RegisterLink>
					</p>
				</div>
			}
			description="Choose an authentication method to access your recruitment workspace."
			title="Sign in to Recruitify"
		/>
	);
};

export default SignInPage;
