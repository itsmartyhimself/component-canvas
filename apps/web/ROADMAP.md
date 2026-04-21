# apps/web — frontend roadmap

Follow-ups tracked here. Inline `// TODO:` in source cites the section by title.

## Sidebar
- Search bar (fuzzy match across component titles + tags)
- Component tree with category nesting (e.g. `Forms/Button/Primary`)
- Import entrypoint (link registry, workspace package, or uploaded source)
- Folder management (create, rename, move, delete)
- Share / export current selection
- Persist collapsed state (localStorage, then URL)

## Canvas
- Zoom: cursor-centered scale-at, ⌘+wheel / pinch input
- Pan: two-finger trackpad, space+drag, middle-button drag; `overscroll-behavior: contain`
- Viewport resizing: preset breakpoints (mobile/tablet/desktop) + free-form handle
- Minimap overlay
- Toolbar overlay (zoom controls, fit-to-view, viewport presets)
- Property / variant / state drawers
- Docs overlay (MDX panel in screen-space)
- Keyboard shortcuts (zoom, pan, viewport switching, focus)

## Component rendering / import pipeline
- Sandboxed iframe host (`sandbox="allow-scripts"` + CSP + narrow `postMessage` protocol)
- Build strategy decision: workspace package build vs in-browser `esbuild-wasm` / `swc-wasm` vs link registry
- Metadata manifest schema (id, title, folder path, variants[], states[], docs, props schema, thumbnails)
- Variant / state switching via `postMessage` (props update, not iframe reload)
- Theme switching protocol
- Size updates (when the canvas resizes the inner preview surface)
- Error isolation (preview crash ≠ host crash)

## Backend / persistence
- Manifest storage and sync
- Share URLs / permalinks
- Auth + workspace model
