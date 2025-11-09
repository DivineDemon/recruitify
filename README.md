# Recruitify

Recruitify is a specialized website builder that helps recruitment agencies spin up high-converting job portals with custom domains, analytics, and candidate management.

## Tech Stack

- Next.js 15 (App Router)
- tRPC & React Query
- Prisma with Neon Postgres
- Tailwind CSS & shadcn/ui
- Stripe Billing
- Kinde Authentication
- UploadThing storage
- PostHog analytics

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy the environment template and fill in the values (see next section):
   ```bash
   cp .env.example .env.local
   ```
3. Generate the Prisma client:
   ```bash
   pnpm prisma generate
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

## Environment Configuration

Populate `.env.local` using the reference below. All secrets are required unless specifically marked optional.

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development`, `test`, or `production`. Defaults to `development`. |
| `DATABASE_URL` | Neon Postgres connection string. [Docs](https://neon.tech/docs/getting-started/quickstart) |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL (e.g. `http://localhost:3000` for local). |
| `KINDE_ISSUER_URL` | Your Kinde tenant domain (e.g. `https://your-tenant.kinde.com`). [Docs](https://docs.kinde.com/workflows/configuration/environment-variables-and-secrets/) |
| `KINDE_CLIENT_ID` / `KINDE_CLIENT_SECRET` | Credentials for the Kinde application used by Recruitify. |
| `KINDE_SITE_URL` | Base URL that Kinde should trust (usually matches `NEXT_PUBLIC_APP_URL`). |
| `KINDE_POST_LOGIN_REDIRECT_URL` | Path users land on after login (e.g. dashboard). |
| `KINDE_POST_LOGOUT_REDIRECT_URL` | Path users land on after logout. |
| `STRIPE_SECRET_KEY` | Stripe secret key for billing. [Docs](https://stripe.com/docs/keys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key exposed to the client. |
| `STRIPE_WEBHOOK_SECRET` | Validate webhook signatures for billing events. |
| `STRIPE_PRICE_BASIC_MONTHLY_ID` | Stripe Price ID for the Basic monthly subscription. |
| `STRIPE_PRICE_PRO_MONTHLY_ID` | Stripe Price ID for the Pro monthly subscription. |
| `STRIPE_PRICE_ENTERPRISE_MONTHLY_ID` | Stripe Price ID for the Enterprise monthly subscription. |
| `UPLOADTHING_TOKEN` | UploadThing token (encodes app & secret). [Docs](https://docs.uploadthing.com/) |
| `POSTHOG_API_KEY` | Server-side PostHog key for event ingestion. [Docs](https://posthog.com/docs/integrate/next-js) |
| `POSTHOG_API_HOST` | PostHog instance host, defaults to `https://app.posthog.com`. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Public PostHog key used in the browser. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Public PostHog host, defaults to `https://app.posthog.com`. |

After updating `.env.local`, restart the dev server so Next.js picks up the changes.

## Project Roadmap

The high-level roadmap is documented separately in the planning file. Development tasks are tracked in the workspace todo list. Follow the sequence: environment setup → core data layer → builder experience → publishing → billing → analytics → launch polish.
