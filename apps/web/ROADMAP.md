# apps/web — frontend roadmap

Follow-ups tracked here. Inline `// TODO:` in source cites the section by title.

## Dashboard
- Demo-only: `lib/dashboard/demo.ts` hardcoded workspaces/repos/branches/timestamps → replace with Supabase fetch keyed off the signed-in user once auth lands.
- Demo-only: `/?state=empty` query-param toggle for the empty layout. Remove when real data drives the empty branch.
- Demo-only: Toast trigger fires 4s after dashboard mount. Replace with sync-event subscription on Supabase Realtime channel.
- Demo-only: Stale-Viewer-Banner timer (30s). Replace with `last_synced_commit_sha` change event on the instance channel (per architecture-brief §3 Stale viewer detection).
- Demo-only: ConnectRepoForm radio selection is purely client-state; no GitHub App fetch yet. Wire to the install-callback + list-installed-repos endpoints in `apps/api`.
- Demo-only: Empty-state secondary CTA points to `/playground/specimens` as a placeholder. Re-route to the real sample-AppShell flow when that exists.
- LinkGitHubDialog shell not yet built — wire to the Google-user-hits-Connect flow once OAuth identities table is in place.
- Workspace popover's "Move to team", "Invite member", "Manage members" are visual only — no mutations yet.
- Filter pills (All / Personal / Team-{name}) filter client-side from hardcoded data — replace with workspace-scoped queries.
- Search modal lives in `live/search-modal/`. Replace `useRecentRepos` + `useRepoSearch` demo hooks with Supabase queries; add branch-row support once GitHub App branches land.
- DashboardNav avatar binds to mock User from `lib/dashboard/demo.ts` — swap to Supabase Auth session user.
- HeroCard inline-hardcodes `border-radius: 40px` and a `linear-gradient(180deg, …)` (two values that have no matching token; system colors used inside). Revisit if a new radius token or gradient token is added.
- AuthButton "google" variant uses `Button variant="primary"` (closest in-system match). Visual delta vs Pencil pure-white: bg is `var(--color-bg-tertiary)` (#F0F3F4) rather than #FFFFFF. Accept until/unless a new dedicated variant is justified.
- Connect repo Cancel button is inlined in `connect-repo-form.tsx` — Pencil shows fill #FFFFFF + 1px stroke #E1E4E5 + 14/500 #121111 text. The closest `Button` variant (`secondary`/`tertiary`/`ghost`) doesn't match: secondary is filled gray, tertiary has a dark border, ghost has no border. Revisit if a "stroked light-button" variant is introduced.
- DarkModeTrigger renders a 36×36 `var(--gradient-dusk)` placeholder — no sun/moon glyph. Pencil intentionally shows the gradient placeholder. Replace with the real glyph asset once it lands; until then the toggle remains clickable but visually identical to NavAvatar.
- StaleViewerBanner is positioned absolutely with hardcoded `top: 60 + 16, left: 280, right: 280` to mirror the (dashboard) layout's `paddingInline: 280` + nav 60h. If layout chrome dimensions change, both must move together. Cleaner option: lift those numbers to layout-level CSS variables.
- Toast uses `sonner.toast.custom()` with `unstyled: true` so the dark pill renders fully via the `<ToastBody>` component. If sonner's swipe-to-dismiss / stack behaviour misbehaves, swap to a custom Headless toast queue.
- DEMO_AVAILABLE_REPOS now carries an `alreadyConnected` flag (true for `acme/components-internal` only) so the ConnectRepoRow disabled state has data to render. Replace with the GitHub-installed-repo intersection query once that ships.
- `synthesizeUnpinnedBranches` (in `lib/dashboard/demo.ts`) generates fake branch names + SHAs for the OtherBranchesExpander reveal. Replace with the real branch enumeration backed by GitHub App once `useInstanceBranches(repoId)` lands.
- Login screen brand is an inline pill (small dusk-square + "Component Canvas" wordmark) rather than the EmptyState icon-tile. Two distinct brand-mark surfaces today; consolidate into a single `<BrandMark variant=…>` if a third surface lands.
- Round 2 corrections: gray-surface containers (RecentRepos, ListContainer, StepSelectRepo's repo list, StepAssignWorkspace) no longer carry a 1px border — Pencil's stroke has no fill and renders invisible. Text Holder labels are now bare flex containers with padding only (no fill, no radius, no border) — they share visual identity with the gray surrounding surface. If a future divider is needed, reintroduce border-secondary deliberately.
- Row borders are removed: RepoRow, BranchRow, OtherBranchesExpander no longer get a 1px stroke on hover or expanded state. Background change carries the affordance. OtherBranchesExpander retains the white `bg-elevated` fill while expanded so it reads as "lifted" inside the gray RepoList.
- ConnectRepoRow accepts a per-instance `selectedBackground` override. The /connect repo picker passes `var(--gradient-twilight)` per user direction (Pencil shows plain `#F6F8F9` selected; the override is intentional, scoped only to that surface).
- Button gained a single `borderColor` override prop. Cancel button on /connect uses `variant="ghost"` + `borderColor="var(--color-border-secondary)"` to match Pencil's #E1E4E5 stroke without filling out a new variant. Avoid using this prop elsewhere — it should be a one-off escape hatch.
- ConnectRepoCrumb now wraps `Button variant="text-link" size="small"` instead of inlining a `<Link>`. Visual delta from Pencil: text inherits `text-primary` instead of #6d6467, and icon inherits `text-primary` instead of #9b9295. If the user pushes back, add a `color` override to Button (mirror the `borderColor` extension).
- Connect repo submit button uses `<GithubMark>` (the same React component used by AuthButton) instead of Pencil's `lucide plug` icon — explicit user direction since it ties the action to GitHub authorization.
- StaleViewerBanner gained a dismiss (X) button on the right of Refresh — Pencil only shows Refresh, but user requirement is escape-without-reload. Banner text + refresh-pill colors are hardcoded literals (`#121111`, `#FFFFFF`) rather than `var(--color-text-primary)` / `var(--color-bg-primary)` because `--color-tag-warning-wash` doesn't dark-flip; using tokens that do flip would render white text on cream in dark mode.
- DashboardNav sits flush (no border-bottom). A 24px-tall gradient fade sits as a sibling in the layout (`absolute; top: 60`) so scrolled main content dissolves under the nav rather than slamming a hard edge. Z-index 1 — below StaleViewerBanner (z-index 10) and pointer-events: none.
- Round 3 corrections:
  - `WorkspaceCard` strips its border in all states; selected = `var(--gradient-twilight)` regardless of personal/team. Pencil only shows team-selected with the gradient; we apply the same active-state language to personal-selected too.
  - `ConnectRepoRow` no longer accepts a custom `selectedBackground` override at the call site — Pencil's `#F6F8F9` selected fill is the canonical state. (The earlier round-2 twilight override was reverted at user request.)
  - Text Holder labels (`recent-repos`, `step-assign-workspace`) now align `flex-start` instead of `center` so the section text begins at the left edge of the gray container.
  - `ConnectRepoCrumb` wraps the Button in a `<div style={{alignSelf: flex-start}}>` to prevent the parent flex column from stretching it. shadcn's `buttonVariants` base classes include `justify-center`, which would otherwise center the back-link text across the page.
  - `RecentRepos` cards are now whole-card `<Link>`s — the inner "Open Repo" trailing element is a styled `<span>` (not separately a link, avoids invalid nested `<a>`). `cursor: pointer` set explicitly.
  - Single-row expansion: `expandedRepoId: string | null` replaces `expandedRepoIds: Set<string>`. Clicking a different RepoRow closes the previously-open one. Provider prop renamed to `initiallyExpandedRepoId`.
  - Expansion motion bumped from `y: 12` → `y: 20` to match `sidebar-folder.tsx` exactly. Same `ROW_SPRING` transition.
  - `BranchRow` gained `noHoverBackground` and `onHoverChange` props, plus `forwardRef`. The rows revealed under `OtherBranchesExpander` use these to opt out of per-row bg changes; a single traveling pill (animated `motion.div` with `ROW_SPRING`) carries the hover affordance instead — same mechanic as `SidebarHighlightLayer`. Pill bg = `--color-bg-elevated` so the hovered row pops white against the gray expander surface.
- Demo cosmetic: on `/[workspace]/[repo]/[branch]`, the existing AppShell's InstanceBreadcrumb still renders from `MOCK_INSTANCE` ("Acme · components · main") regardless of URL slug. Cosmetic mismatch on demo entries (e.g. `/sample/components/main` shows "Acme · components · main"). Already tracked under §Sidebar.

## Backend / Registry
- Replace `lib/registry/data.ts` (DEMO-ONLY) with a real registry backed by the API: workspace manifest fetch, repo-connect, or uploaded source.
- Swap the in-memory mutation path in `SidebarActions` for server mutations.
- Replace `ImportDialog` stub form with the real import pipeline (link registry, workspace package, or uploaded source).
- Persist `expandedIds` + selection outside URL (currently URL-only via `?component=`).
- OAuth + workspace model; real avatar via `User.avatarUrl`.
- Branch enumeration + sync status surface for `BranchSummary` (id, name, pinned, status, lastSyncedAt) — required by the InstanceBreadcrumb dropdown. `status` derives from the build worker's `last_build_status` column on the instance row.

## Sidebar
- InstanceBreadcrumb wiring: replace `MOCK_INSTANCE` in `sidebar-header-zone.tsx` with route-derived data once `/[workspace]/[repo]/[branch]` exists. Use `useParams` from `next/navigation`, fetch branch list via a new `useInstanceBranches(repoId)` hook backed by Supabase + GitHub App API. `onSwitchBranch(id)` should `router.push("/[workspace]/[repo]/" + branchName)`.
- InstanceBreadcrumb branch search: today the dropdown filters the local pinned-branches list client-side. Wire `onSearchBranches` to a debounced server call so unpinned branches that match the query also surface.
- InstanceBreadcrumb "Other branches…" link: lazy-loads unpinned branches from GitHub on click. Wire `onLoadOtherBranches` to the same backend endpoint as branch search; merge results below the divider.
- 64px icon-only collapsed mode (deferred in v1 — width is fixed at 280).
- Virtualize the component tree once it grows past ~200 rows (react-virtual or hand-rolled).
- Drag-to-reorder folders / leaves (@dnd-kit) and drag-to-move across sections.
- Share / export current selection.
- Multi-team switcher popover content (currently stubbed).
- Hide-from-sidebar UX is one-way today: docs (and now top pages) can be hidden via their `...` menu, but once hidden the menu is hidden with them, so there is no in-sidebar control to bring them back. `actions.unhideDoc` exists but has no trigger. Needs a "Hidden items" affordance — maybe a collapsible "Hidden" group at the bottom of the sidebar, or a settings surface that lists `hiddenDocIds` with restore buttons.
- Folder rename / delete UI: folder rows have no hover affordance after the "..." removal. Design a "manage folders" view reachable from the section header `+` popover, and/or Figma-style click-into-rename on the folder label. Until then, renaming only works on newly-created empty folders (auto-triggered inline rename); deletion has no UI path.

## Playground
- Replace the `/playground` route with a proper dev toolbar once we have more than 10 systems. `/playground` is a temporary review surface, not a product feature.

## Motion
Token system (`--ease-*`, `--duration-*`) and traveling sidebar pill are in place. Still to do:
- Canvas content swap on selection change: `AnimatePresence mode="wait"` keyed by `selectedId`, fade + subtle y-slide using `--duration-base` + `--ease-out-soft`. Pairs with the sidebar's active pill so selection feels continuous across the app.
- Add-menu popover + import-dialog open/close: adopt `--duration-fast` + `--ease-out-soft`, origin-aware scale from trigger (Radix exposes `--radix-*-content-transform-origin`). Keep exits ~20% faster than entries per Kowalski.
- Sidebar shell mount: one-shot fade + y-slide on first paint (low priority).
- Review curves after a day of use — motion always reads better while building than the morning after.

## Canvas
Three-layer scaffold (Viewport → Stage → Overlays), dotted background, pan + zoom-at-cursor, space+drag, middle-button drag, keyboard shortcuts (⌘0 reset, ⌘1 fit, ⌘± zoom) and fit-to-content selection snap are all in place. Remaining:
- Size-aware fit margin: 24% flat margin today (`FIT_MARGIN` in `canvas-view-context.tsx`). Small components scale to fill too aggressively; a tiny button should stay small and sit in more air, a page flow should fit tight. Needs a bbox → margin function, likely with a max effective zoom and a min air threshold.
- Overlay-vs-stage placement for control panels: **resolved for v1 as viewport-edge** (32px offsets on the overlays layer, panels never scale with zoom). v2 to explore stage-projected anchoring so panels can track the rendered component's bbox without inheriting the zoom transform — see `// TODO(canvas-controls anchoring v2)` in `canvas-controls.tsx`.
- Real content bbox from manifest preview: now measured live via `ResizeObserver` for manifest-backed leaves; mock-table fallback remains for unmatched ids. Swap mock fallback for measured bbox once the iframe import pipeline ships.
- Viewport resizing: preset breakpoints (mobile/tablet/desktop) + free-form handle.
- Minimap overlay.
- Slot-aware properties panel: today the Slots section just shows "Set / Empty"; needs a real slot picker once a component with slots is registered.
- Properties panel: expand the "State" block from a JSON dump into per-prop editable inputs once the manifest declares slot/text content props.
- Size selector hover hint: currently the "expand" affordance uses Carbon's `Maximize` glyph as a temporary stand-in for the pen's custom box-arrows icon — swap when a closer Carbon match (or custom SVG) is available.
- Docs overlay (MDX panel in screen-space).
- Velocity-based inertial pan after flick gestures (current pan stops instantly on release).
- Zoom range review: tightened to 0.5–2x (was 0.1–4x); pan keeps 50% of the bbox visible (was 20%). Reconfirm after a week of dogfooding.

## Component rendering / import pipeline
- Sandboxed iframe host (`sandbox="allow-scripts"` + CSP + narrow `postMessage` protocol).
- Build strategy decision: workspace package build vs in-browser `esbuild-wasm` / `swc-wasm` vs link registry.
- Metadata manifest schema (id, title, folder path, variants[], states[], docs, props schema, thumbnails).
- Variant / state switching via `postMessage` (props update, not iframe reload).
- Theme switching protocol.
- Size updates (when the canvas resizes the inner preview surface).
- Error isolation (preview crash ≠ host crash).

## Backend / persistence
- Manifest storage and sync.
- Share URLs / permalinks.
