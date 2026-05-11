# <dashboard_task_prompt>
You are building out the full user dashboard panel for a live product. This covers the page/pages/flow, all required components (many new ones, likely deeply nested), layout architecture, nav, and demo content — matching the design in the Pencil file and reconciling it against the `dashboard-build-plan.md` and `architecture-brief.md`.
</task_context>

<background>
**Design source**
- Pencil file: `@component-book.pen`
  - Master layout containers: `Dashboard-Layouts-Container`, `Dashboard-Components-Kit-v2-Container`
  - Component: `DashboardNav-final`
  - Read every context comment in every layer with surgical precision before writing any code

**Reference docs**
- `@dashboard-build-plan.md` — primary build plan; cross-reference against Pencil to identify missing steps/flows (e.g. the HeroCard for "no repos connected" state is missing a secondary button to view a demo appshell exploration — add it)
- `@architecture-brief.md` — partial architecture reference
- `@design-philosophy/Knowledge Base/animation-kowalski.md` — motion/microinteraction reference

**Repo conventions**
- Component locations: `/live` and `/imports`
- Buttons: replace every Pencil button with the closest match from the existing button system — no exceptions
- Icons/SVGs: replace all with Carbon equivalents per repo conventions
- Styling: use global CSS tokens/variables — exact matches to Pencil's hardcoded values. One grayscale gradient in Pencil is not a system token — hardcode it (its colors are system colors)
- shadcn as base layer where applicable; if a shadcn base isn't already in the repo, install via Context7
- Motion: cross-reference microinteractions (expandable rows, reveals, etc.) against existing appshell motion — e.g. sidepanel behavior. Dashboard motion must feel like the same product as the appshell

**Architecture reference**
- `backify-monorepo` repo on local Mac → `regional` page in locale: `layout.tsx` imports header + footer, a bare `<main>` sits between them with zero inner padding/gap, `<section>`s inside define spacing. Evaluate if this pattern is viable here or propose a better fit given how different this build is.

**Layout rule**
- Dashboard page inner content: `280px` horizontal padding, top-center alignment

**Demo content**
- Use the same hardcoded demo copy from the Pencil file throughout — do not invent new copy
- Structure demo content the same way the appshell does: demo content lives alongside but does not bleed into core components
</background>

<instructions>
1. Open `@component-book.pen` via the Pencil MCP. Read `Dashboard-Layouts-Container`, `Dashboard-Components-Kit-v2-Container`, and `DashboardNav-final`. Read **every** context comment before touching code.
2. Cross-reference Pencil designs with `dashboard-build-plan.md` and `architecture-brief.md`. Identify any flows, states, or components present in the MDs but missing from Pencil (e.g. the HeroCard secondary button for demo appshell exploration).
3. Propose and confirm layout architecture before building. Consider extracting the header/nav as a standalone component imported into `layout.tsx` so it persists across all sub-pages. Evaluate the `backify-monorepo` pattern; adopt or adapt as appropriate.
4. Build `DashboardNav-final` as an importable component and wire it into `layout.tsx`.
5. Build all required page components and nested components (rows inside grids, etc.) — expect a large number of new files.
6. Use shadcn as the base layer wherever it makes sense. Install missing shadcn bases via Context7.
7. Replace every Pencil button with the closest match from the existing button system.
8. Replace every icon/SVG with a Carbon equivalent.
9. Apply all styling via global CSS tokens. Hardcode only the one grayscale gradient (using system colors).
10. For every microinteraction (expandable rows, nested content reveals, etc.), reference existing appshell motion patterns (sidepanel etc.) and `animation-kowalski.md`. Motion must feel unified across the product.
11. Populate all pages/components with the Pencil demo copy. Structure it so demo content does not pollute core components — mirror the appshell's demo content approach.
12. Ensure the `HeroCard` (no repos connected state) includes a secondary button linking to a demo appshell exploration, as specified in `dashboard-build-plan.md`.
13. Inner content padding: `280px` horizontal, top-center aligned.
</instructions>

<request>
Build the complete user dashboard panel — layout, nav, all components, all pages/flows, demo content — as described above. Produce every required file.
</request>

<thinking>
Before writing any code:
- Fully parse all Pencil context comments and map them to components needed
- Diff Pencil against the MD docs to surface missing flows/states
- Decide on layout architecture (`layout.tsx` + header component pattern vs. alternatives)
- Map all Pencil hardcoded values to global CSS tokens; identify the one gradient that needs hardcoding
- Map all Pencil icons to Carbon equivalents
- Identify which shadcn bases are already in the repo vs. need installing
- Identify which existing appshell motion patterns apply to which dashboard interactions
</thinking>

<output_format>
- All new component files at correct `/live` or `/imports` paths
- `layout.tsx` (and any sub-layouts needed)
- A brief architecture summary: file tree of new files created, notes on any layout decisions made and why
- Flag any Pencil flows or states found in the MDs that were missing from Pencil, and confirm how each was handled
</output_format>

<reminders>
- Read every Pencil context comment before writing a single line of code — full understanding is a prerequisite, not optional.
- Every button → existing button system. Every icon → Carbon equivalent. Every color/spacing → global CSS token (one gradient exception only).
- Dashboard motion must be cross-referenced against appshell motion — the two parts of the product must feel unified.
- treat this dashboard build with the same completeness as the appshell build — fully populated, fully demonstrable, end-to-end.
</reminders>