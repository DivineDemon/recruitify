# Branding/Theme System Development Plan

## Overview
Implement a comprehensive theme library system for agencies. Each agency can have multiple themes and logos stored at the agency level. Templates can select which theme and logo to use. Themes cannot be edited once created to avoid breaking templates that use them. AI-powered theme generation will be available.

---

## Architecture

### Data Model
- **Themes**: Separate `Theme` model (one-to-many with Agency)
- **Logos**: Use existing `MediaAsset` model with `type: LOGO`
- **Template Selection**: Template stores `selectedThemeId` and `selectedLogoId`
- **Default Theme**: One theme per agency must be marked as default

### Key Constraints
- Themes stored at **agency level** (not template level)
- Users can **create** new themes/logos
- Users can **delete** themes/logos (with validation)
- Users **cannot edit** themes (to avoid breaking templates)
- One theme must be **default** (user can change default)
- Templates **select** theme/logo from library during creation/updation

---

## Phase 1: Foundation & Schema (Backend)

### Step 1.1: Update Prisma Schema
**File**: `prisma/schema.prisma`

**Add Theme Model:**
```prisma
model Theme {
  id          String   @id @default(cuid())
  agencyId    String
  name        String
  description String?
  config      Json     // Theme configuration (colors, typography, spacing, etc.)
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  agency    Agency     @relation(fields: [agencyId], references: [id])
  templates Template[]

  @@unique([agencyId, isDefault], where: { isDefault: true }) // Only one default per agency
  @@index([agencyId])
}
```

**Update Agency Model:**
- Remove `brandColor` field (no longer needed)
- Remove `logoUrl` field (no longer needed, logos stored in MediaAsset)
- Add relation: `themes Theme[]`

**Update Template Model:**
- Add `selectedThemeId String?` (optional, references Theme)
- Add `selectedLogoId String?` (optional, references MediaAsset)
- Add relations: `selectedTheme Theme?`, `selectedLogo MediaAsset?`

**Update MediaAsset:**
- `type MediaAssetType` already has `LOGO` enum value (exists)

**Migration**: Create and run migration
```bash
pnpm prisma migrate dev --name add_theme_system
```

---

### Step 1.2: Create TypeScript Type Definitions
**File**: `src/types/theme.ts` (new)
- Define `ThemeConfig` type (the JSON structure):
  - `colors`: Primary, secondary, accent, background, surface, text variants, borders, buttons, etc.
  - `typography`: Font families, sizes, weights, line heights
  - `spacing`: Spacing scale
  - `borderRadius`: Border radius values
  - `shadows`: Shadow definitions
  - Extensible structure for future additions

- Define `Theme` type (matches Prisma model)
- Define Zod schemas for validation:
  - `themeConfigSchema` - Validates theme config structure
  - `createThemeInputSchema` - Validates theme creation input
  - `updateThemeInputSchema` - Only allows name/description updates (no config)

**File**: `src/types/branding.ts` (new)
- Re-export theme types for convenience
- Define branding-related utility types

---

### Step 1.3: Create Theme Utilities
**File**: `src/lib/theme.ts` (new)
- `generateCSSVariables(config: ThemeConfig): string` - Convert theme config to CSS variables
- `validateThemeConfig(config: unknown): ThemeConfig` - Validate theme config structure
- `getDefaultThemeConfig(): ThemeConfig` - Return default theme config structure
- `mergeThemeConfig(base: ThemeConfig, overrides: Partial<ThemeConfig>): ThemeConfig` - Merge themes
- `generateThemeFromAI(prompt: string): Promise<ThemeConfig>` - AI theme generation (Phase 5)

---

### Step 1.4: Create Theme Router (tRPC)
**File**: `src/server/api/routers/theme.ts` (new)

**Procedures:**
- `list` - Get all themes for current agency
  - Returns themes with usage count (how many templates use each)
  - Includes default theme indicator
  
- `get` - Get single theme by ID
  - Returns theme config
  
- `create` - Create new theme
  - Input: `name`, `description?`, `config: ThemeConfig`
  - Validates config
  - If first theme, sets as default
  - Returns created theme
  
- `update` - Update theme (name/description only, NOT config)
  - Input: `id`, `name?`, `description?`
  - Prevents config updates
  - Returns updated theme
  
