# Initial task: research + app shell layout

We are building a modern substitute for Storybook: a desktop-only product for previewing and demonstrating UI components.

This product is inspired by:
- Storybook for previewing components, variants, states, and documentation
- shadcn/ui website for browsing, finding, and selecting components
- Figma/FigJam for a smart canvas-like presentation surface

## Important product definition

This is **not** a component editor.

Do **not** optimize for editing component source, drag-building interfaces, or visual authoring. The purpose is to:
- preview components
- demonstrate variants, sizes, states, and breakpoints
- browse and organize components
- share links and references to showcased components

Primary users are developers and designers first, with PM/marketing possibly later.

---

## What I need you to do first

### 1) Research before building
Do not jump straight into implementation.

Research and summarize the relevant patterns behind:
- Storybook and modern alternatives
- component preview / showcase tools
- smart finite/infinite canvas patterns
- Figma/FigJam-style canvas interaction models
- how preview tools handle viewport resizing, zooming, and panning
- how component import systems typically work
- how these systems store metadata, states, variants, folders, and previews

Also look into:
- how a future import flow could work from a repo or component file
- whether importing a `tsx` component or component folder is realistically feasible
- what architectural constraints we should expect for rendering third-party imported components safely

I do **not** need a giant report. I need practical findings that influence the product shell and architecture.

### 2) Then implement only the initial shell layout
After research, build the **first design/layout pass only**.

Do **not** populate features yet.
Do **not** build import flows yet.
Do **not** build backend yet.
Do **not** build component editing tools.

The immediate goal is just the foundational app layout:
- page shell
- left sidebar
- right canvas area
- responsive internal flex behavior for desktop
- clean structure that can support future zoom/pan/viewport behavior

---

## Layout specification

### Overall page
Use a product-style full-viewport layout.

The root page should behave like:
- full viewport
- horizontal layout
- children aligned from top-left
- `12px` gap between primary children
- `12px` inner padding on all sides

The root layout has exactly two direct children:
1. left sidebar
2. right canvas area

### Left sidebar
Default/expanded state:
- width: `280px`

Collapsed state:
- width: `64px`

Sidebar styles:
- horizontal padding: `8px`
- vertical padding: `12px`
- no corner radius
- no separate fill
- it should visually blend into the page background

Purpose of sidebar later:
- browse components
- search
- import
- remove
- re-import/update
- create folders
- organize
- share
- select active component to render on canvas

For now, just create the shell and collapsed/expanded structural behavior if reasonable.

### Right canvas area
The canvas area should:
- fill remaining width
- act as the main preview surface
- be structured in a way that can later support viewport logic, zooming, panning, overlays, drawers, and property panels

Styling:
- `24px` corner radius
- `0px` inner padding on the outer canvas wrapper

You may introduce an inner canvas content wrapper if that creates a better long-term structure for:
- overflow handling
- scroll behavior
- viewport transforms
- future zoom/pan systems

I am specifically unsure about the best structure here, so choose a sensible architecture that supports a future “smart canvas” model.

---

## Canvas behavior direction

This is **not** a true freeform Figma board where users enter a huge world full of objects.

Instead, think of it as a **smart canvas**:
- a selected component renders onto it
- it should eventually handle different component sizes
- it should eventually support different breakpoints/viewports
- it should eventually support zoom in/out
- it should eventually support moving around the preview area in a fluid way
- it may later support panels/drawers/modals for properties, variants, and implementation docs

So the canvas should be future-friendly for:
- component preview
- viewport resizing
- zooming/panning
- variant/state switching
- code/documentation overlays

But right now, do not implement all of that. Just structure the layout so those features can be added cleanly.

---

## Visual tokens for now

Hardcode temporary colors for the first pass:
- page background: `#EFF0F5`
- canvas background: `#FFFFFF`

Sidebar should have no distinct fill and therefore appear as the same color as the page background.

These are temporary hardcoded values only.
Later they will become semantic tokens in global CSS.

---

## Constraints

- Desktop only
- Do not overcomplicate the first implementation
- Do not populate the sidebar or canvas with real feature content yet
- Do not build the backend yet
- Do not invent editing functionality
- Keep the implementation clean and extensible
- Prefer a layout and DOM structure that will age well as the product grows

---

## Deliverables

Please do the work in this order:

1. Research relevant product/UI/architecture patterns
2. Give me a concise summary of the findings and how they affect implementation
3. Propose the layout structure you think is best
4. Implement the initial app shell
5. Explain key structural decisions briefly
6. Update `CLAUDE.md` with any valuable project context you learned, especially:
   - actual tech stack
   - architectural decisions
   - conventions worth preserving

---

## Acceptance criteria for the first pass

The first pass is successful if:
- the app fills the viewport cleanly
- the root layout has the specified spacing
- the sidebar and canvas proportions are correct
- the sidebar supports expanded vs collapsed structure
- the canvas is clearly the main preview area
- the structure feels like the beginning of a real desktop product, not a marketing page
- the code leaves room for future zoom/pan/viewport systems without needing a large refactor