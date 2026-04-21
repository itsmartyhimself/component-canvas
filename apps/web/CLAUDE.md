@AGENTS.md

# apps/web

Next.js 16 + React 19 (Turbopack), Tailwind v4, shadcn new-york via Radix, framer-motion v12. Part of a pnpm workspace (`apps/web`, `apps/api`, `packages/shared`).

## Component folders
- `components/imports/` — shadcn/ui + Radix primitives. Never edit. Never use directly in app code.
- `components/live/` — app components that wrap imports and apply all visual styling via tokens.

## Styling
Token-first. Tailwind utilities for layout/behavior only (flex, grid, positioning). All color, radius, spacing, and typography go through CSS variables from `app/globals.css` (semantic tokens under `:root`, aliased into `@theme inline {}`). Typography via `.type-1`..`.type-13` + `.text-trim`. See `CONVENTIONS.md` for the full rule set and `~/.claude/rules/styling.md` for the global token workflow.

## App shell — three-layer canvas
`components/live/app-shell/` composes `Sidebar` + `Canvas`. The canvas is structured as `Viewport (overflow-hidden) → Stage (transform target) → Overlays (screen-space, pointer-events:none)` from day one. The stage hosts the future iframe mount point; overlays host future toolbar/minimap/drawers. Zoom/pan will attach a transform to the stage only — overlays stay unscaled. See `ROADMAP.md` for the full follow-up list.

## Previews will run in iframes
Rendering arbitrary `.tsx` in the host bundle is not viable (imports, CSS, side effects, untrusted code = host risk). The shell is scaffolded so the future preview surface is a sandboxed iframe inside the stage, driven by a narrow `postMessage` protocol. Metadata (id, title, folder, variants, states, docs, props schema) lives in JSON manifests keyed by id, separate from the compiled artifact.

## Desktop-only
`<body>` is `h-full overflow-hidden` — the app is a fixed surface, not a scrolling page. No mobile pass.
