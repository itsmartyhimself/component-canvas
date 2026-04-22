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
- Zoom: cursor-centered scale-at, ⌘+wheel / pinch input.
- Pan: two-finger trackpad, space+drag, middle-button drag; `overscroll-behavior: contain`.
- Viewport resizing: preset breakpoints (mobile/tablet/desktop) + free-form handle.
- Minimap overlay.
- Toolbar overlay (zoom controls, fit-to-view, viewport presets).
- Property / variant / state drawers.
- Docs overlay (MDX panel in screen-space).
- Keyboard shortcuts (zoom, pan, viewport switching, focus).

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
