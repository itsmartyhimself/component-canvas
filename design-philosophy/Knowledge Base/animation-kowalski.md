# Animation Principles — Emil Kowalski

Emil Kowalski is a design engineer known for a clear, practical philosophy of product motion. This document distills the principles, defaults, and technical judgments across his animation writing. Reference when deciding whether to animate, how motion should behave, which CSS properties to use, and what implementation tradeoffs preserve speed and trust. Use it as an operational guide, not a catalog of tricks.

---

## The Three Filters

Kowalski's animation philosophy starts with three filters: **Purpose**, **Frequency**, and **Speed**. These are not polish questions to ask after the interface is done. They are the decision system for whether motion belongs in the product at all.

**Purpose.** Animation must explain something, confirm something, preserve spatial continuity, or add a small amount of delight. If it does none of those, it is noise.

**Frequency.** The more often an interaction happens, the less animation it should have. Kowalski's strictest rule: **never animate keyboard-initiated actions.** These are the fastest, most repeated interactions in a product. Animation turns them into latency.

**Speed.** UI animation should stay **under 300ms**. Around **180ms** feels responsive. Around **400ms** feels sluggish. Perceived speed matters as much as actual speed.

The deeper principle is restraint: **sometimes the best animation is no animation.** A fast product with fewer effects often feels more intelligent than a slower product with more personality.

## What Animation Is For

**Feedback.** A button press scaling slightly down tells the user their action landed. **Explanation.** Some behavior is easier to understand in motion than in static form — cause and effect, system mechanics. **Spatial consistency.** Entering and exiting from consistent directions teaches the user how components behave without explanation. **Delight.** Valid, but the weakest reason to animate and the easiest to overuse. Works best on rare interactions.

The standard is not "does this look good?" It is "does this make the interface easier to parse, faster to trust, or more satisfying to use?"

## What Not to Animate

**Do not animate high-frequency actions.** Command palettes, keyboard navigation, rapid switching — bias toward zero animation. **Do not animate as default ornament.** Once every surface moves, users become blind to the signal. **Do not animate when motion fights comprehension.** Dense productivity flows benefit from steadiness more than personality. A spring may feel natural on a decorative element and wrong on a financial graph. **Do not animate because you can.** The presence of a library is not justification.

## Motion Defaults

**Default easing.** Use **`ease-out`** for enter/exit. **`ease-in-out`** for elements moving or morphing on screen. **`ease`** for simple hover changes. **`linear`** only for constant motion. **Unsure?** Default to **`ease-out`**.

Built-in CSS easing curves are usually too weak. Kowalski prefers custom cubic-bezier curves:

```css
--ease-breeze: cubic-bezier(.55, .085, .68, .53);
--ease-silk:   cubic-bezier(.52, .062, .64, .21);
--ease-swift:  cubic-bezier(.86, .04, .67, .24);
--ease-nova:   cubic-bezier(.73, .065, .82, .08);
--ease-crisp:  cubic-bezier(.92, .06, .77, .045);
--ease-glide:  cubic-bezier(.58, .06, .95, .32);
```

For image reveals and scroll animations: **`cubic-bezier(0.77, 0, 0.175, 1)`**. Explore curves at **easings.co** and **easing.dev**. Duration and easing should match the product's tone — elegance tolerates softer timing, utility biases toward immediacy.

## Natural Motion

