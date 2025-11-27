# Recruitify

Recruitify is a specialized website builder that helps recruitment agencies spin up high-converting job portals with custom domains, analytics, and candidate management.

## Core Features

- **Agency Management**: Create, update, and manage multiple workspaces with role-based access control
- **Team Management**: Invite team members, assign roles (Owner/Admin/Editor), and manage permissions
- **Visual Website Builder**: Drag-and-drop builder with pre-built sections, form elements, and job-specific blocks
- **Template Management**: Create, edit, duplicate, and archive website templates with version control
- **User Profile Management**: Manage user profiles with avatar uploads and settings
- **AI-Powered Template Generation**: Generate website templates automatically using AI

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

## Development Status

### ✅ Completed Features

#### Authentication & User Management ✅
- **Kinde Integration**: Full OAuth setup with email/password, Google, Microsoft, Apple, and LinkedIn
- **User Sync**: Automatic user creation/update from Kinde on login
- **Protected Routes**: Server-side auth checks for all dashboard routes
- **Profile Settings**: User profile management with UploadThing avatar uploads

#### Workspace Management ✅
- **Multi-Agency Support**: Users can belong to multiple agencies with different roles
- **Agency CRUD**: Create, update, and archive agencies (soft delete)
- **Workspace Switching**: Active agency persistence via database and cookies
- **Role-Based Access Control**: OWNER, ADMIN, EDITOR roles with proper permissions
- **Team Management**: Invite members, change roles, remove/leave workspace with confirmation modals

#### Template Management ✅
- **Template CRUD**: Create, list, update metadata, and archive templates
- **Template Builder Integration**: Full integration with visual builder for editing page trees
- **Template Duplication**: Duplicate existing templates with optional title customization
- **Version Control**: Template versioning system with publish records
- **Autosave**: Automatic saving of template changes with debouncing
- **Template Metadata**: Edit template title and description

#### Template Marketplace ✅
- **Marketplace Browsing**: Browse pre-designed templates in `/dashboard/templates/marketplace`
- **Template Search**: Search marketplace templates by title, description, and tags
- **Live Preview**: Preview templates with live theme/logo selection in preview dialog
- **Template Duplication**: Duplicate marketplace templates to user's agency with theme/logo applied
- **Navigation**: Sidebar link and templates list button for easy access
- **Database Schema**: Complete marketplace fields (`isPreDesigned`, `sourceTemplateId`, `previewImageUrl`, `category`, `tags`)
- **Backend API**: Full tRPC router with list, get, and duplicate procedures
- **Template Cards**: Display preview images, categories, tags, and descriptions
- **Preview Dialog**: Full-screen preview with theme/logo selectors and real-time updates

#### Branding & Theme System ✅
- **Theme Management**: Create, list, update, set default, and delete themes per agency
- **Theme Configuration**: Comprehensive theme editor with colors, typography, spacing, and advanced options
- **Logo Management**: Upload, list, and delete logos per agency
- **Theme Selection in Builder**: Select theme/logo during template creation and editing
- **CSS Variables Injection**: Dynamic theme application via CSS variables
- **Template Theme Application**: Published templates render with selected themes and logos

#### Builder - Core Infrastructure ✅
- **Component Registry**: Centralized block definitions with render and inspector functions
- **Drag & Drop**: Full drag-and-drop support for adding and reordering elements
- **Canvas System**: Interactive canvas with visual feedback, selection, and drop zones
- **Inspector Panel**: Property editing with conditional rendering (shows inspector when element selected, palette otherwise)
- **Database Persistence**: Template state saved to database with autosave functionality
- **Theme Integration**: Dark/light mode support with dynamic grid background

#### Builder - Layout Blocks (Phase 1)
- **Section**: Container with padding, margin, border, and shadow controls
- **Container**: Generic container element
- **FlexRow**: Horizontal flex layout
- **ColumnStack**: Vertical stack layout
- **Spacer**: Flexible spacing element
- **Individual Spacing Controls**: Per-side padding and margin controls
- **Border Controls**: Individual border width, style, and color per side
- **Shadow Controls**: Box shadow customization

