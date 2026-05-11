# Dashboard Build — Plan

## Context

Build the complete user dashboard panel for component-canvas: layout, nav, every page (login + dashboard empty/populated/expanded + connect), every required component, and demo content. Source of truth is the Pencil file `component-book.pen`; the build plan and architecture brief reconcile against it, with the build plan winning on conflicts. All work is frontend-only on mocked data — no backend in this pass. Goal: ship a clickable, fully populated product surface that mirrors the Pencil designs 1-to-1 and that integrates with the existing AppShell at the new route `/[workspace]/[repo]/[branch]`.

User answers from the interview:
- Secondary CTA on empty-state HeroCard — user said "it doesn't matter now, will be re-routed later"; literal pick was option 2 (`/playground/specimens`). Honoring the literal pick: link is `/playground/specimens`. The text reasoning ("what i see when i open the app now") was ambiguous; the destination is a single-line swap later, so we're not blocking on it.
- DashboardNav appears only on `/` and `/connect`. AppShell stays structurally unchanged at `/[workspace]/[repo]/[branch]`.
- State exposure: default to populated and force empty via `?state=empty` for QA. Expanded is a normal interaction.
- Toast + Stale-Viewer-Banner: build with mocked timed triggers. Document every demo-only wiring in `apps/web/ROADMAP.md` so it gets rewired later.

---

## Architecture decisions

### Route structure (route group, no nav on AppShell)

```
apps/web/app/
├── layout.tsx                              (unchanged — root font/dark-mode/paint-gate)
├── globals.css                             (unchanged for tokens; HeroCard hardcodes 2 values inline — see below)
├── (dashboard)/                            (route group — no URL prefix; provides DashboardNav)
│   ├── layout.tsx                          (DashboardNav + scrollable <main>, 280px horizontal padding)
│   ├── page.tsx                            (Dashboard — populated by default, ?state=empty for empty)
│   └── connect/page.tsx                    (ConnectRepo)
├── login/
│   ├── layout.tsx                          (page bg var(--color-bg-secondary), no DashboardNav)
│   └── page.tsx                            (LoginScreen)
├── [workspace]/[repo]/[branch]/page.tsx    (renders existing AppShell; route params accepted but unused — AppShell renders mock registry regardless)
└── playground/                             (unchanged)
```

**Critical — delete `app/page.tsx`, don't rewrite it.** Both `app/page.tsx` and `app/(dashboard)/page.tsx` resolve to `/`, so Next.js will refuse to start if both exist. The existing `app/page.tsx` is deleted; its replacement lives at `app/(dashboard)/page.tsx`. Same `/` URL, wrapped by the new route-group layout.

**Layout placement** — Next.js route groups don't affect URL but DO affect which `layout.tsx` wraps a page. Result:

- `(dashboard)/layout.tsx` wraps `/` and `/connect` with DashboardNav.
- `app/login/...` and `app/[workspace]/[repo]/[branch]/...` are siblings outside the group — they get no DashboardNav.
- Root `app/layout.tsx` stays as-is and wraps everything.

**AppShell route params** — `/[workspace]/[repo]/[branch]` accepts any 3-segment URL; the page renders the existing `<AppShell />` with the existing demo registry regardless of params. No prop-threading needed in this build — that's tracked in ROADMAP §Sidebar (InstanceBreadcrumb wiring).

Body is `h-full overflow-hidden flex flex-col`. Dashboard nav stays at the top (height 60), `<main>` underneath gets `overflow-y-auto` so the repo list scrolls internally — keeps the AppShell's fixed-surface model consistent with the dashboard.

Backify-monorepo's pattern (layout.tsx → header + bare `<main>` + footer; sections own their own padding) ports cleanly. Adapted here: header only (no footer), and inner padding is `var(--spacing-...) ?` — see Padding section.

### Padding rule

