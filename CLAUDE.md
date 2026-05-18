# usemount.dev

Desktop-only UI component preview platform. A substitute for Storybook — for browsing, previewing, demonstrating, and sharing components. Not a component editor.

## Influences
Storybook (variants/states), shadcn/ui site (browsing), Figma/FigJam (smart canvas).

## UX model
Two-pane desktop shell: left sidebar for browsing, right canvas for rendering the selected component. Canvas is structured to grow into zoom, pan, viewport switching, and overlay/drawer panels.

## Not in scope
Source editing, drag-to-build, visual authoring, mobile.

## Users
Developers and designers first. PMs/marketing possibly later.

## Stack
Next.js 16, React 19, Tailwind v4, Radix via shadcn, Framer Motion, pnpm workspace (`apps/web`, `apps/api`, `packages/shared`).

## Where things live
- `apps/web/CONVENTIONS.md` — component folders, tokens, SVG, lazy loading
- `apps/web/AGENTS.md` — Next.js 16 breaking-change notes
- `design-philosophy/Knowledge Base/` — animation and research reference
- `docs/archive/Initial task research + app shell layout.md` — archived task brief (retained for reference through Step 5)

## Branch model
- `staging` — active development. All feature branches cut from here, all PRs target here.
- `main` — stable/release only. Only accepts PRs from `staging`. Never commit or branch directly from main.

## Maintenance
Keep under 40 lines. Compress as the product solidifies — this file is the durable WHAT/WHY for future agents, nothing more.
