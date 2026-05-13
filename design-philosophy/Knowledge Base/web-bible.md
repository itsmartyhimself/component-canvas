# Web Interface Bible

Details that make a good web interface.

---

## Interactivity

Form and list behavior compounds into perceived quality. These are the details users notice without naming.

- Clicking the input label should focus the input field
- Inputs should be wrapped in `<form>` to submit on Enter
- Inputs should have an appropriate `type`: `password`, `email`, etc
- Inputs should disable `spellcheck` and `autocomplete` most of the time
- Inputs should use the `required` attribute and native HTML validation where appropriate
- Input prefix/suffix decorations (icons) should be absolutely positioned inside with padding, not adjacent — and must still trigger input focus
- Toggles should immediately take effect — no confirmation required
- Buttons should be disabled after submission to prevent duplicate requests
- Interactive elements should have `user-select: none` on inner content
- Decorative elements (glows, gradients) should have `pointer-events: none`
- Interactive elements in a list: no dead areas between items — increase padding instead

## Typography

Legibility defaults are off. Most of these are set once and forgotten.

- Apply `-webkit-font-smoothing: antialiased`
- Apply `text-rendering: optimizeLegibility`
- Subset fonts to content, alphabet, or relevant language(s)
- Font weight must not change on hover or selected state — causes layout shift
- Do not use font weights below 400
- Medium headings look best at `font-weight: 500–600`
- Use `clamp()` for fluid type: e.g. `font-size: clamp(48px, 5vw, 72px)`
- Apply `font-variant-numeric: tabular-nums` in tables, timers, or anywhere layout shift matters
- Prevent iOS landscape zoom with `-webkit-text-size-adjust: 100%`
- Apply `text-wrap: balance` to headings and `text-wrap: pretty` to paragraphs — balance distributes line lengths evenly; both prevent orphaned words

## Motion

Keep animation proportional and purposeful. Frequent actions should trend toward no animation.

- Theme switching must not trigger transitions — disable and re-enable around the toggle (see appendix)
- Animation duration should not exceed 300ms for interactions to feel immediate
- Animation values must be proportional to trigger size:
  - Dialogs: fade + scale from ~0.93, not 0 → 1
  - Button press: scale ~0.97 on press, not 1 → 0.8
- Use CSS transitions for interactions, not keyframe animations — transitions retarget mid-flight when interrupted; keyframe animations run to completion regardless
- Avoid animation on frequent, low-novelty actions:
  - Opening a right-click menu
  - Adding or removing list items
  - Hovering trivial buttons
- Exit animations should be more subtle than enters — a fixed small offset (e.g. `-12px`) works better than animating the full height; keep the blur
- Stagger entering elements individually with 80–100ms delays — animating the container as one block looks cheaper than its parts animating separately
- Looping animations should pause when not visible on screen
- Use `scroll-behavior: smooth` for in-page anchor navigation with an appropriate offset

## Touch

Touch devices have distinct input characteristics. Most issues surface late in QA.

- Use `@media (hover: hover)` to prevent hover states from firing on touch press
- Input `font-size` must be at least 16px — smaller triggers iOS zoom on focus
- Inputs should not autofocus on touch — the keyboard covers the screen
- Add `muted` and `playsinline` to `<video>` for iOS autoplay
- Disable `touch-action` on custom pan/zoom components to avoid native gesture interference
- Disable the iOS tap highlight with `-webkit-tap-highlight-color: rgba(0,0,0,0)` — always replace it with an explicit alternative

## Optimizations

Performance is a feature. These apply most to animation, video, and rendering-heavy surfaces.

- Large `blur()` values on `filter` / `backdrop-filter` are slow
- Scaling or blurring filled rectangles causes banding — use radial gradients instead
- Use `transform: translateZ(0)` sparingly for GPU promotion on heavy animations
- Toggle `will-change` only for the duration of a problematic animation — not preemptively
- When using `will-change`, name the exact property (`transform`, `opacity`) — `will-change: all` reserves GPU memory with no benefit
- Autoplay on too many off-screen iOS videos will choke the device — pause or unmount them
- Use refs to bypass React's render cycle for real-time values that commit directly to the DOM
- Detect and adapt to hardware and network capabilities using adaptive loading

## Accessibility

Accessibility is structure, not a checklist. Most failures are architectural.

- Disabled buttons should not have tooltips — they are not in tab order and the tooltip will never be announced
- Use `box-shadow` for focus rings — `outline` won't respect `border-radius` in older Safari (fixed in 16.4, but not everyone updates)
- Focusable elements in a sequential list should be navigable with ↑ ↓
- Focusable elements in a sequential list should be deletable with ⌘ Backspace
- Dropdown menus should trigger on `mousedown`, not `click`, to open immediately on press
- Use an SVG favicon with a `<style>` tag respecting `prefers-color-scheme`
- Icon-only interactive elements must have an explicit `aria-label`
- Tooltips triggered by hover must not contain interactive content
- Images should always use `<img>` — screen readers announce them; users can right-click copy
- HTML illustrations should have an `aria-label` — don't expose raw DOM structure to screen readers
- Gradient text should unset the gradient on `::selection`
- Nested menus should use a prediction cone so the pointer can cross adjacent elements without closing the menu

## Design

System-level patterns that surface in every product and are easy to get wrong.

- Optimistically update local data — roll back on server error with feedback
- Auth redirects should happen server-side before the client loads, to avoid janky URL changes
- Style `::selection` globally
- Display feedback relative to its trigger:
  - Successful copy → inline checkmark, not a notification
  - Form error → highlight the relevant input(s)
- Empty states should prompt to create a new item, with optional templates
- Concentric border radius: outer minus padding equals the correct inner radius — e.g. a 20px outer with 8px padding means the inner element takes 12px

---

## Appendix: Disable Transitions on Theme Toggle

Toggling themes fires CSS transitions on elements built for interaction — hover states, color changes, etc. Adding a global transition handles it poorly and misses images and non-animatable properties. The fix: strip all transitions before the toggle, apply the change, force a repaint, then restore.

```js
const css = document.createElement('style')
css.appendChild(document.createTextNode(`* {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  -ms-transition: none !important;
  transition: none !important;
}`))
document.head.appendChild(css)

// toggle theme here (class on <html> or <body>)

// force repaint before removing
const _ = window.getComputedStyle(css).opacity
document.head.removeChild(css)
```

`requestAnimationFrame` before removal is unreliable — elements still transition. `getComputedStyle` forces all active stylesheets to apply and works consistently across every major browser. For Next.js, `next-themes` handles this automatically.
