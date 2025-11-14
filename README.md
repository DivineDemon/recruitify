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
| `KINDE_CONNECTION_PASSWORD` | (Optional) Kinde connection ID for username/password login. |
| `KINDE_CONNECTION_GOOGLE` | (Optional) Kinde connection ID for Google OAuth. |
| `KINDE_CONNECTION_MICROSOFT` | (Optional) Kinde connection ID for Microsoft OAuth. |
| `KINDE_CONNECTION_APPLE` | (Optional) Kinde connection ID for Apple OAuth. |
| `KINDE_CONNECTION_LINKEDIN` | (Optional) Kinde connection ID for LinkedIn OAuth. |
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

After updating `.env`, restart the dev server so Next.js picks up the changes.

## Project Roadmap

The high-level roadmap is documented separately in the planning file. Development tasks are tracked in the workspace todo list. Follow the sequence: environment setup → core data layer → builder experience → publishing → billing → analytics → launch polish.

## Application Routes

- `/(marketing)` – public marketing site (`/`, `/features`, `/pricing`, `/faq`, `/legal/*`)
- `/(dashboard)` – authenticated shell for all tenant features
  - `/dashboard` – overview
  - `/dashboard/templates`, `/dashboard/templates/[id]/builder|preview|publish|analytics`
  - `/dashboard/jobs`, `/dashboard/jobs/[id]`
  - `/dashboard/applications`, `/dashboard/applications/[id]`
  - `/dashboard/domains`, `/dashboard/domains/link`
  - `/dashboard/analytics`, `/dashboard/analytics/traffic`
  - `/dashboard/billing`, `/dashboard/billing/invoices/[invoiceId]`, `/dashboard/upgrade`
  - `/dashboard/settings/profile|branding|team|integrations|api`
  - `/dashboard/agencies` – workspace switcher plus owner-only create/edit/archive tools
- `/site/[domain]/[...path]` – published customer sites (wildcard routing via middleware)
- `/status` – service health
- `/api/trpc/[trpc]` – tRPC handler
- `/api/stripe/webhook`, `/api/uploadthing`, `/api/analytics/ingest`, `/api/status`

### Agencies Workspace Management

- Each Kinde user can belong to multiple agencies via `AgencyMember` records and can own more than one workspace.
- Owners manage workspace metadata (name, slug, description, branding) and switch the active context from `/dashboard/agencies`.
- Owners can archive workspaces, which flips `Agency.status` to `ARCHIVED`, timestamps `archivedAt`, and hides the workspace from dashboards until reactivated.
- Workspace switching persists the selected agency to `User.activeAgencyId` in the database and the HTTP-only `active-agency-id` cookie so the sidebar/layout can instantly pick up the current workspace across sessions.
- `/dashboard/settings/team` lists the active agency’s members and lets owners/admins invite existing Recruitify accounts by email while role-gating access (owners can invite owners/admins; admins can invite editors).
- The create + update + archive flows use server actions, UploadThing for branding assets, and enforce role checks so only owners can edit agency-level details.

## Prisma Model Overview

| Model | Purpose | Key Relationships / Attributes |
| --- | --- | --- |
| `User` | Identity record synced from Kinde. | Has many `AgencyMember`, `ApplicationEvent`, `PublishRecord`, `AuditLog`, `MediaAsset`; stores `activeAgencyId` for workspace context (mirrored to cookie). |
| `Agency` | Tenant workspace for a recruitment business. | Has many `AgencyMember`, `Template`, `Job`, `Application`, `Domain`, `Subscription`, `Invoice`, `UsageRecord`, `AnalyticsEvent`, `AnalyticsDailyAggregate`, `MediaAsset`, `AuditLog`; tracks `status` (`ACTIVE`/`ARCHIVED`) and `archivedAt`. |
| `AgencyMember` | Connects users to agencies with roles. | Belongs to `Agency` and `User`; unique per pair. |
| `Template` | Editable website configuration. | Belongs to `Agency`; has `TemplateVersion`, `Page`, `Job`, `Application`, `Domain`, `PublishRecord`, `AnalyticsEvent`, `AnalyticsDailyAggregate`. |
| `TemplateVersion` | Immutable snapshots for publishes. | Belongs to `Template`; referenced by `PublishRecord` and optionally as current published version. |
| `Page` | Optional per-template page definition. | Belongs to `Template`; slug unique within template. |
| `ComponentLibraryEntry` | Registry of reusable blocks. | Standalone metadata for the builder. |
| `Job` | Structured job posting used in templates. | Belongs to `Agency`; optional link to `Template`; has many `Application`. |
| `Application` | Candidate submission data. | Belongs to `Agency` and `Template`; optional `Job`; has many `ApplicationEvent`. |
| `ApplicationEvent` | Timeline entries / status changes. | Belongs to `Application`; optional actor `User`. |
| `Domain` | Published hostnames (subdomain/custom). | Belongs to `Agency`; optional `Template`; has `PublishRecord`, `AnalyticsEvent`, `AnalyticsDailyAggregate`. |
| `PublishRecord` | Audit trail of publish actions. | Belongs to `Template`; optional `TemplateVersion`, `Domain`, `User`. |
| `Subscription` | Stripe subscription state per agency. | Belongs to `Agency`; has many `Invoice`. |
| `Invoice` | Stripe invoice metadata. | Belongs to `Agency` and `Subscription`. |
| `UsageRecord` | Aggregated usage metrics (plan enforcement). | Belongs to `Agency`; indexed by metric/date. |
| `AnalyticsEvent` | Raw visit/conversion events. | Belongs to `Agency`, `Template`; optional `Domain`. |
| `AnalyticsDailyAggregate` | Precomputed analytics rollups. | Belongs to `Agency`, `Template`; optional `Domain`; unique per template/date/domain combo. |
| `MediaAsset` | UploadThing-backed files (logos, resumes). | Belongs to `Agency`; optional uploader `User`. |
| `AuditLog` | Workspace activity log. | Belongs to `Agency`; optional actor `User`. |
| `WebhookEvent` | Stored incoming webhook payloads. | Tracks source (`STRIPE`, `KINDE`, `UPLOADTHING`, `OTHER`), processing status, errors. |

**Core enums**: `AgencyRole`, `AgencyStatus`, `TemplateStatus`, `EmploymentType`, `JobStatus`, `ApplicationStatus`, `DomainType`, `DomainStatus`, `SubscriptionPlan`, `SubscriptionStatus`, `InvoiceStatus`, `AnalyticsEventType`, `MediaAssetType`, `WebhookSource`, `WebhookStatus`.
