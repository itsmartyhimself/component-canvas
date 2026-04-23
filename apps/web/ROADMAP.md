# apps/web — frontend roadmap

Follow-ups tracked here. Inline `// TODO:` in source cites the section by title.

## Backend / Registry
- Replace `lib/registry/data.ts` (DEMO-ONLY) with a real registry backed by the API: workspace manifest fetch, repo-connect, or uploaded source.
- Swap the in-memory mutation path in `SidebarActions` for server mutations.
- Replace `ImportDialog` stub form with the real import pipeline (link registry, workspace package, or uploaded source).
- Persist `expandedIds` + selection outside URL (currently URL-only via `?component=`).
- OAuth + workspace model; real avatar via `User.avatarUrl`.

## Sidebar
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
