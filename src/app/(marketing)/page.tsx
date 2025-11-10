import { KindeLoginButtons } from "@/components/auth/kinde-login-buttons";
import { PagePlaceholder } from "@/components/page-placeholder";
import { env } from "@/env";

const MarketingHomePage = () => {
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
				<div className="flex flex-col items-center gap-3">
					<KindeLoginButtons providers={providers} />
				</div>
			}
			description="A dedicated website builder for recruitment agencies. Customize templates, publish to custom domains, and manage applicants end to end."
			title="Recruitify"
		/>
	);
};

export default MarketingHomePage;
