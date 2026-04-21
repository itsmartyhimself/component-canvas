# SidebarPanel

The left shell of the app — component browser. Fixed 280px. No fill, no border, no radius; inherits the white `<main>` background. Internally: sticky header (team switcher + search) + Radix ScrollArea middle (sections) + sticky footer (user).

## Demo shell — status

This is a demo shell. The registry (`lib/registry/data.ts`) is static and marked `// DEMO-ONLY`. Mutations (add folder, add component, rename, delete, hide doc) are in-memory via the `SidebarActions` facade in `sidebar-panel-provider.tsx`. Nothing persists beyond the session except `hiddenDocIds` in localStorage.

Real import / repo-connect / server-backed registry is tracked in `apps/web/ROADMAP.md` under "Backend / Registry".

## Layout contract
- Width: fixed 280px (no collapse in v1 — tracked in ROADMAP as "64px icon-only collapsed mode").
- Background / border / radius: none. Inherits `<main>`'s `--color-bg-primary`.
- Height: fills the flex parent (`<main>`), which fills the viewport via `<body>` / `<html>` `h-full`.
- Middle scrolls; header and footer stay fixed.

## Composition
- Hosts shadcn's `SidebarProvider` (purely as a context host for `SidebarMenu*` primitives). The wrapper div is neutralised with `className="contents"` so it doesn't introduce its own layout.
- Hosts `SidebarPanelProvider` for panel-specific ephemeral UI state (expansions, search query, popover/dialog/rename state, localStorage-backed hidden docs).