- `setDefault` - Set theme as default
  - Input: `id`
  - Unsets previous default
  - Sets new default
  - Returns updated theme
  
- `delete` - Delete theme
  - Input: `id`
  - Validates: Cannot delete if it's the only theme
  - Validates: Cannot delete if templates are using it (or handle cascade)
  - If deleting default, sets another theme as default
  - Returns success

**Validation**: Use Zod schemas from `src/types/theme.ts`

---

### Step 1.5: Update Agency Router
**File**: `src/server/api/routers/agency.ts`

**Add Logo Procedures:**
- `listLogos` - Get all logos (MediaAsset with type LOGO) for agency
- `uploadLogo` - Upload logo via UploadThing
  - Creates MediaAsset with `type: LOGO`
  - Returns MediaAsset
  
- `deleteLogo` - Delete logo
  - Input: `logoId`
  - Validates: Cannot delete if templates are using it
  - Deletes MediaAsset

---

### Step 1.6: Update Template Router
**File**: `src/server/api/routers/template.ts`

**Update `create` procedure:**
- Accept `selectedThemeId?` and `selectedLogoId?`
- If not provided, use agency's default theme

**Update `updateMetadata` procedure:**
- Allow updating `selectedThemeId` and `selectedLogoId`

**Add `getAvailableThemes` procedure:**
- Returns list of themes available for template selection

**Add `getAvailableLogos` procedure:**
- Returns list of logos available for template selection

---

## Phase 2: Branding Settings UI (Frontend)

### Step 2.1: Create Theme Library Component
**File**: `src/components/branding/theme-library.tsx` (new)
- Displays list of themes
- Shows theme preview cards
- Shows which theme is default
- Shows usage count (how many templates use each)
- Actions: Create, Set Default, Delete
- Cannot edit existing themes (only create new ones)

---

### Step 2.2: Create Theme Creator Component
**File**: `src/components/branding/theme-creator.tsx` (new)
- Full theme editor for creating new themes
- Sections:
  - Basic info (name, description)
  - Colors (primary, secondary, accent, background, surface, text, borders, buttons)
  - Typography (font families, sizes, weights, line heights)
  - Spacing (spacing scale)
  - Advanced (border radius, shadows, etc.)
- Live preview
- Save button creates new theme
- Cancel button

---

### Step 2.3: Create Color Picker Components
**File**: `src/components/branding/color-picker.tsx` (new)
- Reusable color picker component
- Support hex, rgb, hsl formats
- Show color preview
- Integration with shadcn/ui if available

**File**: `src/components/branding/color-group.tsx` (new)
- Group of related color pickers (e.g., text colors, button colors)
- Organized layout

---

### Step 2.4: Create Typography Editor
**File**: `src/components/branding/typography-editor.tsx` (new)
- Font family selector (with Google Fonts integration or system fonts)
- Font size inputs
- Font weight selector
- Line height inputs
- Preview text

---

### Step 2.5: Create Spacing Editor
**File**: `src/components/branding/spacing-editor.tsx` (new)
- Spacing scale inputs
- Visual preview of spacing values

---

### Step 2.6: Create Logo Library Component
**File**: `src/components/branding/logo-library.tsx` (new)
- Displays list of logos (from MediaAsset)
- Shows logo previews
- Shows usage count
- Actions: Upload, Delete
- Support URL input and file upload (UploadThing)

---

### Step 2.7: Build Branding Settings Page
**File**: `src/app/(dashboard)/dashboard/settings/branding/page.tsx`
- Server component that fetches agency data
- Passes data to client component

**File**: `src/components/branding/branding-settings-client.tsx` (new)
- Client component
- Tabs or sections:
  - Themes (Theme Library + Theme Creator)
  - Logos (Logo Library)
- Uses tRPC mutations for all operations
- Loading states
- Error handling
- Success notifications

---

## Phase 3: Theme Selection in Builder & Templates

### Step 3.1: Create Theme Selector Component
**File**: `src/components/branding/theme-selector.tsx` (new)
- Dropdown/select component to choose theme
- Shows theme preview
- Shows which is default
- Used in builder and template settings

---

### Step 3.2: Create Logo Selector Component
**File**: `src/components/branding/logo-selector.tsx` (new)
- Dropdown/select component to choose logo
- Shows logo preview
- Used in builder and template settings

---