#### Builder - Content Blocks (Phase 2)
- **Heading**: Dynamic heading levels (H1-H6) with text alignment
- **Text**: Paragraph text with alignment
- **Button**: Customizable button with variants, sizes, and automatic submit type in forms
- **Image**: Image block with UploadThing integration and manual URL option
- **Link**: Internal and external links
- **List**: Ordered and unordered lists
- **Quote/Blockquote**: Styled quote blocks
- **Badge/Tag**: Badge component with variants
- **Divider**: Horizontal divider with customizable styling
- **Rich Text**: HTML content support (with proper sanitization)
- **Video**: Video embeds with UploadThing and URL support
- **Icon**: Lucide icon selector

#### Builder - Form Blocks (Phase 3)
- **Input**: Text, email, password, number, tel, url, date, time inputs
- **Textarea**: Multi-line text input with rows control
- **Select**: Dropdown select with custom options
- **Checkbox**: Single checkbox with label
- **Radio**: Radio button groups with multiple options
- **Form Container**: Form wrapper with action, method, and automatic button type handling

#### Builder - Pre-built Sections (Phase 4)
- **Hero**: Hero section with title, subtitle, buttons, background, and alignment
- **Features**: Feature grid with icons, titles, and descriptions
- **Testimonials**: Testimonial cards with avatars (UploadThing support), names, roles, and quotes
- **CTA**: Call-to-action section with customizable background and alignment
- **Footer**: Footer with links, social links, and copyright text

#### Builder - Job-Specific Blocks (Phase 5)
- **Job List**: Grid/list layout for displaying multiple jobs with filters
- **Job Card**: Detailed single job display with requirements, salary, location, etc.
- **Application Form**: Job application form with job selection dropdown, customizable fields, and UploadThing resume upload

#### UI Components
- **Shadcn UI Integration**: All form elements use Shadcn UI components (Input, Label, Select, Checkbox, RadioGroup, Textarea, Button)
- **FileUploader Component**: Reusable UploadThing integration component
- **WarningModal**: Reusable confirmation modal for destructive actions

### 🚧 In Progress

Currently, all planned builder phases are complete. The builder is feature-complete for creating single-page job portals.

### 📋 Next Steps / TODO

#### Builder Enhancements
1. **Advanced Styling Controls**
   - Typography controls (font family, size, weight, line height)
   - Color pickers for text, background, and border colors
   - Advanced spacing controls (individual padding/margin per side - partially done)
   - Gradient backgrounds
   - Custom CSS support

2. **More Pre-built Sections**
   - Pricing section
   - FAQ section
   - Stats/Numbers section
   - Team/About section
   - Contact form section

3. **Responsive Controls**
   - Mobile/tablet/desktop breakpoint controls
   - Responsive visibility toggles
   - Device-specific styling

4. **Animation & Transitions**
   - Fade-in animations
   - Slide-in animations
   - Hover effects
   - Scroll-triggered animations

#### Core Functionality
5. **Save/Publish System**
   - Persist builder state to database (Template model)
   - Save drafts vs. published versions
   - Version history (TemplateVersion model)
   - Publish to custom domains

6. **Template System**
   - Save designs as templates
   - Template gallery/library
   - Template preview
   - Template duplication

7. **Template Marketplace Enhancements** 📋
   - **Category Filters UI**: Add UI components for filtering by category (backend already supports)
   - **Tag Filters UI**: Add UI components for filtering by tags (backend already supports, search works)
   - **Grid/List View Toggle**: Add view toggle for marketplace template display
   - **Builder Indicators**: Show visual indicator when template was duplicated from marketplace
   - **Template Badges**: Display "From Marketplace" badge on duplicated templates
   - **Link to Original**: Add link back to original marketplace template from duplicated templates

8. **Job Management**
   - CRUD operations for jobs
   - Job categories and tags
   - Job status management
   - Job application tracking

9. **Application Management**
   - View submitted applications
   - Application status workflow
   - Application events/timeline
   - Candidate communication

10. **Domain Management**
    - Custom domain configuration
    - Subdomain assignment
    - Domain verification
    - SSL certificate management

11. **Analytics Integration**
    - Page view tracking
    - Conversion tracking
    - Analytics dashboard
    - Export reports

