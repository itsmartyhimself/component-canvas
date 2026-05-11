# Dashboard — Motion, Hover/Click, Radius Remediation

## Context

Dashboard ships visually close to Pencil but feels janky and "vibe-coded" in motion + interaction. User reports five concrete problems:

1. **`RepoRow` whole row isn't clickable** — only the inner `<button>` (chevron+org/repo) expands. Right cluster + meta sit outside it. `ConnectRepoRow` works because the whole surface is one `<button>`. RepoRow is the wrong shape — but a naive "make outer a `<button>`" breaks because RepoRow contains nested interactive elements (`IconButton`s, `WorkspaceChip`) which is invalid HTML and breaks a11y.
2. **Expand/collapse jitters** — nested `<AnimatePresence>` levels (outer for repo expansion, inner for `OtherBranchesExpander` reveal) both run `height: auto` keyframes simultaneously. `height` is a layout-triggering property (per Kowalski: `height` triggers layout → paint → composite); two stacked tweens cause cascading reflow on collapse. Parent re-measures while child is mid-tween.
3. **Hover flicker / "AI slop" feel** — every row component (`RepoRow`, `BranchRow`, `OtherBranchesExpander`) carries its own `useState(false)` driven by `onMouseEnter/Leave`, plus CSS `transition: background-color 150ms ease`. Background-color is a paint property (main-thread), not GPU-composite. React state per row → per-row re-renders. Sidebar avoids both (CSS `:hover`, no per-row state).
4. **`SubBranches` traveling pill — KEEP AS-IS.** User confirms the pill itself is the ONE thing that works (mirrors `SidebarHighlightLayer`). Don't rebuild it. The perceived flicker around it is from the parent expansion's nested-AnimatePresence height-tween (#2) — fixing #2 indirectly stabilizes the pill's measurement context.
5. **Border radius drift from Pencil.** Verified via `mcp__pencil__batch_get`:
   - `RepoRow` (gljTH/LzcY3) = 16px → `--radius-4` (correct ✓)
   - `RepoCard` (Kvnsj/kGxUt) = 16px → correct ✓
   - `WorkspaceCard` (mnZOk/dFL6i) = 16px → correct ✓
   - `ConnectRepoRow` (B2KEFR/L0PWp/h4WqzG/TUSfy) = 16px → correct ✓
   - `RecentRepos` outer (KNRCz) = **18px** → currently `--radius-5` (20px) ✗
   - `RepoList`/`ListContainer` (aHZOW) = **18px** → currently `--radius-5` (20px) ✗
   - `Step2 connS2List` (HxVxh) = **18px** → currently `--radius-5` (20px) ✗
   - `Step3` outer (R1zlTn) = **18px** → currently `--radius-5` (20px) ✗
   No `--radius-4-5: 18px` token exists — add it.

Plus: **NavSearch ⌘K kbd alignment** — `<span>⌘K</span>` is one element. The ⌘ unicode glyph and the K letter sit at different baseline heights in monospace (⌘ has descender behavior). User wants them visually equal-height.

The intended outcome: dashboard motion + interaction matches sidebar's quality. Hover is CSS-only (instant, GPU-friendly, zero re-renders). Expand/collapse uses Radix `Collapsible` (the sidebar's pattern). Click affordances cover the entire interactive surface without invalid nested-button HTML. Radii match Pencil exactly. Traveling pill kept intact — only the surrounding chaos changes.

---

## Reference: what the sidebar does right (cross-reference target)

Files to imitate: `apps/web/components/live/sidebar-panel/sidebar-folder.tsx`, `sidebar-highlight-layer.tsx`, `sidebar-panel.tsx`, `sidebar-panel-provider.tsx`, `apps/web/components/live/row/row.tsx`.

Per Kowalski (`design-philosophy/Knowledge Base/animation-kowalski.md`):
- "The more often an interaction happens, the less animation it should have." → Hover is high-frequency; do not animate it.
- "Animate `transform` and `opacity` — these only trigger the composite step. `margin`, `padding`, `width`, `height` trigger layout → paint → composite." → Avoid `height: auto` keyframes when alternative exists.
- "Hover causes flicker → Animate child element, not parent." → Drop CSS bg transitions on the row; the highlight pill animates separately.