### Step 3.3: Create Theme Context/Hook
**File**: `src/contexts/theme-context.tsx` (new)
- React context that provides:
  - Available themes for agency
  - Available logos for agency
  - Current template's selected theme/logo
- Fetches from tRPC
- Caches data

**File**: `src/hooks/use-theme.ts` (new)
- Hook to access theme context
- Returns `themes`, `logos`, `selectedTheme`, `selectedLogo`, `isLoading`, `error`

---

### Step 3.4: Create CSS Variables Injector
**File**: `src/components/theme/css-variables-injector.tsx` (new)
- Component that injects CSS variables into DOM
- Uses `generateCSSVariables` utility
- Takes `themeId` or `themeConfig` as prop
- Applies variables to a specific container or globally
- Updates when theme changes

---

### Step 3.5: Integrate Theme Selection into Builder
**File**: `src/components/builder/builder-container.tsx`
- Add theme/logo selector in builder header/toolbar
- When theme/logo selected, update template's `selectedThemeId`/`selectedLogoId`
- Wrap builder canvas with `CSSVariablesInjector`
- Make theme colors available in color pickers
- Make theme fonts available in font selectors

**File**: `src/components/builder/registry.tsx`
- Update color pickers to show theme colors
- Update font selectors to show theme fonts
- Use theme CSS variables in component styles

---

### Step 3.6: Create Theme Preview Component
**File**: `src/components/theme/theme-preview.tsx` (new)
- Visual preview of theme
- Shows buttons, text, cards, etc. with theme applied
- Used in theme library and theme creator

---

## Phase 4: Template Application

### Step 4.1: Apply Theme to Published Templates
**File**: `src/app/site/[domain]/[...path]/page.tsx`
- Fetch template's `selectedThemeId` and `selectedLogoId`
- Fetch theme config from database
- Inject CSS variables into page using `CSSVariablesInjector`
- Apply logo to header/footer
- Apply theme to all template elements

**File**: `src/lib/template-renderer.ts` (new, if needed)
- Utility to render template with theme applied
- Generates CSS variables from theme config
- Injects into template HTML

---

### Step 4.2: Apply Theme to Pre-designed Templates
**File**: `src/components/templates/template-gallery.tsx` (new, future)
- When user selects a pre-designed template
- Show theme/logo selector
- Apply selected theme/logo to template
- Show preview with theme applied

---

## Phase 5: AI Theme Generation

### Step 5.1: Create AI Theme Generator Service
**File**: `src/lib/ai-theme-generator.ts` (new)
- `generateThemeFromLogo(logoUrl: string): Promise<ThemeConfig>`
  - Analyzes logo colors
  - Generates complementary color palette
  - Returns theme config
  
- `generateThemeFromDescription(description: string): Promise<ThemeConfig>`
  - Takes text description (e.g., "modern blue professional")
  - Generates theme config
  - Returns theme config
  
- `generateThemeFromColorPalette(colors: string[]): Promise<ThemeConfig>`
  - Takes array of colors
  - Generates full theme config
  - Returns theme config

**Integration**: Use AI service (OpenAI, Anthropic, etc.)
- Add API key to env
- Create API route for AI calls (server-side only)

---

### Step 5.2: Create AI Theme Generator UI
**File**: `src/components/branding/ai-theme-generator.tsx` (new)
- Input methods:
  - Upload logo → generate from logo
  - Enter description → generate from description
  - Enter colors → generate from color palette
- Shows loading state
- Shows generated theme preview
- User can edit generated theme before saving
- Save button creates new theme

---

### Step 5.3: Integrate AI Generator into Theme Creator
**File**: `src/components/branding/theme-creator.tsx`
- Add "Generate with AI" button/section
- Opens AI generator modal/dialog
- User can use AI-generated theme as starting point
- User can edit AI-generated theme

---

## Phase 6: Polish & Enhancement

### Step 6.1: Theme Validation & Error Handling
- Validate theme config structure on save
- Show helpful error messages
- Prevent invalid themes from being saved
- Validate theme usage before deletion

---

### Step 6.2: Theme Presets
**File**: `src/lib/theme-presets.ts` (new)
- Pre-defined theme presets (e.g., "Modern", "Classic", "Bold")
- Allow users to start from a preset when creating theme
- Can be extended with AI-generated themes

---