12. **Billing Integration**
    - Stripe subscription setup
    - Plan management
    - Usage tracking
    - Invoice generation

### 🏗️ Architecture Notes

- **Builder State**: Currently stored in localStorage. Needs migration to database for persistence.
- **Component Tree**: Uses a recursive node structure with `BuilderNode` type
- **Block Registry**: Centralized in `src/components/builder/registry.tsx` with `BlockDefinition` interface
- **Drag & Drop**: Implemented using HTML5 drag API with custom drop zones
- **Selection System**: Uses React state to track selected node ID
- **Inspector**: Conditionally renders based on selection state, with back button to return to palette

### 📝 Key Files

- `src/components/builder/registry.tsx` - Block definitions and render logic
- `src/components/builder/canvas.tsx` - Canvas rendering and drag-and-drop
- `src/components/builder/palette.tsx` - Block palette sidebar
- `src/components/builder/inspector.tsx` - Property editor
- `src/components/builder/types.ts` - TypeScript type definitions
- `src/app/(dashboard)/dashboard/builder/page.tsx` - Main builder page
- `src/components/file-uploader.tsx` - UploadThing integration component

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
  - `/dashboard/settings/profile|branding|team`
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

## Template Marketplace Implementation Status

### ✅ Completed Features

#### Phase 1: Database Schema ✅
- ✅ `isPreDesigned: Boolean @default(false)` field added to `Template` model
- ✅ `sourceTemplateId: String?` field for tracking original template
- ✅ `previewImageUrl: String?` field for marketplace previews
- ✅ `category: String?` field for organizing templates
- ✅ `tags: Json?` field for search/filtering
- ✅ Indexes: `@@index([isPreDesigned])` and `@@index([isPreDesigned, category])`

#### Phase 2: Backend API ✅
- ✅ `listMarketplaceTemplates`: Query marketplace templates with search, category, and tags filters
- ✅ `getMarketplaceTemplate`: Get single marketplace template with full `pageTree` for preview
- ✅ `duplicateFromMarketplace`: Duplicate marketplace template with theme/logo application
- ✅ Theme/logo validation (must belong to user's agency)
- ✅ Marketplace router registered in root router

#### Phase 3: Frontend Components ⚠️
- ✅ Marketplace page (`/dashboard/templates/marketplace`)
- ✅ Marketplace client component with search functionality
- ✅ Template marketplace cards with preview images
- ✅ Template preview dialog with live theme/logo selection
- ✅ Templates list "Browse Marketplace" button
- ❌ Category filters UI (backend supports, but no UI components)
- ❌ Tag filters UI (backend supports, but no UI components - search works)
- ❌ Grid/list view toggle

#### Phase 4: Template Preview ✅
- ✅ `TemplateRendererClient` component for marketplace previews
- ✅ Supports optional `themeId` and `logoId` props
- ✅ Real-time theme/logo application in preview

#### Phase 5: Integration & UX ⚠️
- ✅ Sidebar navigation link (`/dashboard/templates/marketplace`)
- ✅ Templates list marketplace button
- ❌ Builder indicator for marketplace-duplicated templates
- ❌ "From Marketplace" badge on duplicated templates
- ❌ Link back to original marketplace template

### 🎯 Core Functionality Status

**The marketplace is functionally complete for core use cases:**
- ✅ Users can browse marketplace templates
- ✅ Users can search templates
- ✅ Users can preview templates with their own themes/logos
- ✅ Users can duplicate templates to their agency
- ✅ Duplicated templates have theme/logo applied
- ✅ Navigation is accessible from sidebar and templates list

### 📝 Missing Enhancements

The following features are **enhancements** rather than core functionality:
1. **Category filters UI** - Backend supports it, but no UI components
2. **Tag filters UI** - Backend supports it, but no UI components (search works)
3. **Grid/list view toggle** - Not implemented
4. **Builder indicator** - No visual indicator when template is from marketplace
5. **Template badges** - No "From Marketplace" badge on duplicated templates
6. **Link to original** - No link back to original marketplace template

**Overall Status**: ✅ **Core functionality is complete**. The marketplace is ready for use, with some UX enhancements that can be added later.