| Concern | Sidebar pattern | Dashboard's current pattern | Adopt? |
|---|---|---|---|
| Expand/collapse | `Radix Collapsible.Root` + `Collapsible.Trigger asChild` + `Collapsible.Content forceMount` wrapping a single `motion.div` with `initial/animate/exit { height }` + `ROW_SPRING`. ONE `AnimatePresence` per folder. | Two nested `<AnimatePresence>` with `height: auto` keyframes. | **Yes** — adopt Radix Collapsible for both expansion levels (RepoRow expand + OtherBranchesExpander reveal). Eliminates the nested-AnimatePresence height race. |
| Hover state | Sidebar's `Row` does receive `onHoverChange` and reports up to a shared `hoverId` context — but the visual hover bg is painted by the `SidebarHighlightLayer` pill, not by the row itself. The row stays transparent. | Each row paints its own bg via `useState(hover)` + CSS `transition: background-color`. Per-row re-renders + main-thread paint. | **CSS `:hover` everywhere.** Hover bg is instant via CSS pseudo-class. Drop all `useState(hover)` from RepoRow / OtherBranchesExpander. (BranchRow's case is special — see below.) |
| Hover-driven icon reveal | Sidebar's row-action icons appear via `[data-row-action]` CSS rule in `globals.css`: `[data-slot="sidebar-menu-item"]:hover [data-row-action] { opacity: 1 }`. **Pure CSS.** | RepoRow's right cluster (View/Re-sync/Pin) uses `opacity: hover ? 1 : 0` driven by `useState`. | **Pure CSS** — use parent-`:hover` selector to reveal `[data-row-action]` descendant. Drop `useState(hover)`. |
| Pill measurement | Sidebar's pill measures via `useLayoutEffect` deps `[hoverId, registryVersion]` plus `ResizeObserver` on the wrapper. Wrapper is stable (sidebar tree doesn't height-tween). | `SubBranches` measures inside a parent that's mid-`height: auto` tween → bounds stale → flicker. | **No code change to SubBranches itself** (user confirmed it works as the only smooth thing). The fix is upstream: replace the parent's `height: auto` AnimatePresence with `Radix Collapsible` so the wrapper is mounted via `forceMount` and stops re-tweening height when nested. |
| Click / hit area | The whole `Row` is a `Collapsible.Trigger asChild` button — entire surface clickable. No nested buttons (sidebar rows have no nested interactive content). | RepoRow's `<button>` wraps only chevron+title; the right cluster + meta sit outside. | **Use `<div role="button" tabIndex={0}>` for outer** — RepoRow CAN'T be a `<button>` because it contains `IconButton`s and `WorkspaceChip` (nested interactive = invalid HTML + broken screen readers). Right cluster wraps with `e.stopPropagation()` so its clicks don't bubble to the row toggle. |
| Animation easing | All spatial motion uses `ROW_SPRING` (spring 350/35) — one curve. Hover uses CSS `:hover` (instant, no transition). | Mixed: `ROW_SPRING` for some, `transition: 150ms ease` for hover bg, custom cubic-bezier for stale-viewer-banner. | **Keep `ROW_SPRING`** for spatial/expand. **Drop hover transitions entirely** (instant CSS `:hover`). |
| Reduced motion | CSS transitions honor `prefers-reduced-motion` via `@media` rule in `globals.css`. Framer-motion not explicitly guarded. | Same. | **Bonus** — add `useReducedMotion()` from framer-motion to disable spring height-tween + chevron rotate when user prefers reduced motion. Substitute with instant snap. |

---

## Concrete fixes (per file, ordered by execution)

### 1. Add `--radius-4-5: 18px` token + bind gray surfaces
**File:** `apps/web/app/globals.css`

Add `--radius-4-5: 18px;` between `--radius-4: 16px;` (line 159) and `--radius-5: 20px;` (line 160).

**Verify no name conflict** before editing: `grep -rn "radius-4-5" apps/web/` → expected 0 hits. If hits, rename the new token to something else (e.g., `--radius-4-half`).