**Nothing should appear from nowhere.** Scaling from **`0`** feels wrong. Start from **`0.9`** or higher — **`0.93`** is a good default. A combined `scale(0.5)` with opacity (Clerk's toast) works because the fade masks the small scale. **Press states:** a button at **`scale(0.97)`** on press gives tactile feedback with almost no visual cost.

**Springs are useful, not universal.** Spring animations — parameterized by **stiffness, damping, and mass** — make interactions feel natural. Framer Motion's `useSpring` interpolates value changes for mouse-position-based interactions where direct binding feels robotic. But springs suit decorative elements; they make information-dense products feel mushy. **Review with fresh eyes** — motion often seems better while building than it does the next day.

## Performance Is Part of the Design

**Target 60fps.** If motion isn't smooth, the rest stops mattering. **Animate `transform` and `opacity`** — these only trigger the composite step. `margin`, `padding`, `width`, `height` trigger layout → paint → composite.

**Transform specifics.** Percentage values in `translate()` are relative to the element's own size, not the parent's — `translateY(-100%)` moves up by its own height. This is how Sonner and Vaul work. `scale` affects children too — scaling a button scales its text and icons together. Independent `scaleX`/`scaleY` usually looks awkward.

**Prefer hardware-accelerated paths when the main thread is busy.** CSS transitions/animations and the Web Animations API run off the main thread. Framer Motion uses `requestAnimationFrame` (main thread) and drops frames under load.

## Interruptibility, Accessibility, Spatial Logic

**CSS transitions are naturally interruptible** — they interpolate from the current visual state to the next. Keyframes are not. Prefer transitions when state can change mid-motion. Interruptibility is a trust feature.

**Respect `prefers-reduced-motion`.** In CSS: `@media (prefers-reduced-motion: reduce)` with opacity-only substitutes. In Framer Motion: `useReducedMotion()` hook.

**Make animations origin-aware.** Popovers should scale from their trigger, not from center. Use `transform-origin` deliberately. In Radix: `var(--radix-dropdown-menu-content-transform-origin)`. In Base UI: `var(--transform-origin)`. Preserve directional logic — if something enters from one side, its exit should respect the same axis.

## Clip-Path as a First-Class Tool

**`clip-path`** is a motion primitive alongside `transform` and `opacity`. It clips visibility with no layout effect and hardware acceleration. Prefer it when animating height would create jank.

**`inset()`** is the workhorse: `inset(top right bottom left)`. `inset(100%)` hides everything. `inset(0)` reveals everything. The `round` keyword adds border-radius: `inset(0 75% 0 0 round 17px)`.

**Image reveal:** `inset(0 0 100% 0)` → `inset(0 0 0 0)` over **1000ms** with `cubic-bezier(0.77, 0, 0.175, 1)`. Trigger with CSS keyframes or `element.animate()`. For scroll-triggered reveals: Framer Motion's `useInView` with `once: true` and `margin: "-100px"`, or `useScroll` + `useTransform` + `useMotionTemplate` for scroll-linked reveals.

**Tabs technique** (Paco Coursey / Stripe): duplicate the tab list with active styling, overlay with `aria-hidden`, set `clip-path` dynamically from `offsetLeft`/`offsetWidth` of the active tab. Gives simultaneous color and position transitions. **Comparison slider:** overlay two images, adjust `clip-path: inset(0 50% 0 0)` on drag. No extra DOM, hardware-accelerated.

If not already using Framer Motion, prefer the native **Intersection Observer API** for scroll detection. The **Web Animations API** keeps animation logic co-located with triggers.

## Library Details

**Radix UI:** `--radix-popover-content-transform-origin`, `--radix-dropdown-menu-content-transform-origin`. Skips tooltip delay after first shown. **Base UI:** `--transform-origin`, `data-instant` attribute (apply `transition-duration: 0ms`), `data-starting-style` / `data-ending-style`. **Framer Motion:** `useSpring`, `useReducedMotion`, `useInView`, `useScroll`, `useTransform`, `useMotionTemplate`, interruptible animations. Runs on main thread. **CSS `@starting-style`** is the eventual native replacement for `useEffect` enter-animation patterns.

## Numerical Reference

| Parameter | Value | Context |
|---|---|---|
| Button press scale | `scale(0.97)` | `:active` pseudo-class |
| Min enter scale | `scale(0.9+)` | Never from `scale(0)` |
| Default enter scale | `scale(0.93)` | Recommended starting point |
| Max UI duration | **300ms** | General ceiling |
| Responsive control | **180ms** | Select, dropdown |
| Sluggish threshold | **400ms** | Feels slow |
| Tooltip transition | **125ms** | With `ease-out` |
| Subsequent tooltip | **0ms** | `transition-duration: 0ms` |
| Image reveal | **1000ms** | `cubic-bezier(0.77, 0, 0.175, 1)` |
| Blur mask | **2px** | `filter: blur(2px)`, last resort |
| Frame rate target | **60fps** | Minimum for smooth motion |
| Scroll trigger offset | `-100px` | `useInView` margin |

## Decision Frameworks

**Purpose beats flourish.** Motion is justified by utility. **Frequency beats novelty.** Repeated actions trend toward stillness. **Perceived speed beats nominal speed.** Easing shapes responsiveness as much as duration. **Performance beats ambition.** If an effect compromises smoothness, change the effect. **Cohesion beats isolated cleverness.** Motion matches the tone of the product. **Restraint beats density.** A few well-placed animations outperform constant movement.

## Quality Through Restraint

Great animation is rarely about adding more motion. It is about tightening judgment. Animation should make a product feel faster, clearer, and more trustworthy. When it slows the interface, obscures state, drops frames, or repeats too often, it stops being quality. Good animation feels alive. Great animation feels inevitable.
