# Migrate usemount.dev from demo to live (Steps 0 → 5)

## Context

The frontend is feature-complete at the UI/styling layer but runs entirely on hardcoded demo data. The architecture is fully locked in `architecture-brief.md` and `dashboard-build-plan.md` — an 8-step build sequence, Supabase + Railway + GitHub App, ephemeral builds, react-docgen-typescript manifest generation. None of the external infra is provisioned, none of the backend is wired. The migration replaces demo data sources with live ones following the existing plan, with the cutline at **end of Step 5 (Robust MVP)** — a real repo connectable, real sync running, manifest auto-generation honest enough for the first two real clients (Persona A/C).

Two things the user named are already resolved in the docs:
- **The "install something into customer git"** = a GitHub App (`usemount.dev`) customers install per-repo. **No package goes into customer code.** Optional `mount.config.ts` at repo root is config only.
- **Supabase** is the chosen data layer (auth, Postgres, Storage, Realtime, RLS). No second decision is needed.

The `/playground` route is a dev-only component gallery (10 specimen files), not the app shell. The real app shell is at `/[workspace]/[repo]/[branch]`. Playground stays for internal review but never ships to prod.

---

## Current state — assessment

| Layer | Status | Notes |
|---|---|---|
| Frontend UI/styling | ✅ ~85% | Sidebar, canvas, props panel, login, dashboard, connect, breadcrumb — all built |
| Token system | ✅ 100% | `apps/web/app/globals.css` complete |
| Manifest contract | ✅ 100% | `apps/web/lib/registry/manifest-types.ts` is the live shape |
| Demo data | 🟡 In place | `lib/dashboard/demo.ts` + `lib/registry/data.ts` — to be replaced |
| Step 1 (mock dashboard) | ✅ ~done | All routes exist with mock data |
| Backend (`apps/api`) | ⚠️ Stub | Only `/health`. Hono skeleton ready |
| `packages/shared` | ⚠️ Empty | `export {}` — needs shared types |
| External infra | 🚫 None | Supabase, GitHub App, Railway not provisioned |
| Auth | 🚫 None | No `@supabase/supabase-js`, no OAuth wiring |
| Build pipeline | 🚫 None | The big Step 4 work |

---

## Plan

### Step 0 — Provision external infra (small, blocking)

Manual, one-time. Do before any backend code lands.

1. **Supabase project**: create at supabase.com. Enable Auth (GitHub + Google providers), Postgres, Storage, Realtime, RLS. Capture URL + anon key + service-role key.
2. **GitHub App**: register at github.com/settings/apps. Name "usemount.dev". Permissions: `contents: read`, `metadata: read`, `pull_requests: read`. Webhook events: `push`, `installation_repositories`, `repository`. Generate private key. Set webhook URL (Railway URL placeholder, update post-deploy).
3. **Railway project**: create at railway.app. Two services from this monorepo: `apps/web` (Next.js) and `apps/api` (Hono). Connect to GitHub repo for auto-deploy.
4. **Env files**: add `.env.local` to `apps/web` and `apps/api` (gitignored). Add `.env.example` (committed) listing every key without values. Update `apps/api/src/index.ts` to require the keys it needs at boot.
5. **CI/deploy hardening** (do when the first `.github/workflows/*` lands — the repo has none today): no `pull_request_target` running checkout'd PR code; pin third-party actions by full commit SHA, not tag; least-scope `GITHUB_TOKEN` / OIDC, no long-lived cloud creds in workflow env; enable GitHub Actions cache scoping. This closes the exact "Mini Shai-Hulud" (May 2026) vector — it was CI Pwn-Request + cache poisoning, not malicious packages. Dependency side is already hardened: `pnpm-workspace.yaml` sets `minimumReleaseAge: 10080` (7-day quarantine) + `blockExoticSubdeps`, and `onlyBuiltDependencies` gates install scripts. Railway is self-hosted, so before this cutover confirm `next` ≥ 16.2.6 (SSRF CVE-2026-44578 / middleware-bypass fixes are self-hosted-only) and keep it patched.

**Verification**: `pnpm dev` boots both apps without env errors. `curl <api-url>/health` returns ok. Supabase dashboard shows the project. GitHub App page shows the registered app.

