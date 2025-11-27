import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		KINDE_ISSUER_URL: z.string().url(),
		KINDE_CLIENT_ID: z.string().min(1),
		KINDE_CLIENT_SECRET: z.string().min(1),
		KINDE_SITE_URL: z.string().url(),
		KINDE_POST_LOGIN_REDIRECT_URL: z.string().url(),
		KINDE_POST_LOGOUT_REDIRECT_URL: z.string().url(),
		KINDE_CONNECTION_PASSWORD: z.string().min(1).optional(),
		KINDE_CONNECTION_GOOGLE: z.string().min(1).optional(),
		KINDE_CONNECTION_MICROSOFT: z.string().min(1).optional(),
		KINDE_CONNECTION_APPLE: z.string().min(1).optional(),
		KINDE_CONNECTION_LINKEDIN: z.string().min(1).optional(),
		STRIPE_SECRET_KEY: z.string().min(1),
		STRIPE_WEBHOOK_SECRET: z.string().min(1),
		STRIPE_PRICE_BASIC_MONTHLY_ID: z.string().min(1),
		STRIPE_PRICE_PRO_MONTHLY_ID: z.string().min(1),
		STRIPE_PRICE_ENTERPRISE_MONTHLY_ID: z.string().min(1),
		UPLOADTHING_TOKEN: z.string().min(1),
		POSTHOG_API_KEY: z.string().min(1),
		POSTHOG_API_HOST: z.string().url().default("https://app.posthog.com"),
		GEMINI_API_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url(),
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
		NEXT_PUBLIC_POSTHOG_HOST: z
			.string()
			.url()
			.default("https://app.posthog.com"),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
		KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID,
		KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET,
		KINDE_SITE_URL: process.env.KINDE_SITE_URL,
		KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
		KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
		KINDE_CONNECTION_PASSWORD: process.env.KINDE_CONNECTION_PASSWORD,
		KINDE_CONNECTION_GOOGLE: process.env.KINDE_CONNECTION_GOOGLE,
		KINDE_CONNECTION_MICROSOFT: process.env.KINDE_CONNECTION_MICROSOFT,
		KINDE_CONNECTION_APPLE: process.env.KINDE_CONNECTION_APPLE,
		KINDE_CONNECTION_LINKEDIN: process.env.KINDE_CONNECTION_LINKEDIN,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		STRIPE_PRICE_BASIC_MONTHLY_ID: process.env.STRIPE_PRICE_BASIC_MONTHLY_ID,
		STRIPE_PRICE_PRO_MONTHLY_ID: process.env.STRIPE_PRICE_PRO_MONTHLY_ID,
		STRIPE_PRICE_ENTERPRISE_MONTHLY_ID:
			process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY_ID,
		UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
		POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
		POSTHOG_API_HOST: process.env.POSTHOG_API_HOST,
		GEMINI_API_KEY: process.env.GEMINI_API_KEY,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