### Step 6.3: Theme Export/Import
**File**: `src/lib/theme-export.ts` (new)
- Export theme as JSON
- Import theme from JSON
- Useful for sharing themes between agencies
- Useful for backup/restore

---

### Step 6.4: Usage Tracking
- Track which templates use which themes/logos
- Show usage count in UI
- Prevent deletion if in use (or handle cascade)
- Show warning when deleting theme/logo in use

---

## Phase 7: Testing & Documentation

### Step 7.1: Testing
- Test theme creation/update/delete
- Test logo upload/delete
- Test theme selection in builder
- Test CSS variable generation
- Test theme application in published templates
- Test AI theme generation
- Test default theme behavior
- Test validation (cannot edit theme config, cannot delete in-use theme)

---

### Step 7.2: Documentation
- Update README with branding feature
- Document theme structure
- Document CSS variable naming convention
- Document how to extend theme
- Document AI theme generation

---

## Implementation Order (Recommended)

1. **Phase 1** (Foundation) - Must be done first
2. **Phase 2** (Settings UI) - Can be done in parallel with Phase 3
3. **Phase 3** (Builder Integration) - Can be done in parallel with Phase 2
4. **Phase 4** (Template Application) - After Phase 3
5. **Phase 5** (AI Generation) - After core features work
6. **Phase 6** (Polish) - After core features work
7. **Phase 7** (Testing) - Throughout development

---

## File Structure

```
src/
├── types/
│   ├── theme.ts             # Theme types and Zod schemas
│   └── branding.ts           # Branding utility types
├── lib/
│   ├── theme.ts              # Theme utilities (CSS generation, validation)
│   ├── theme-presets.ts     # Theme presets
│   ├── theme-export.ts       # Export/import utilities
│   └── ai-theme-generator.ts # AI theme generation
├── contexts/
│   └── theme-context.tsx     # Theme React context
├── hooks/
│   └── use-theme.ts          # Theme hook
├── components/
│   ├── branding/
│   │   ├── theme-library.tsx      # Theme list/management
│   │   ├── theme-creator.tsx       # Theme creation UI
│   │   ├── theme-selector.tsx     # Theme selection dropdown
│   │   ├── logo-library.tsx       # Logo list/management
│   │   ├── logo-selector.tsx       # Logo selection dropdown
│   │   ├── color-picker.tsx
│   │   ├── color-group.tsx
│   │   ├── typography-editor.tsx
│   │   ├── spacing-editor.tsx
│   │   ├── ai-theme-generator.tsx # AI generation UI
│   │   └── branding-settings-client.tsx
│   └── theme/
│       ├── css-variables-injector.tsx
│       └── theme-preview.tsx
└── server/
    └── api/
        └── routers/
            ├── theme.ts      # Theme router (new)
            ├── agency.ts     # Logo procedures
            └── template.ts   # Theme selection procedures
```

---

## Dependencies to Check/Add

- Color picker library (e.g., `react-color` or shadcn/ui color picker)
- Font selector (may need Google Fonts API integration)
- AI service (OpenAI, Anthropic, etc.) for AI theme generation
- CSS variable generation utilities

---

## Estimated Complexity

- **Phase 1**: High (4-6 hours) - Schema changes, multiple routers
- **Phase 2**: High (8-10 hours) - Complex UI with theme/library management
- **Phase 3**: Medium-High (5-7 hours) - Builder integration
- **Phase 4**: Medium (3-4 hours) - Template application
- **Phase 5**: Medium-High (4-6 hours) - AI integration
- **Phase 6**: Low-Medium (2-3 hours) - Polish
- **Phase 7**: Low (1-2 hours) - Testing

**Total Estimated Time**: 27-38 hours

---

## Key Decisions & Constraints

1. **Themes cannot be edited** - Only name/description can be updated
2. **One default theme required** - Agency must always have a default theme
3. **Templates select theme/logo** - Stored in Template model
4. **Themes/logos at agency level** - Shared across all templates
5. **Usage tracking** - Prevent deletion of themes/logos in use
6. **AI generation** - Optional feature, can generate themes from various inputs

---

## Notes

- Start with minimal theme structure, expand as needed
- Consider performance: cache theme data, avoid unnecessary re-renders
- Make theme structure extensible for future additions
- Consider accessibility: ensure color contrast ratios are met
- Consider dark mode: may need separate theme or theme variants
- AI theme generation requires API key and may have costs