---

### Step 1.5 — Pre-migration cleanup (small)

Done in one PR before Step 2.

1. **Gate `/playground` to dev only**: in `apps/web/app/playground/page.tsx`, return `notFound()` when `process.env.NODE_ENV === 'production'`. Same for `/playground/specimens/*` if any have their own pages. Verify a prod build (`pnpm build && pnpm start`) returns 404 on the route.
2. **Wire route params on AppShell page**: `apps/web/app/[workspace]/[repo]/[branch]/page.tsx` currently mounts AppShell with the demo registry and ignores `params.workspace`, `params.repo`, `params.branch`. **In Next.js 16 `params` is a Promise** — read them with `const { workspace, repo, branch } = await params`. Same applies to every route handler that reads `params`, `cookies()`, `headers()`, `searchParams`. Check `node_modules/next/dist/docs/` before writing (per `AGENTS.md`). Pass params down to AppShell as an `instance` prop. **Don't fetch yet** — just thread params through so Step 3 can drop the fetch in.
3. **Archive ephemeral planning docs**: move `Initial task research + app shell layout.md` to `docs/archive/` (or `.archive/`). Leave `architecture-brief.md` and `dashboard-build-plan.md` at root through Step 5; consolidate after.
4. **Disable empty-state secondary CTA until Step 5+**: `dashboard-page/empty-state.tsx` secondary CTA currently points to `/playground/specimens`. The "Try with sample" flow needs a public `usemount.dev/sample-components` repo (decision deferred past Step 5 per `dashboard-build-plan.md` Open Decision #2). Hide the CTA entirely for now rather than ship a known-broken affordance — re-enable it once the sample repo is content-complete.

**Verification**: prod build 404s on `/playground`; AppShell page logs params on mount; archived doc no longer at root.

---

### Step 2 — Auth + Supabase wired (small-medium)

Replace mock auth + mock dashboard data with real Supabase reads. Per `dashboard-build-plan.md` Step 2.

1. `pnpm --filter web add @supabase/supabase-js`. Create `apps/web/lib/supabase/client.ts` (browser) and `apps/web/lib/supabase/server.ts` (server-side, for route handlers / RSC).
2. **Move `ComponentManifest` to `packages/shared` first.** Currently lives in `apps/web/lib/registry/manifest-types.ts`. Once `apps/api`'s build worker emits manifests (Step 4.2), it cannot depend on `apps/web`. Move the file to `packages/shared/src/manifest.ts`, re-export from the old path to keep frontend consumers unbroken. Same destination receives `Workspace`/`Repo`/`Branch`/`User` types extracted from `lib/dashboard/demo.ts` later in this step.
3. **OAuth wiring**: `/login` page's two buttons → `supabase.auth.signInWithOAuth({ provider: 'github' | 'google', options: { redirectTo: '/' } })`. Add `/auth/callback/route.ts` to exchange the code and redirect to `/`. Route handler uses `await cookies()` (Next 16).
4. **Postgres schema**: SQL migration creating `users`, `oauth_identities`, `workspaces`, `workspace_members`, `repo_connections`, `instances`, `component_manifests`, `build_jobs`, `share_links` per `architecture-brief.md` §2. RLS policies: members can read their workspace's rows; only owners can mutate. Save migration in `apps/api/sql/0001_init.sql` (or `supabase/migrations/`). **Telemetry from day one** (architecture brief decision #15): `build_jobs.build_duration_ms` column, plus a `component_views` table (instance_id, manifest_id, viewer_user_id, viewed_at) appended on every manifest load. No UI yet — just data accumulating so cost/usage shape is visible before pricing decisions.
5. **OAuth identity bookkeeping**: on Supabase `auth.users` insert, trigger inserts a `users` row + an `oauth_identities` row capturing `(provider, provider_user_id)` from the OAuth payload. This row is **the seam** that Step 3 uses to match GitHub App installation events back to a user — verify the `provider_user_id` (GitHub numeric user id, not login) is captured, not just the email.
6. **Refactor demo hooks, preserve their API**:
   - `apps/web/hooks/use-recent-repos.ts` → call Supabase `from('repo_connections').select(...)` instead of returning `DEMO_REPOS`. Keep hook signature.
   - `apps/web/hooks/use-repo-search.ts` → debounced Supabase query. Keep signature.
   - `apps/web/lib/dashboard/state.tsx` (`DashboardStateProvider`) → fetch workspaces/repos on mount via Supabase. Pattern stays — only the data source changes.
   - `apps/web/components/live/dashboard-nav/nav-avatar.tsx` → bind to `supabase.auth.getUser()` instead of `MOCK_USER`.
7. **Auto-create personal workspace on signup**: Supabase Postgres trigger on `auth.users` insert → insert row into `workspaces` with `kind='personal'` + matching `workspace_members` row.
8. **Delete demo data**: once hooks call Supabase, remove `apps/web/lib/dashboard/demo.ts` and the `?state=empty` query-param toggle. Types moved to `packages/shared` in step 2 above.

**Verification**: log out / log in via GitHub and Google works. New user lands on empty dashboard. Supabase dashboard shows the user row + auto-created personal workspace. `useRecentRepos` returns `[]` for a fresh user. Filter pills filter against real rows. No grep hits on `DEMO_REPOS` / `MOCK_USER` in `apps/web/`.

---

### Step 3 — GitHub App + repo connections (medium)

Connect flow becomes real. Per `dashboard-build-plan.md` Step 3.

1. **`apps/api` endpoints** (Hono routes):
   - `POST /github/install-callback` — receives GitHub App install redirect. **User matching**: payload contains `installation.account.id` (GitHub numeric user id). Look up the user via `SELECT user_id FROM oauth_identities WHERE provider='github' AND provider_user_id = $1`. No match → stash the install in a `pending_installations` row keyed on the GitHub user id, surface a "link GitHub identity" prompt next time that GitHub identity signs in. With match → persist `repo_connection` rows for selected repos.
   - `GET /github/installations/:userId` — lists repos the user's GitHub identity can see.
   - `POST /repo-connections` — given an install + repo + workspace, creates the connection. **Default-pin branches** on create: `main` plus any branches matching the globs `feat/*` and `release/*` (per `dashboard-build-plan.md` Open Decision #4). User can curate after.
   - `GET /repos/:repoId/branches` — fetches branches via GitHub App installation token. Used by InstanceBreadcrumb dropdown.
2. **GitHub App auth helper**: `apps/api/src/github/auth.ts` — generates JWT from app private key, exchanges for installation token. Use `@octokit/auth-app` or hand-roll.
3. **Frontend connect flow**: `apps/web/components/live/connect-repo-form/connect-repo-form.tsx` → POST to `/repo-connections` instead of demo client-state. Redirect to `/[workspace]/[repo]/main` on success.
4. **`useInstanceBranches(repoId)` hook** (new, per ROADMAP): call `GET /repos/:repoId/branches`. Replace `MOCK_INSTANCE` in `apps/web/components/live/sidebar-panel/sidebar-header-zone.tsx`.
5. **AppShell fetches its instance**: `[workspace]/[repo]/[branch]/page.tsx` now calls Supabase to load the `instance` row + manifest list (empty for now). Sidebar renders an empty tree with a "first sync hasn't run yet" empty-state until Step 4 lands.
6. **Webhook handlers for lifecycle events**: `installation_repositories.removed`, `repository.archived`, `repository.renamed` — handlers in `apps/api/src/github/webhook.ts`. Mark connections as inactive. (Per architecture brief §11.)

**Verification**: log in, click "+ Connect new repo", install the GitHub App on a test repo, select a repo, see it appear in the dashboard. Click into it → AppShell renders with empty sidebar + "First sync running" state. Branch dropdown shows real branches. Uninstall the app → connection marked inactive.

---

### Step 4 — First end-to-end sync (large, the bottleneck)

The hard step. Per `dashboard-build-plan.md` Step 4 + `architecture-brief.md` §3.

**Step 4.0 — Day-1 spike (do first)**: write a 200-line standalone Node script (`apps/api/scripts/spike.ts`) that:
1. Clones this usemount.dev repo to `/tmp`.
2. Runs `react-docgen-typescript` on `apps/web/components/live/button/`.
3. Runs esbuild on the same file.
4. Prints the manifest JSON + reports bundle size + duration.

Then run it on one real customer codebase (the 700-person Persona C target). The output decides whether the architecture holds or needs incremental builds / worker farm sooner.

**Step 4.1 — Webhook receiver**: `POST /github/webhook` in `apps/api`. **HMAC signature verification is required, not optional** — without it, anyone with the webhook URL can forge `push` events and trigger arbitrary builds. Use `@octokit/webhooks` or `crypto.timingSafeEqual` against `x-hub-signature-256` with the app's webhook secret. Reject any request that fails verification with 401 before parsing. On verified `push`, insert a `build_jobs` row with `status='queued'` — that's the whole queue (see 4.2).

**Step 4.2 — Build worker**: **`build_jobs` is the queue.** No BullMQ, no Redis, no in-memory queue — Railway redeploys would lose them. Worker loop in `apps/api/src/build/worker.ts`:
```
UPDATE build_jobs SET status='running', leased_at=now(), worker_id=$me
WHERE id = (
  SELECT id FROM build_jobs
  WHERE status='queued' AND (leased_at IS NULL OR leased_at < now() - interval '10 min')
  ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED
) RETURNING *;
```
Heartbeat `leased_at` while running; a stale lease (>10min) is reclaimable. On success: `status='succeeded'`, `build_duration_ms` written. On failure: `status='failed'`, `error` populated.

Per-job worker:
1. Resolve install token → shallow-clone repo at the pushed commit to a tmpfs sandbox.
2. Detect components dir + globals.css. Try `mount.config.ts` first; fall back to `src/components`, `components`, `app/components`. If both fail, write `build_jobs.error = 'no_components_dir'` and surface in UI via the "couldn't find components" connect screen.
3. Diff against `instances.last_synced_commit_sha` to get changed component files (first-sync = all components).
4. Run esbuild per-component (shared deps graph). Output per-component JS + extracted CSS.
5. Run `react-docgen-typescript` on each component → emit a `ComponentManifest` from `@usemount/shared` (the moved type).
6. Upload bundles to Supabase Storage; insert/update `component_manifests` rows with artifact URL + `source_hash`.
7. Update `instances.last_synced_commit_sha` and `last_synced_at`. Destroy sandbox.

**Step 4.3 — Iframe runtime + canvas wiring + sandbox hardening**:
1. New `apps/web/app/preview/[manifestId]/route.ts` — serves a minimal HTML doc that mounts the bundle and supplies router + theme defaults per architecture brief §3.
2. **Iframe sandboxing is mandatory at this step, not later** (per `apps/web/ROADMAP.md` §Component rendering). The iframe element gets `sandbox="allow-scripts"` (no `allow-same-origin`). Response sets a strict CSP: `default-src 'none'; script-src 'self' <storage-domain>; style-src 'self' 'unsafe-inline'; connect-src 'none'; frame-ancestors 'self'`. Without this, a malicious customer component can reach host cookies/storage.
3. Replace `manifest.render(props)` in canvas/stage with iframe mount: load `<iframe src={...} sandbox="allow-scripts">`, send props via `postMessage` over a narrow protocol (typed message kinds: `init`, `setProps`, `error`, `ready`). Existing `controls` schema drives the same variants/sizes/booleans panel.
4. Replace `apps/web/components/live/sidebar-panel/sidebar-panel-provider.tsx` `DEMO_REGISTRY` source with Supabase query keyed on `instance_id`. Hook keeps its signature.
5. Append a `component_views` row each time a manifest mounts (the day-one telemetry from Step 2).
6. Delete `apps/web/lib/registry/data.ts` once provider reads real data.

**Step 4.4 — Realtime stale-viewer**:
1. Replace `apps/web/components/live/app-shell/stale-viewer-trigger.tsx`'s 30s `setTimeout` with `supabase.channel('instance:${id}').on('postgres_changes', { table: 'instances', filter: 'id=eq.${id}' })` listening for `last_synced_commit_sha` changes.

**Verification**: connect this usemount.dev repo to itself. Push a button color change. Watch the dashboard show "syncing → synced" within a minute. Refresh and see the change. Open the same instance in a second tab, push another change → first tab shows the stale-viewer toast.

---

### Step 5 — Manifest auto-generation polish (medium)

Per `dashboard-build-plan.md` Step 5 + `architecture-brief.md` §11.

1. **Provider auto-detect**: build worker scans `app/layout.tsx` (or equivalent). If `ThemeProvider`, `QueryClientProvider`, `NextIntlProvider`, etc. wrap `{children}`, generate a `providers.auto.tsx` wrapper file in the bundle and apply it in the iframe runtime. Common providers covered: theme, react-query, next-themes, next-intl, jotai/zustand stores.
2. **`canvas.providers.tsx` fallback**: when present at customer repo root, build worker copies it into the bundle. Iframe wraps every component with it before render.
3. **`Component.canvas.tsx` override file**: per-component opt-in enrichment. If `Button.canvas.tsx` exists next to `Button.tsx`, its exported `controls` merge into / override the auto-generated manifest's controls. Document the surface in `docs/canvas-overrides.md`.
4. **Generics / discriminated unions**: `react-docgen-typescript` chokes on these. Detect → emit manifest with `controls: {}` (renders at default, no toggle rows) → mark in UI as "limited introspection". Component still appears, still previews.
5. **Failure-mode dispositions**: implement the eight cases in `architecture-brief.md` §3:
   - RSCs detected → "Server component — not supported" leaf
   - Build-fail components → grayed leaf with inline error
   - Top-of-module crashes → "couldn't initialize" tile
   - Network-dependent → render in loading/empty state
6. **Support-matrix gate at connect**: connect flow checks `package.json` for React 19+, Next 16+ or Vite 5+, Tailwind v4+, TS 5+. Unsupported → blocking "not yet supported" screen with the unsupported items listed.
7. **Webhook reconciler** (cheap insurance per architecture brief §11): Railway cron or `apps/api` scheduled job runs every 2 hours. For every active `repo_connection`, fetch each pinned branch's HEAD SHA via the GitHub App. Compare to the matching `instance.last_synced_commit_sha`. If diverged, enqueue a `build_jobs` row. Catches missed webhooks before they become permanent staleness.

**Deferred past Step 5 cutline** (explicit):
- `LinkGitHubDialog` — only matters once Google-first viewers try to connect a repo (Persona B/D). Not blocking dogfood with Personas A/C.
- "Try with sample repo" CTA — requires content-complete public `usemount.dev/sample-components` repo.
- Comments / share links / team workspaces — Step 6/7 work.

**Verification**: connect a repo with a `ThemeProvider` → previews render with theme applied. Connect a repo with an RSC → it appears in sidebar with the not-supported note. Connect a JS-only repo → connect flow blocks with clear message. Drop a `Button.canvas.tsx` into this repo and watch new presets show up after sync. Disable GitHub webhooks temporarily, push a change, wait 2 hours → reconciler picks it up and rebuilds.

---

## Codebase cleanup (concurrent with steps above)

Done as each step lands; not a separate phase.

- **After Step 2**: delete `apps/web/lib/dashboard/demo.ts`. Move `Workspace`/`Repo`/`Branch`/`User` types to `packages/shared/src/types.ts`.
- **After Step 4.3**: delete `apps/web/lib/registry/data.ts` (DEMO_REGISTRY). Keep `manifest-types.ts` and `manifests.ts` — those are the live contract.
- **After Step 5**: consolidate `architecture-brief.md` + `dashboard-build-plan.md` into a single `docs/architecture.md`. Move `ROADMAP.md` into `docs/`. Trim `CLAUDE.md` to durable WHAT/WHY only.
- **Throughout**: replace each `// TODO:` (21 currently) with the implementation. The TODO inventory is in `apps/web/ROADMAP.md` — every TODO cites its ROADMAP section, so trace is preserved.

**Hooks/state to preserve (re-wire, don't rewrite)**:
- `apps/web/hooks/use-recent-repos.ts` — keep signature
- `apps/web/hooks/use-repo-search.ts` — keep signature
- `apps/web/lib/dashboard/state.tsx` (`DashboardStateProvider`) — keep pattern
- `apps/web/components/live/sidebar-panel/sidebar-panel-provider.tsx` — keep pattern
- `apps/web/lib/registry/manifest-types.ts` — **the contract; do not change**
- `apps/web/lib/registry/manifests.ts` — manifest loader; expand registration but keep shape

---

## Critical files

**To create**
- `apps/api/src/github/auth.ts` — App JWT → installation token
- `apps/api/src/github/webhook.ts` — HMAC-verified webhook + lifecycle handlers
- `apps/api/src/github/install-callback.ts` — install → `oauth_identities` matching → `repo_connection` rows
- `apps/api/src/build/worker.ts` — `FOR UPDATE SKIP LOCKED` queue consumer
- `apps/api/src/build/reconciler.ts` — every-2h pinned-branch HEAD diff
- `apps/api/sql/0001_init.sql` — schema (incl. `build_duration_ms`, `component_views`)
- `apps/web/lib/supabase/{client,server}.ts` — Supabase clients
- `apps/web/app/auth/callback/route.ts` — OAuth code exchange
- `apps/web/app/preview/[manifestId]/route.ts` — iframe runtime host (CSP set here)
- `apps/web/hooks/use-instance-branches.ts` — replaces `MOCK_INSTANCE`
- `packages/shared/src/manifest.ts` — `ComponentManifest` (moved from web; re-export stub stays at old path)
- `packages/shared/src/types.ts` — `Workspace`, `Repo`, `Branch`, `User` extracted from demo.ts

**To modify**
- `apps/api/src/index.ts` — boot, env validation, route mounting, worker startup
- `apps/web/app/login/page.tsx` — real OAuth
- `apps/web/app/[workspace]/[repo]/[branch]/page.tsx` — `await params`, fetch instance
- `apps/web/components/live/dashboard-nav/nav-avatar.tsx` — Supabase Auth user
- `apps/web/components/live/connect-repo-form/connect-repo-form.tsx` — real connect POST
- `apps/web/components/live/sidebar-panel/sidebar-panel-provider.tsx` — Supabase registry
- `apps/web/components/live/sidebar-panel/sidebar-header-zone.tsx` — real branches
- `apps/web/components/live/app-shell/stale-viewer-trigger.tsx` — Realtime sub
- `apps/web/hooks/use-recent-repos.ts`, `use-repo-search.ts` — re-wire to Supabase
- `apps/web/lib/dashboard/state.tsx` — Supabase fetch

**To delete (after consumers migrate)**
- `apps/web/lib/dashboard/demo.ts`
- `apps/web/lib/registry/data.ts`
- `apps/web/lib/registry/manifest-types.ts` (after move; the stub re-export can persist a release or two before final removal)
- `Initial task research + app shell layout.md` (move to `docs/archive/`)

**Do not touch**
- The `ComponentManifest` shape itself — locked contract, only its location moves
- `apps/web/components/imports/**` — shadcn imports, never edit
- `apps/web/app/globals.css` — token system
- `apps/web/AGENTS.md`, `apps/web/CONVENTIONS.md`, `apps/web/CLAUDE.md` — rules

---

## End-to-end verification (when Step 5 lands)

A new user can:
1. Visit the deployed Railway URL → land on `/login`.
2. Sign in with GitHub OAuth → land on empty dashboard, personal workspace auto-created.
3. Click "+ Connect new repo" → install usemount.dev GitHub App on a real repo → see the repo appear in the dashboard, status "syncing".
4. Wait ~30–120s → status flips to "synced". Click into the repo → AppShell renders with real components in the sidebar tree.
5. Click any component leaf → canvas mounts the live iframe preview. Variants/sizes/booleans panel auto-populates from TypeScript prop types. Hover/animations/state all real.
6. Push a change to the connected branch → within ~60s, an open viewer sees the "new version available — refresh" toast.
7. Drop a `Button.canvas.tsx` next to a `Button.tsx` in the repo → new named presets show up after next sync.
8. Try to connect a JS-only repo → connect flow blocks with the support-matrix error.

Day-1 spike (Step 4.0) confirms the build pipeline holds on the 700-person codebase before Step 4.2 commits to the full architecture.