Pencil's main padding is `[120, 280]` for populated/expanded and `[40, 280]` for connect. Implement as the `<main>` content wrapper applying:
- horizontal: `padding-inline: var(--padding-main-x)` with `--padding-main-x: 280px` set on the layout root
- vertical: per-page (`120px` top for dashboard, `40px` for connect; controlled by the page's outermost frame)
- alignment: `flex-direction: column`; the inner content stack centers via `mx-auto max-w-[880px]` (dashboard panel width ≈ 880 at 1440 width less 280×2)

280px is wider than the existing AppShell rule, so we keep it inline at the layout level rather than tokenizing.

### State exposure for empty / populated / expanded

- Default `/` renders **populated**.
- `/?state=empty` forces the **empty** layout. The dashboard component checks `useSearchParams().get('state') === 'empty'` or `demoRepoList.length === 0` and renders `<EmptyState>` instead of the list.
- **Expanded** is a normal interaction — clicking a `RepoRow` chevron expands it to reveal `BranchRow`s. No URL toggle needed.
- `?state=expanded` (optional) seeds one row as expanded on mount, useful for QA/screenshots.

This adds **zero** new routes and is removable in 5 minutes when real data lands. Inline `// TODO: ROADMAP §dashboard-demo-wiring` flags it.

### Demo data location

Mirrors the existing `lib/registry/data.ts` pattern:

```
apps/web/lib/dashboard/
├── demo.ts                       (workspaces, repos, branches, recent repos, current user)
├── types.ts                      (Workspace, RepoConnection, Branch, RepoSyncStatus, etc.)
├── time.ts                       (re-exports formatRelativeTimeShort if needed)
└── state.ts                      (client-side mock filter/expansion state)
```

Demo content is the same copy as the Pencil file (org/repo strings, branch names, timestamps, workspace names like "Acme", member counts).

---

## New components in /live (with paths)

```
apps/web/components/live/
├── dashboard-nav/                    (top nav: logo-slot, search, connect, avatar, theme toggle)
│   ├── dashboard-nav.tsx
│   ├── dashboard-nav.config.ts
│   ├── nav-search.tsx                (uses existing live/search-input style; ⌘K kbd; reuses shadcn command for palette in v2)
│   ├── nav-avatar.tsx                (shadcn Avatar; falls back to dusk-gradient placeholder)
│   └── index.ts
├── hero-card/                        (gradient vessel; primary + optional secondary CTA + optional list slot)
├── login-screen/                     (page-level composition; uses hero-card + auth-button)
├── auth-button/                      (variants: github | google; uses live/button as base; size=medium, fixed-look)
├── empty-state/                      (centered hero-card with primary "Connect a repo" + secondary "View a sample app" → /sample/components/main)
├── dashboard-page/                   (page composition: header, recent-repos, repo-list)
├── dashboard-list-header/            (title + count + filter-pills + sort)
├── filter-pills/                     (All / Personal / Team {name}; client-side filter)
├── section-label/                    (small uppercase header above grouped content)
├── list-container/                   (gray-surface primitive #f0f3f4, radius 18, padding 2, gap 2)
├── repo-row/                         (default | hover | expanded | syncing | failed | stale)
│   ├── repo-row.tsx
│   ├── repo-row.config.ts
│   └── index.ts
├── branch-row/                       (default | syncing | pinned | failed | stale)
├── other-branches-expander/          (lazy-load affordance under pinned branches; loading state)
├── workspace-chip/                   (personal | team | active)
├── workspace-popover/                (anchored to chip; member list + actions)
├── card-grid/                        (horizontal card grid behind Recent Repos + Workspace picker)
├── repo-card/                        (compact recent-repo card; one row can render highlighted via dusk-gradient or twilight-gradient)
├── recent-repos/                     (section-label + card-grid composition)
├── workspace-card/                   (radio-card for Connect step 3)
├── connect-repo-form/                (full form: installation → repo → workspace → footer)
│   ├── connect-repo-form.tsx
│   ├── step-installation.tsx
│   ├── step-select-repo.tsx
│   ├── step-assign-workspace.tsx
│   └── index.ts
├── status-chip/                      (companion to existing status-dot — adds Geist Mono label, wash background)
├── toast/                            (toast list + provider, mock timed triggers)
├── stale-viewer-banner/              (top-of-canvas banner; mock 30s trigger)
└── index.ts (barrel)
```

**Reuse from existing live/**:
- `live/button` (every Pencil button → closest variant; nav Connect = `variant="pop"` size="small" — dark fill, white text)
- `live/icon-button` (row hover actions: Open / Re-sync / Pin)
- `live/search-input` (NavSearch wraps or composes from it)
- `live/dark-mode/DarkModeTrigger` (nav theme toggle binds to this)
- `live/status-dot` (every status indicator)
- `live/section-header` (where appropriate; or new section-label for the smaller uppercase variant)
- `live/row` is **not** reused for repo/branch rows — Pencil's row primitive is structurally different (mono content, hover-revealed actions, expandable). New `repo-row` + `branch-row` components built from scratch but with the same motion tokens.

---

## Token bindings (no hardcoded values, except one gradient)

Every Pencil value maps to existing global tokens (verified all are present in `app/globals.css`):

| Pencil hex / value | Token |
|---|---|
| `#FFFFFF` | `var(--color-bg-primary)` or `var(--color-bg-elevated)` |
| `#F6F8F9` | `var(--color-bg-secondary)` |
| `#F0F3F4` | `var(--color-bg-tertiary)` |
| `#E8EBED` | `var(--color-border-primary)` |
| `#E1E4E5` | `var(--color-border-secondary)` |
| `#121111` | `var(--color-text-primary)` |
| `#6D6467` | `var(--color-text-secondary)` |
| `#9B9295` | `var(--color-text-tertiary)` |
| `#171719` (Pencil Connect button) | Use `variant="pop"` → resolves to `var(--color-text-primary)` (#121111) — within the ±5 hex tolerance the brief implies |
| radius `12` | `var(--radius-3)` |
| radius `14` | `var(--radius-3)` or `var(--radius-4)` (=16) — choose 3 to stay token-true; visual diff < 2px |
| radius `16` | `var(--radius-4)` |
| radius `18` | between r-4 (16) and r-5 (20) — bind to `var(--radius-5)` (closest); 2px tolerance |
| radius `40` (HeroCard) | **No matching token — do NOT invent one.** Inline-hardcode `border-radius: 40px` on HeroCard. Documented as the second hardcoded exception alongside the gradient. (Global rule: "Use the repo's existing tokens. Do not invent tokens or roles.") |
| spacing `12`, `16`, `20`, `24`, `28`, `32`, `40`, `48`, `64`, `120`, `200` | `var(--spacing-4..14)` — all already present |
| spacing `280` (page padding) | inline via `padding-inline: 280px` on the (dashboard) layout — not a system token, intentional |
| typography `Geist 11/500 uppercase ls 1` (section labels) | `.type-2` (10px) or `.type-3` (12px) with `text-transform: uppercase` + `letter-spacing: 0.05em` applied locally. Use `.type-3` for 12px parity. |
| typography `Geist 24/500` (login title), `Geist 16/500`, `Geist 14/500` etc. — Pencil sets weight 500 in many places | Type classes lock weight at 400. **Use Tailwind's `font-medium` utility** (already wired via `@theme inline`) on the element alongside the `.type-N` class. No new modifier class needed. |
| Pencil font `Ronzino` (on Nav-Connect-Label) | Treat as a Pencil internal placeholder. Renders as `font-sans` (Geist) — no-op. |
| `Geist Mono` for repo/branch/SHA | `font-mono` Tailwind utility (wired via `--font-geist-mono` in @theme) |
| HeroCard gradient (`#FFFFFF` 50% → `#F6F8F9` 100%, 180°) | **Hardcoded exception #1.** Express as `linear-gradient(180deg, var(--color-bg-primary) 50%, var(--color-bg-secondary) 100%)` — built from system colors, not tokenized as a gradient. |
| HeroCard border-radius `40` | **Hardcoded exception #2.** Inline `border-radius: 40px` on HeroCard root. |
| Avatar / ThemeToggle dark→cool-blue→cream gradient (placeholder fill) | `var(--gradient-dusk)` — already a system token |
| Status colors | `var(--color-tag-success-ink)`, `var(--color-tag-danger-ink)`, `var(--color-tag-info-ink)` + wash variants |

**No new tokens added.** Two inline hardcodes only, both on HeroCard (the gradient and the 40px radius). Every other Pencil value binds to an existing token.

---

## Icon mapping (every Pencil lucide → Carbon)

Carbon icons already registered (per `lib/icons/registry.ts`): `add`, `folder`, `folder-open`, `document`, `chevron-right`, `chevron-down`, `chevron-up`, `chevron-sort`, `search`, `overflow-menu-horizontal`, `trash-can`, `edit`, `branch`, etc.

**New registrations** needed in `lib/icons/registry.ts`:

| Pencil lucide | Carbon equivalent |
|---|---|
| `pin` (filled) | `Pin` |
| `pin` (ghost) | `Pin` (use stroke variant via styling) |
| `refresh-cw` (re-sync) | `Renew` |
| `loader-2` (spinner) | `CircleDash` (animated via CSS rotate) |
| `github` (auth button) | `LogoGithub` |
| `x-circle` / `close` | `CloseFilled` |
| `arrow-right` (Connect button) | `ArrowRight` |
| `more-horizontal` | `OverflowMenuHorizontal` ✓ already |
| `dot` | use `live/status-dot` (no icon needed) |

**Non-Carbon brand mark**: Google's "G" mark must be a real brand SVG (Pencil notes the current `globe` placeholder is wrong). Add `apps/web/public/SVGs/google-g.svg` (24×24, official brand mark from Google's identity guidelines). AuthButton (google variant) inlines it.

---

## Shadcn primitives — install via Context7

Already in `components/imports/shadcn/`: button, input, popover, separator, sheet, sidebar, skeleton, toggle, tooltip; Radix: toggle-group.

**Install via Context7** (per task brief):
- `avatar` — DashboardNav avatar + workspace-popover member list
- `command` — `⌘K` palette behind NavSearch (Pencil shows the kbd shortcut; the palette itself is v2 but the base primitive lands now)
- `dropdown-menu` — sort dropdown in DashboardListHeader
- `select` — workspace assignment + filter pills overflow (if pills exceed 3)
- `toast` (sonner via shadcn) — required for Toast component
- `dialog` — Connect Repo "Cancel" confirm + link-GitHub modal (Google user attempting connect)

Each install is a `pnpm dlx shadcn@latest add ...` invocation. Then wrap in `components/live/*` per the project's iron rule — no direct shadcn imports in app code.

---

## Motion (per Kowalski + existing patterns)

Mirror what's already in `live/sidebar-panel` + `live/canvas-controls`:

| Interaction | Pattern | Tokens |
|---|---|---|
| RepoRow expand → BranchRow reveal | `<AnimatePresence>` + `motion.div` with `{height: 0 → auto, opacity: 0→1, y: 20→0}`, ROW_SPRING (stiffness 350, damping 35) | matches sidebar-folder.tsx |
| Chevron rotate on expand | `motion.span` `animate={{rotate: expanded ? 90 : 0}}`, ROW_SPRING | matches row.tsx |
| Workspace popover open | Radix Popover with `--radix-popover-content-transform-origin`; scale `0.96 → 1` + opacity, 180ms ease-out | per Kowalski: origin-aware |
| Toast enter/exit | translate-y(8px) + opacity, 200ms enter / 160ms exit, EASE_OUT_SOFT | exit ~20% faster (Kowalski) |
| Stale-viewer-banner enter | slide down from top, 220ms ease-out | top of canvas |
| Hover-revealed row actions | opacity 0→1 + translate-x(4px → 0), 150ms ease | mirrors existing row hover affordances |
| Filter pill swap | clip-path transition for the active pill highlight (Stripe/Paco Coursey technique from Kowalski) | optional polish; default to plain bg transition |
| Connect button press | `whileTap={{scale: 0.97}}` — already in `live/button` | matches Kowalski's `:active` scale |

`@media (prefers-reduced-motion: reduce)`: all spring/easing/transform animations swap to opacity-only fades.

---

## Layout-by-layout breakdown

### `/login`
- `app/login/layout.tsx` — page bg `var(--color-bg-secondary)`, centers child via flex, no DashboardNav.
- `app/login/page.tsx` — `<LoginScreen />`.
- LoginScreen renders a HeroCard (width 480) with: Header (logo placeholder + title "Component Canvas" + subtitle "Live previews from your repo") + AuthList (GitHub button + Google button) + legal microcopy ("By signing in you agree to…").
- **AuthButton variant mapping** (closest match from existing button system, no exceptions):
  - `github` → `<Button variant="pop" size="medium" form="label" icon={<LogoGithub />} label="Continue with GitHub" />` — exact dark match (`pop` = `--color-text-primary` fill, white text).
  - `google` → `<Button variant="primary" size="medium" form="label" icon={<GoogleGSvg />} label="Continue with Google" />` — closest white-ish variant. **Visual delta to flag**: Pencil google button is pure white `#FFFFFF` with `#E1E4E5` border; `primary` resolves to `var(--color-bg-tertiary)` (#F0F3F4) fill with `var(--color-bg-secondary)` border (#F6F8F9). Visually softer/grayer than pure white, but the closest in-system match. Accepted under "no exceptions" — do not add a new variant.
- Logo gradient placeholder uses `var(--gradient-dusk)` until brand mark exists (per Pencil note).

### `/` (dashboard, populated by default)
- DashboardNav at top (60h sticky).
- Main scrollable area `padding-inline: 280px; padding-block-start: 120px;`.
- Children stacked: DashboardListHeader → RecentRepos → ListContainer holding RepoRow stack.
- RepoRow shows: chevron + Geist Mono `org/repo` + (hover-revealed Open / Re-sync / Pin icons) + Geist Mono `12m ago` + StatusDot + WorkspaceChip.
- One RepoRow seeded in hover state, one syncing, one failed, one stale to demonstrate states.
- Click chevron → row expands inline, revealing pinned BranchRows + OtherBranchesExpander. ROW_SPRING animation.
- Click WorkspaceChip → WorkspacePopover anchored.

### `/?state=empty` (dashboard empty)
- Same layout but main content is just a centered `<EmptyState>`.
- EmptyState renders HeroCard with: heading "No repos connected yet" + body copy + primary button "+ Connect a repo" → `/connect` + **secondary button** "View a sample component browser" → `/playground/specimens` (honors the user's literal pick; placeholder destination — flagged in ROADMAP for re-route when sample-repo flow lands).

### `/connect`
- DashboardNav at top.
- Main padding `40px 280px`.
- ConnectRepoForm panel (white surface, radius-4, 1px border-secondary) with 4 sections:
  1. Step Installation — radio-cards for GitHub installations
  2. Step Select Repo — ListContainer with repo rows (mono org/repo, selected gets `bg-secondary` + filled radio)
  3. Step Assign Workspace — CardGrid with WorkspaceCards (Personal + Team Acme; Acme highlighted by user click in demo)
  4. Footer — Cancel (→ `/`) + Connect repo (→ `/` and adds new RepoRow at top + Toast "Initial sync started")

### `/[workspace]/[repo]/[branch]`
- No DashboardNav.
- Renders existing AppShell directly (unchanged structure).
- InstanceBreadcrumb at top of sidebar (already shipped per recent commit) — stays MOCK-driven; rewiring already tracked in ROADMAP §Sidebar.

---

## Gaps surfaced from MD-vs-Pencil diff

| Found | Source | Handling |
|---|---|---|
| Empty-state secondary CTA ("View a sample app") | dashboard-build-plan §The dashboard (build plan adds it; Pencil only shows one CTA) | Added per user pick → links to `/playground/specimens` for now (placeholder; will re-route to a real sample-AppShell route once that exists) |
| "Try with a sample repo" CTA on first-login | architecture-brief §First-login and onboarding | Folded into the same secondary CTA above |
| "Open a shared instance" input on empty state | architecture-brief §First-login | **Deferred** — not in Pencil; user implicitly skipped via Q1; revisit when share links land |
| Blocking link-GitHub modal for Google-only users hitting Connect | dashboard-build-plan §Auth flow split | Build a `<LinkGitHubDialog>` shell using shadcn dialog; trigger commented out (no real auth state yet) — TODO in ROADMAP |
| Workspace popover content (member list, count, Manage members, Move to team) | dashboard-build-plan §Personal vs team affordance | Shipped with mock 3-member list |
| Stale-Viewer-Banner / Toast | Pencil v2 kit + architecture-brief §Stale viewer detection | Shipped with mock timed triggers, documented in ROADMAP §Dashboard for rewiring |
| Sort dropdown ("Last sync") on DashboardListHeader | Pencil v2 kit | Shipped as visual chip + dropdown-menu primitive; client-side mock sort |
| WorkspacePopover in Pencil only on expanded variant | Pencil context | Wired everywhere a chip exists |

---

## ROADMAP additions

Add new section to `apps/web/ROADMAP.md` (header convention matches existing sections; inline `// TODO:` cites the section title per the existing rule on line 3 of that file):

```
## Dashboard
- Demo-only: `lib/dashboard/demo.ts` hardcoded workspaces/repos/branches/timestamps → replace with Supabase fetch keyed off the signed-in user once auth lands.
- Demo-only: `/?state=empty` query-param toggle for the empty layout. Remove when real data drives the empty branch.
- Demo-only: Toast trigger fires 4s after dashboard mount. Replace with sync-event subscription on Supabase Realtime channel.
- Demo-only: Stale-Viewer-Banner timer (30s). Replace with `last_synced_commit_sha` change event on the instance channel (per architecture-brief §3 Stale viewer detection).
- Demo-only: ConnectRepoForm radio selection is purely client-state; no GitHub App fetch yet. Wire to the install-callback + list-installed-repos endpoints in `apps/api`.
- Demo-only: Empty-state secondary CTA points to `/playground/specimens` as a placeholder. Re-route to the real sample-AppShell flow when that exists.
- LinkGitHubDialog shell exists but never triggers — wire to the Google-user-hits-Connect flow once OAuth identities table is in place.
- Workspace popover's "Move to team", "Invite member", "Manage members" are visual only — no mutations yet.
- Filter pills (All / Personal / Team-{name}) filter client-side from hardcoded data — replace with workspace-scoped queries.
- Search input ⌘K opens a placeholder shadcn Command palette — populate with real repo/branch search once registry is wired.
- DashboardNav avatar binds to mock User from `lib/dashboard/demo.ts` — swap to Supabase Auth session user.
- HeroCard inline-hardcodes `border-radius: 40px` and a `linear-gradient(180deg, …)` (two values that have no matching token; system colors used inside). Revisit if a new radius token or gradient token is added.
- AuthButton "google" variant uses `Button variant="primary"` (closest in-system match). Visual delta vs Pencil pure-white: bg is `var(--color-bg-tertiary)` (#F0F3F4) rather than #FFFFFF. Accept until/unless a new dedicated variant is justified.
- Demo cosmetic: on `/[workspace]/[repo]/[branch]`, the existing AppShell's InstanceBreadcrumb still renders from `MOCK_INSTANCE` ("Acme · components · main") regardless of URL slug. Cosmetic mismatch on demo entries (e.g. `/sample/components/main` shows "Acme · components · main"). Already tracked under §Sidebar; surfaces here only when the empty-state secondary CTA points at a 3-segment URL.
```

Every demo-only line of code carries an inline `// TODO: ROADMAP §Dashboard — <bullet name>` comment so the cleanup pass is grep-able.

---

## Build order (within this single PR)

**Iron rule — every new component is preceded by a narrow Pencil read.** Before creating any file under `components/live/<name>/`, run `mcp__pencil__batch_get` with the specific node IDs for that component (e.g. RepoRow section + all its variant frames + the WorkspaceChip used inside it) and read every context comment in every layer. The earlier batch_get of the two top-level containers overflowed the token limit, so per-component narrow reads are mandatory. Skipping this step violates the task brief's first-line requirement.

**Confirmed component coverage** — an Explore agent extracted all 79 context comments from the top-level Pencil dump (132KB JSON). All 57 unique node names in the Pencil file map to the components listed in this plan. No missing components. Three call-outs from that extraction:

- **AuthButton naming bug**: Pencil frames `yA9R9` and `Nqeid` have their names swapped relative to their content (GitHub button named as Google, vice versa). Implementer must not trust the frame names — read the content + context to disambiguate.
- **Google G icon**: Pencil currently uses lucide `globe` as a placeholder. Real Google G brand mark must replace it (per the brief — and Google's brand guidelines are strict).
- **Consolidation opportunities flagged by Pencil itself** (do not over-abstract; only consolidate if the variance is small):
  - Single shared `RowList` / `RowBase` for RepoRow / BranchRow / ConnectRepoRow proportions are different enough that a base wrapper might cost more than it saves; default to **not** consolidating.
  - Shared `Card` + `CardGrid` for Recent Repos and ConnectRepo-Step3 — **yes**, both use the same primitive. CardGrid + RepoCard cover both, with workspace-card being a sibling variant.
  - Shared `SectionLabel` for all header text patterns — **yes**, ship one component.
  - Shared `HeroText` for title/subtitle pairs — **no**, keep inline; it's two text elements with no behavior to consolidate.

1. **Phase 0a — Copy this plan to the repo root.** Write `/Users/martinheneby/Documents/Cursor Projects/component-canvas/dashboard-implementation-plan.md` containing the verbatim content of this plan file. Single-shot copy; no edits.

2. **Phase 0b — Extract Pencil contexts + build node-ID inventory + write context map.** In this order:
   - Build a node-ID map per component (RepoRow, BranchRow, AuthButton, HeroCard, ListContainer, ConnectRepoForm, WorkspacePopover, FilterPills, DashboardListHeader, SectionLabel, CardGrid/RepoCard/WorkspaceCard, StatusChip, Toast, Stale-Viewer-Banner). This is the implementer's index for step-by-step `batch_get` during the build.
   - Run narrow `mcp__pencil__batch_get` calls per component (2–3 IDs each, readDepth 3) to fetch every context comment in every layer. Avoid the 132KB overflow by *not* asking for both top-level containers at once.
   - Write `/Users/martinheneby/Documents/Cursor Projects/component-canvas/dashboard-pencil-context-map.md`. Structure: a node-ID index at the top, then one `## ` H2 per component (DashboardNav, LoginScreen, Dashboard-empty, Dashboard-populated, Dashboard-expanded, ConnectRepo, HeroCard, ListContainer, CardGrid/RepoCard/WorkspaceCard, SectionLabel, FilterPills, StatusDot/StatusChip, WorkspaceChip, RepoRow, BranchRow, OtherBranchesExpander, DashboardListHeader, Toast/Stale-Viewer-Banner, WorkspacePopover, AuthButton, IconButtons), and the verbatim context comment(s) under each. This MD becomes the implementer's source of truth for every subsequent component build.
   - If any Pencil node name surfaces here that isn't covered by the components in this plan, stop and flag it before continuing.
3. **Scaffold** — `app/page.tsx` is **deleted**; route group `(dashboard)` created with layout + page + connect/page. Move existing AppShell render to `app/[workspace]/[repo]/[branch]/page.tsx`. Create `app/login/{layout,page}.tsx` placeholders. No new tokens added.
4. **Icons + brand SVG** — Register new Carbon icons in `lib/icons/registry.ts`. Candidate names: `Pin`, `Renew`, `CircleDash` (spinner — substitute the closest available if this isn't an exact export), `LogoGithub`, `CloseFilled`, `ArrowRight`. **Verify each name** before registering: `grep -l "export.*<Name>" apps/web/node_modules/@carbon/icons-react/lib` (or the package's `index.d.ts`). Substitute with the closest existing export if any name doesn't resolve. Add `public/SVGs/google-g.svg` (official Google G mark — fetch from Google's brand-resource guidelines).
5. **shadcn primitives** — Install via Context7 + `pnpm dlx shadcn@latest add ...`: `avatar`, `command`, `dropdown-menu`, `select`, `dialog`, `sonner`. Confirm each lands in `components/imports/shadcn/`. Never imported in app code; wrapped in `components/live/*`.
6. **Demo data** — `lib/dashboard/{types.ts, demo.ts, state.ts}` with the same copy as Pencil.
7. **Atomic components** (each preceded by its narrow Pencil read) — status-chip, workspace-chip, section-label, filter-pills, list-container, card-grid, repo-card, recent-repos, workspace-card.
8. **Composite components** — auth-button, hero-card, empty-state, login-screen.
9. **Row primitives** — repo-row (all 5 states), branch-row (all states), other-branches-expander, workspace-popover, dashboard-list-header.
10. **Page compositions** — dashboard-page (populated + empty branch from `?state=empty`), connect-repo-form + page.
11. **Nav** — dashboard-nav (search, connect, avatar, theme toggle); wire into `(dashboard)/layout.tsx`.
12. **Demo wiring** — Toast provider + mock 4s trigger; Stale-Viewer-Banner + mock 30s trigger.
13. **ROADMAP** — Append the §Dashboard section (full text below).
14. **Visual QA** — Dev server up; compare every Pencil frame against the rendered route. Toggle dark mode. Verify `?state=empty`. Verify AppShell still works at any 3-segment URL (e.g. `/sample/components/main`). Verify `/playground/specimens` still works (now also reachable via the empty-state secondary CTA). Verify keyboard nav (Tab through nav, ⌘K opens command primitive, Enter expands rows).

---

## Critical files modified or created

**Deleted**:
- `apps/web/app/page.tsx` (content moves to `app/(dashboard)/page.tsx`)

**Modified**:
- `apps/web/lib/icons/registry.ts` (register new Carbon icons)
- `apps/web/ROADMAP.md` (append §Dashboard section)
- `apps/web/components.json` (if shadcn install touches it; baseline alias config likely unchanged)
- `apps/web/app/globals.css` — only if a shadcn install adds tokens it depends on; we add **zero** new dashboard tokens ourselves.

**Created** (representative — actual count ~40 files):
- `apps/web/app/(dashboard)/layout.tsx`
- `apps/web/app/(dashboard)/page.tsx`
- `apps/web/app/(dashboard)/connect/page.tsx`
- `apps/web/app/login/layout.tsx`
- `apps/web/app/login/page.tsx`
- `apps/web/app/[workspace]/[repo]/[branch]/page.tsx`
- `apps/web/components/live/dashboard-nav/*` (component + config + sub-components)
- `apps/web/components/live/hero-card/*`
- `apps/web/components/live/login-screen/*`
- `apps/web/components/live/auth-button/*`
- `apps/web/components/live/empty-state/*`
- `apps/web/components/live/list-container/*`
- `apps/web/components/live/repo-row/*`
- `apps/web/components/live/branch-row/*`
- `apps/web/components/live/other-branches-expander/*`
- `apps/web/components/live/workspace-chip/*`
- `apps/web/components/live/workspace-popover/*`
- `apps/web/components/live/filter-pills/*`
- `apps/web/components/live/dashboard-list-header/*`
- `apps/web/components/live/section-label/*`
- `apps/web/components/live/card-grid/*`
- `apps/web/components/live/repo-card/*`
- `apps/web/components/live/recent-repos/*`
- `apps/web/components/live/workspace-card/*`
- `apps/web/components/live/connect-repo-form/*` (4 sub-files)
- `apps/web/components/live/status-chip/*`
- `apps/web/components/live/toast/*`
- `apps/web/components/live/stale-viewer-banner/*`
- `apps/web/lib/dashboard/{types.ts, demo.ts, state.ts}`
- `apps/web/public/SVGs/google-g.svg`

---

## Verification

End-to-end after implementation:

1. `pnpm --filter web dev` from repo root. Hit `http://localhost:3000`.
2. Visit `/login` — see HeroCard with GitHub + Google buttons; no DashboardNav.
3. Visit `/` — see populated dashboard with DashboardNav + DashboardListHeader + RecentRepos + RepoRow stack with all 5 state demos.
4. Click a RepoRow chevron — row expands with spring, BranchRows + OtherBranchesExpander reveal.
5. Click a WorkspaceChip — popover anchors above the chip with member list.
6. Visit `/?state=empty` — see EmptyState HeroCard with two CTAs.
7. Click "View a sample component browser" → lands on `/playground/specimens` (existing specimen gallery).
8. Click "+ Connect a repo" → `/connect` form with all 4 sections; select installation + repo + workspace; click Connect repo → redirects to `/` with new row at top of list + Toast.
9. Toggle theme via nav ThemeToggle — every dashboard surface re-skins via the existing dark-mode tokens.
10. After ~4s of dashboard load — a mock Toast appears bottom-right ("New version available — refresh").
11. After ~30s — Stale-Viewer-Banner appears at top of canvas. Both dismissible.
12. `/playground/specimens` still works untouched.
13. Hit any 3-segment URL like `/sample/components/main` — the existing AppShell renders unchanged (sidebar + InstanceBreadcrumb mock data + canvas). Route params accepted but unused; AppShell shows the demo registry.
14. No console warnings; lighthouse a11y > 95; `prefers-reduced-motion: reduce` collapses animations to opacity fades.
15. Grep for `// TODO: ROADMAP §Dashboard` confirms every demo-only call site is traceable.