**Files to update (`var(--radius-5)` → `var(--radius-4-5)`):**
- `apps/web/components/live/list-container/list-container.tsx:19` (currently uses radius-5 = 20)
- `apps/web/components/live/recent-repos/recent-repos.tsx:20`
- `apps/web/components/live/connect-repo-form/step-select-repo.tsx:21`
- `apps/web/components/live/connect-repo-form/step-assign-workspace.tsx:20`

Do **not** touch `RepoRow`, `RepoCard`, `WorkspaceCard`, `ConnectRepoRow` — they stay on `--radius-4` (16px), matches Pencil.

### 2. Make entire RepoRow surface clickable (without invalid nested buttons)
**File:** `apps/web/components/live/repo-row/repo-row.tsx`

Current shape (lines 84–217): outer `<div>` + inner `<button>` (lines 89–130) wrapping only chevron + title. Right cluster (`IconButton`s + `WorkspaceChip`) sits outside the button. Hover state on outer div via `useState`.

**Restructure:**

a. **Outer element**: `<div role="button" tabIndex={0} aria-expanded={expanded} aria-label={\`Expand ${repo.orgRepo}\`}>`. Add:
   - `onClick={() => onToggleExpanded(repo.id)}` on the div.
   - `onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleExpanded(repo.id); } }}` for keyboard activation.
   - `cursor: pointer` (already in rowStyle).
   - DROP `onMouseEnter`/`onMouseLeave` (no more JS hover state).
   - DROP `useState(hover)` declaration.
   - Background: drop the `hover` term — now `expanded ? bg-secondary : bg-elevated`. The `:hover` paint comes from CSS. Add a CSS rule that gives `[data-row="repo"]:hover` a bg-secondary fill. Either via a styled-jsx-style approach OR add a className+global selector OR use Tailwind `hover:` arbitrary value class on the div: `className="hover:[background-color:var(--color-bg-secondary)]"` — WAIT, this needs token-based mapping. Easiest: add a small CSS rule to `apps/web/app/globals.css` under `@layer base`:
     ```css
     [data-row="repo"]:hover { background-color: var(--color-bg-secondary); }
     ```
     Apply `data-row="repo"` to the outer div. This is CSS-driven, no React state.

b. **Inner chevron+title content**: convert inner `<button>` (lines 89–130) to a plain `<span style={{ display: "flex", ... }}>`. Drop the button's `onClick` (the outer div now handles it). Drop `aria-expanded` from the inner element (now on the outer). The chevron motion span stays as-is.

