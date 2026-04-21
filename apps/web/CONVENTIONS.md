# Component Canvas — Project Conventions

## Component Architecture

Two folders under `apps/web/components/`:

1. **`imports/shadcn/`** — Base components from shadcn/ui and Radix. Never edit these. Never use directly in app code. They provide structure and a11y only.

2. **`live/`** — App components that wrap imports and apply all visual styling via the token system. This is where all application UI lives.

## Styling Rules

- **Tailwind** is for layout and behavior only: `flex`, `grid`, `items-center`, `gap-*`, positioning, display. Zero default Tailwind visual values.
- **All visual design** (color, radius, spacing, typography) uses CSS variables from `globals.css`.
- **Style props** with `var()` for spacing, primitives, and anything not mapped to a Tailwind utility.
- **Typography** via `.type-1` through `.type-13` classes. Never use `text-sm`, `text-lg`, etc.
- Zero stock Tailwind or shadcn visual fingerprints in the final output.

## Token System

- All tokens live in `apps/web/app/globals.css` under `:root`.
- Only semantic tokens are mapped in `@theme inline {}`.
- Primitives exist but never get Tailwind bindings.
- If a token is missing, ask — don't invent.

## SVG Standards

- Static SVG files live in `apps/web/public/SVGs/`.
- Components reference SVGs from `/SVGs/filename.svg`, not as inline React components.
- All SVGs **must** have `viewBox` attributes — no exceptions.
- Color overrides via `.icon-colored` CSS class or `currentColor` inheritance.
- `@carbon/icons-react` is available for programmatic icon use.
- Run `scripts/copy-icons.ts` to extract specific Carbon icons into `public/SVGs/`.

## Scroll Containers

- Any horizontal scroll container must set `overscroll-behavior-x: contain`.
- Without this, sideways trackpad swipes trigger browser back/forward navigation, which hijacks the user's scroll intent.
- Apply via a shared class (`.scroll-container`) or directly on the element. Never leave a horizontal scroller without it.

## Lazy Loading

This is a core architectural convention, not an afterthought.

- **Viewport-only rendering**: anything not currently visible must not render or load assets.
- Images load thumbnails first, full resolution on viewport entry (Intersection Observer).
- iframes mount only when visible, unmount when scrolled away.
- Feed pagination is cursor-based, not offset-based.
- Backend returns metadata only; full assets are requested on demand.