c. **Right cluster wrapper** (lines 132–215): wrap with `onClick={(e) => e.stopPropagation()}` AND `onKeyDown={(e) => e.stopPropagation()}` — prevents row toggle when interacting with View/Re-sync/Pin/WorkspaceChip. Keep all `IconButton`s as-is (they're already `<button>` elements with their own onClick).

d. **Right cluster icon reveal**: drop the inline `opacity: hover ? 1 : 0` + `transform`. Replace with CSS:
   - Wrap the icon-cluster div with `data-row-action="true"`.
   - Add CSS rule (in `apps/web/app/globals.css` under `@layer base`):
     ```css
     [data-row="repo"] [data-row-action] { opacity: 0; transform: translateX(4px); transition: opacity 150ms ease, transform 150ms ease; pointer-events: none; }
     [data-row="repo"]:hover [data-row-action] { opacity: 1; transform: translateX(0); pointer-events: auto; }
     ```
   This is pure CSS, no JS state, no per-row re-render.

e. Drop `transition: "background-color 150ms ease"` from `rowStyle` (line 79). The bg change is now via CSS hover (instant, no animation — Kowalski).

After this, clicking *anywhere* on the row (except IconButtons / WorkspaceChip) toggles expansion. Keyboard Enter/Space also toggles. No `useState(hover)`.

### 3. Drop `useState(hover)` from BranchRow + OtherBranchesExpander
**Files:**
- `apps/web/components/live/branch-row/branch-row.tsx`
- `apps/web/components/live/other-branches-expander/other-branches-expander.tsx`

**`BranchRow` (lines 27–211):**

a. Drop `const [hover, setHover] = useState(false)` (line 42).
b. Drop `handleEnter` / `handleLeave` (lines 83–90) — but KEEP `onHoverChange` callback wired to `onMouseEnter` / `onMouseLeave` directly:
   ```tsx
   onMouseEnter={() => onHoverChange?.(true)}
   onMouseLeave={() => onHoverChange?.(false)}
   ```
   This still signals to `SubBranches` for the traveling pill (the user confirmed pill is intentional and works).
c. Drop the `transition: "background-color 150ms ease"` from rowStyle (line 71).
d. The right-cluster (Open + Re-sync icons, lines 108–136) currently appears via `hover && !isSyncing` check. Replace with CSS:
   - Wrap right-cluster's outer flex div with `data-row-action="true"`.
   - Reuse the CSS rule from RepoRow: `[data-row="branch"]:hover [data-row-action] { opacity: 1 }`.
   - But the conditional rendering (`hover && !isSyncing` vs failed vs syncing branches) is more complex. Simpler approach:
     - Always render the meta (`branch.sha · synced X ago` for synced, `Build failed · View logs` for failed, spinner for syncing). Then OVERLAY the action cluster via CSS `:hover` — when the row is hovered AND not syncing, the action cluster appears and the meta hides.
     - Simplest implementation: render BOTH the meta and the actions in the same container, give them sibling status. Use CSS:
       ```css
       [data-row="branch"] [data-row-meta] { opacity: 1; transition: opacity 150ms ease; }
       [data-row="branch"] [data-row-action] { opacity: 0; pointer-events: none; transition: opacity 150ms ease; position: absolute; right: var(--spacing-6); }
       [data-row="branch"]:hover [data-row-meta] { opacity: 0; }
       [data-row="branch"]:hover [data-row-action] { opacity: 1; pointer-events: auto; }
       [data-row="branch"][data-status="syncing"]:hover [data-row-meta] { opacity: 1; }
       [data-row="branch"][data-status="syncing"]:hover [data-row-action] { opacity: 0; }
       ```
     - The right-cluster's outer div needs `position: relative` so the absolute child anchors correctly.
   - This eliminates the `hover` JS state entirely while preserving the syncing-state behavior (no actions shown when syncing).

e. **KEEP** `forwardRef` on BranchRow — `SubBranches` traveling pill needs the ref for measurement.
f. **KEEP** `noHoverBackground` prop — used by `SubBranches` to make rows transparent under the pill. The CSS `:hover` rule should NOT fire when `noHoverBackground` is set. Implementation: use a different `data-row` attribute when noHoverBackground is true (e.g., `data-row="branch-naked"`), and gate the `:hover { background-color }` rule on `data-row="branch"` only — `data-row="branch-naked"` skips it.

**`OtherBranchesExpander` (lines 15–120):**

a. Drop `const [hover, setHover] = useState(false)` (line 21).
b. Drop `onMouseEnter`/`onMouseLeave` (lines 48–49).
c. Drop `transition: "background-color 150ms ease, border-color 150ms ease"` (line 41).
d. Background + border + child color shifts driven by JS hover → all CSS:
   ```css
   [data-other-branches-expander]:hover { background-color: var(--color-bg-elevated); }
   [data-other-branches-expander]:hover .obx-icon { color: var(--color-text-primary); }
   [data-other-branches-expander]:hover .obx-label { color: var(--color-text-primary); }
   ```
e. The "X not pinned" pill inside (lines 89–103) currently swaps bg via `hover ? bg-secondary : bg-elevated` — same CSS-hover treatment.

### 4. Adopt Radix Collapsible for both expansion levels (the big motion fix)
**File:** `apps/web/components/live/dashboard-page/dashboard-page.tsx`

Current shape (lines 100–153):
```
<RepoRow ... />
<AnimatePresence>
  {expanded && <motion.div height-tween>
    <BranchRow ... /> × pinned
    <OtherBranchesExpander ... />
    <AnimatePresence>
      {expanderOpen && <motion.div height-tween>
        <SubBranches ... />
      </motion.div>}
    </AnimatePresence>
  </motion.div>}
</AnimatePresence>
```

Two nested AnimatePresence with stacked `height: auto` keyframes — the cause of #2 (collapse jitter).

**Restructure** (mirror `sidebar-folder.tsx:77–126`):

```tsx
import { Collapsible } from "radix-ui"

<Collapsible.Root open={expanded} onOpenChange={() => undefined}>
  <Collapsible.Trigger asChild>
    <RepoRow .../> {/* RepoRow is now the trigger, but it has its own onClick that toggles via context.toggleExpanded — Trigger asChild forwards a click handler. May conflict. Solution: drop the asChild + Trigger wrapper, since RepoRow's div already calls toggleExpanded on click. Just use Collapsible.Root open={expanded} for state binding, and Collapsible.Content for the animated reveal. */}
  </Collapsible.Trigger>
  <AnimatePresence initial={false}>
    {expanded ? (
      <Collapsible.Content forceMount asChild>
        <motion.div
          key={`${repo.id}-expanded`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={ROW_SPRING}
          style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}
        >
          {pinnedBranches.map(branch => <BranchRow key={branch.id} branch={branch} />)}
          {unpinnedCount > 0 && <OtherBranchesExpander ... />}
          <Collapsible.Root open={expanderOpen} onOpenChange={() => undefined}>
            <AnimatePresence initial={false}>
              {expanderOpen ? (
                <Collapsible.Content forceMount asChild>
                  <motion.div
                    key={`${repo.id}-unpinned`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={ROW_SPRING}
                    style={{ overflow: "hidden" }}
                  >
                    <SubBranches branches={synthesizeUnpinnedBranches(repo, unpinnedCount)} />
                  </motion.div>
                </Collapsible.Content>
              ) : null}
            </AnimatePresence>
          </Collapsible.Root>
        </motion.div>
      </Collapsible.Content>
    ) : null}
  </AnimatePresence>
</Collapsible.Root>
```

Key differences from current:
- `Collapsible.Content forceMount` keeps the DOM reference stable — framer-motion can animate exit cleanly (no unmount race).
- Drop the `y: 20` translation. Sidebar uses `y: 20` but only ONCE per folder. Two nested levels of `y: 20` translation create extra movement. Keep just `height` + `opacity`.
- Each Collapsible owns ONE level of expand state. The two levels are **siblings in nesting** but each has its own AnimatePresence — no race.
- The outer `Collapsible.Trigger asChild` part may be unnecessary if RepoRow already handles click-to-toggle internally. Decide during implementation: easiest is to drop the Trigger wrapper and just use Collapsible.Root for state binding + Collapsible.Content for the animated reveal. RepoRow's outer div already calls `toggleExpanded(repo.id)`.

Verify dependency: `radix-ui` umbrella package is already imported by sidebar-folder.tsx (`import { Collapsible } from "radix-ui"`). No new install needed.

### 5. Keep SubBranches traveling pill EXACTLY AS-IS
**File:** `apps/web/components/live/dashboard-page/dashboard-page.tsx` (lines 162–258)

User confirmed: "that one is intentional. its from the sidepanel setup... that one is actually like the only thing that DOESNT flicker and that works."

Do NOT modify:
- `wrapperRef` + `refs` map + `useLayoutEffect` measurement.
- The `BranchRow` ref forwarding.
- `noHoverBackground` prop.
- The framer-motion pill render.

The pill's stability depends on its parent (`Collapsible.Content` motion.div) being mounted. After step 4 adopts `Collapsible.Content forceMount`, the wrapper stays in the DOM through exit, so measurement no longer races a destroying parent. The traveling pill should feel stable.

### 6. Fix NavSearch ⌘K kbd alignment
**File:** `apps/web/components/live/dashboard-nav/nav-search.tsx`

Current (lines 68–70):
```tsx
<span className="font-mono type-2" style={kbdStyle} aria-hidden>
  ⌘K
</span>
```

The ⌘ unicode (U+2318) and K letter have different visual heights in monospace fonts. Replace with two equal-height children:

```tsx
<span style={kbdStyle} aria-hidden>
  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "1em", lineHeight: 1 }} className="font-mono type-2">⌘</span>
  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "1em", lineHeight: 1 }} className="font-mono type-2">K</span>
</span>
```

Add `gap: "1px"` (or `2px`) on the outer kbd container so the two glyphs don't touch. The fixed `height: 1em` + `lineHeight: 1` constrains both glyphs to the same vertical box, eliminating the baseline mismatch.

Carbon icon search confirmed: no `Command` glyph in `@carbon/icons-react@11`. The unicode ⌘ stays.

### 7. Add `useReducedMotion()` guard (bonus accessibility)
**File:** `apps/web/components/live/dashboard-page/dashboard-page.tsx`

Import `useReducedMotion` from `framer-motion`. At the top of `DashboardContent`:

```tsx
const shouldReduceMotion = useReducedMotion()
const expandTransition = shouldReduceMotion ? { duration: 0 } : ROW_SPRING
```

Use `transition={expandTransition}` on the height-tween motion.divs. With reduced motion, the expand snaps instantly — no spring.

Same treatment for the chevron rotate in `RepoRow` (currently `transition={ROW_SPRING}` on line 105) — pass `expandTransition` via prop, OR call `useReducedMotion()` inline in RepoRow.

The traveling pill in `SubBranches` already uses `ROW_SPRING` — gate it the same way.

### 8. `useEffect` audit per `you-might-not-need-an-effect` (no changes needed)
Walk through every `useEffect`/`useLayoutEffect` in the dashboard files. Findings:

- `dashboard-page.tsx:60` — `useEffect` schedules a 4s `setTimeout` to fire a toast. **Justified.** External system (DOM timer). Keep.
- `dashboard-page.tsx:200` (SubBranches) — `useLayoutEffect` measures pill bounds on `hoveredId` change. **Justified per user direction** — this is the working sidebar-pattern they want. Keep.
- `stale-viewer-banner.tsx:18` — `useEffect` schedules 30s timer. **Justified** (same reason).
- `repo-row.tsx`, `branch-row.tsx`, `other-branches-expander.tsx` — none currently. After step 2/3, no new effects added (we replaced `useState(hover)` with CSS, not with effects).
- `state.tsx` — none.

No `useEffect` is being used to derive state from props or mirror props into state. The "AI slop" complaint stems from per-row `useState(hover)` (not effects). Step 2/3 removes those.

---

## Files touched (full list)

**Edit token + add CSS hover rules:**
- `apps/web/app/globals.css` — add `--radius-4-5: 18px`. Add CSS rules under `@layer base` for `[data-row="repo"]:hover`, `[data-row="branch"]:hover`, `[data-other-branches-expander]:hover`, plus the `[data-row-action]` opacity-reveal rules.

**Rewrite (motion + structure + click area + drop hover state):**
- `apps/web/components/live/repo-row/repo-row.tsx` — outer = `div role="button"`; drop `useState(hover)`; right cluster wraps with stopPropagation + `data-row-action`; CSS-driven hover bg + icon reveal
- `apps/web/components/live/branch-row/branch-row.tsx` — drop `useState(hover)`; right cluster CSS-driven; meta/action sibling-overlay via `:hover` selector; KEEP forwardRef + onHoverChange + noHoverBackground
- `apps/web/components/live/other-branches-expander/other-branches-expander.tsx` — drop `useState(hover)`; CSS-driven bg + icon/text color
- `apps/web/components/live/dashboard-page/dashboard-page.tsx` — wrap both expansion levels in Radix `Collapsible.Root` + `Collapsible.Content forceMount asChild`; drop `y: 20`; keep `SubBranches` and its pill exactly as-is; add `useReducedMotion()` for the height-tween + chevron rotate

**Surgical edit (radius bind):**
- `apps/web/components/live/list-container/list-container.tsx` — `var(--radius-5)` → `var(--radius-4-5)`
- `apps/web/components/live/recent-repos/recent-repos.tsx` — same
- `apps/web/components/live/connect-repo-form/step-select-repo.tsx` — same
- `apps/web/components/live/connect-repo-form/step-assign-workspace.tsx` — same

**Surgical edit (kbd):**
- `apps/web/components/live/dashboard-nav/nav-search.tsx` — split ⌘K into two fixed-height spans

**Reference (study, do not edit):**
- `apps/web/components/live/sidebar-panel/sidebar-folder.tsx` — Radix Collapsible + motion.div pattern
- `apps/web/components/live/sidebar-panel/sidebar-highlight-layer.tsx` — traveling pill pattern (already mirrored by SubBranches)
- `apps/web/components/live/sidebar-panel/sidebar-panel.tsx` — `[data-row-action]` CSS pattern reference
- `apps/web/components/live/row/row.config.ts` — `ROW_SPRING` (use this transition everywhere spatial)
- `apps/web/app/globals.css` (existing `[data-row-action]` block at the bottom of `@layer base` — model the new rules after this)
- `design-philosophy/Knowledge Base/animation-kowalski.md` — motion principles
- `component-book.pen` (Pencil) — cornerRadius reference: KNRCz=18, aHZOW=18, R1zlTn=18, HxVxh=18; gljTH/Kvnsj=16

---

## Verification

1. **`pnpm --filter web exec tsc --noEmit`** — must return 0 errors.
2. **`pnpm --filter web dev`** — open `/`, `/?state=expanded`, `/connect` at 1440 viewport.
3. **Click anywhere on a `RepoRow`** (whitespace, status dot area, between meta and chip — anywhere except IconButtons/Chip) → row toggles expansion. Click View/Re-sync/Pin/WorkspaceChip → those trigger their own actions, NOT the row toggle.
4. **Keyboard navigate to a `RepoRow`** (Tab) → focus indicator visible. Press Enter or Space → toggles. Tab to right-cluster icons → those are independently focusable.
5. **Click a different `RepoRow` while one is open** → first closes smoothly, second opens. Single chevron rotation per click. No double-bounce as parent re-measures.
6. **Watch the chevron rotate + height tween on expand** → should feel as smooth as toggling a sidebar folder. Compare side-by-side to sidebar in the AppShell. No jitter on collapse.
7. **Hover across `BranchRow`s in pinned section** → instant bg-elevated fill on the hovered row (no transition delay), action icons fade in via CSS opacity transition. No flicker.
8. **Click "Other branches" expander** → synthetic branches reveal. Hover across them → traveling pill smoothly tracks (this is the part that already worked; verify it hasn't regressed).
9. **DevTools → Performance → record a 1s hover sweep across 5 RepoRows** → expect ≤ 5 paint events total (one per row entered). If you measure 25+ paints, per-row React state is still firing somewhere — find and fix.
10. **DevTools → Components → check renders during hover** → the hovered row's React tree should NOT re-render (no `useState`, no setState). React DevTools "Highlight updates when components render" should show no flashes during hover sweep.
11. **NavSearch ⌘K** — the ⌘ glyph and K letter sit at the same vertical center, equal heights. Inspect via DevTools: both `<span>`s have `height: 1em` computed.
12. **Border radius spot-checks via DevTools computed style:**
    - RecentRepos outer `border-radius` = `18px`
    - RepoList outer = `18px`
    - StepSelectRepo gray = `18px`
    - StepAssignWorkspace gray = `18px`
    - RepoRow = `16px`
    - RepoCard = `16px`
13. **Pencil side-by-side at 1440** — visual parity on the gray containers; expand/collapse motion now feels closer to the sidebar's folder expansion.
14. **Toggle macOS "Reduce Motion" in System Settings → re-test** — expansion snaps instantly (no spring), chevron snaps to 90°, hover still works (CSS hover already doesn't animate).
15. **Grep enforcement:**
    - `grep -rn "useState.*hover" apps/web/components/live/repo-row apps/web/components/live/branch-row apps/web/components/live/other-branches-expander` → 0 hits.
    - `grep -rn "transition.*background-color" apps/web/components/live/repo-row apps/web/components/live/branch-row apps/web/components/live/other-branches-expander` → 0 hits.
    - `grep -rn "var(--radius-5)" apps/web/components/live/list-container apps/web/components/live/recent-repos apps/web/components/live/connect-repo-form` → 0 hits.
    - `grep -n "radius-4-5" apps/web/app/globals.css` → exactly 1 hit (the new declaration).

---

## Out of scope

- `/[workspace]/[repo]/[branch]` AppShell — unchanged.
- `/login`, `/playground`, `/connect`'s `WorkspaceCard` internals (already correct from prior rounds).
- Toast / StaleViewerBanner motion (the spring + cubic-bezier timings there are within Kowalski's spec, no jank reported).
- Filter pills, FilterPills active state animation polish — leave as bg transition (low frequency).
- DashboardNav fade overlay (already in place from prior round).
- SubBranches traveling pill — explicitly preserved per user direction.

---

## Critical files index (for fresh agent)

```
EDIT TOKEN + ADD CSS RULES:
  apps/web/app/globals.css
    - add --radius-4-5: 18px (between --radius-4 and --radius-5)
    - add [data-row="repo"]:hover { background-color: var(--color-bg-secondary); } under @layer base
    - add [data-row="branch"]:hover { background-color: var(--color-bg-elevated); } (skip data-row="branch-naked")
    - add [data-other-branches-expander]:hover { ... } (bg + nested icon/label color shifts)
    - add [data-row-action] opacity reveal rule (reusable across rows)

REWRITE (motion + structure + click area + drop hover state):
  apps/web/components/live/repo-row/repo-row.tsx
    - outer <div role="button" tabIndex={0} aria-expanded={expanded} onClick onKeyDown>
    - drop useState(hover)
    - inner chevron+title becomes <span> (not button)
    - right cluster wraps with onClick stopPropagation + data-row-action
    - drop transition: background-color
  apps/web/components/live/branch-row/branch-row.tsx
    - drop useState(hover); keep forwardRef + onHoverChange + noHoverBackground (pill needs them)
    - meta + action become sibling-overlay via CSS :hover
    - data-row="branch" (or "branch-naked" when noHoverBackground)
    - drop transition: background-color
  apps/web/components/live/other-branches-expander/other-branches-expander.tsx
    - drop useState(hover); CSS :hover for bg + nested color shifts
    - drop transition: background-color, border-color
  apps/web/components/live/dashboard-page/dashboard-page.tsx
    - wrap each repo's expansion in Radix <Collapsible.Root open={expanded}>
    - <Collapsible.Content forceMount asChild> wrapping the motion.div height-tween
    - same pattern for the OtherBranchesExpander reveal (nested Collapsible)
    - drop y: 20 keyframes (height + opacity only)
    - keep SubBranches and its pill exactly as-is
    - add useReducedMotion() guard for height-tween + chevron rotate

SURGICAL EDIT (radius bind):
  apps/web/components/live/list-container/list-container.tsx          — var(--radius-5) → var(--radius-4-5)
  apps/web/components/live/recent-repos/recent-repos.tsx              — same
  apps/web/components/live/connect-repo-form/step-select-repo.tsx     — same
  apps/web/components/live/connect-repo-form/step-assign-workspace.tsx — same

SURGICAL EDIT (kbd):
  apps/web/components/live/dashboard-nav/nav-search.tsx
    - split <span>⌘K</span> into two child spans, each height: 1em + lineHeight: 1 + inline-flex center

REFERENCE (study but do not edit):
  apps/web/components/live/sidebar-panel/sidebar-folder.tsx                 — Radix Collapsible + motion.div pattern (mirror)
  apps/web/components/live/sidebar-panel/sidebar-highlight-layer.tsx       — traveling pill pattern (already mirrored by SubBranches)
  apps/web/components/live/sidebar-panel/sidebar-panel.tsx                 — [data-row-action] CSS pattern
  apps/web/components/live/row/row.config.ts                               — ROW_SPRING constant
  design-philosophy/Knowledge Base/animation-kowalski.md                   — animate transform/opacity not height; hover should not animate
  component-book.pen (via mcp__pencil__batch_get)                          — cornerRadius source of truth
```
