# interaction-raphael

---

## Springs vs. Easing

The real question before choosing a curve: **is this motion reacting to the user, or is the system announcing a change?**

**Springs** when the user drives — dragging, flicking, pressing, gesture interactions. Springs survive interruption and reflect input energy. Fast drag snaps back faster. They don't assume the interaction is finished. If continuity and interruption matter, easing curves fall apart. Springs hold up.

```tsx
// Gesture-driven / snappy interaction
transition={{ type: "spring", stiffness: 900, damping: 80, mass: 10 }}

// Toast / notification
transition={{ type: "spring", stiffness: 500, damping: 30 }}
```

**Easing curves** when the system announces: entrances, exits, state changes, attention guidance. The system knows when the interaction is done; it can run a fixed-duration animation.

**Linear** when the animation represents time: progress bars, loaders, scrubbing. Easing breaks the one-to-one relationship between time and progress.

**Spring parameters.** Stiffness: onset speed. Damping: whether it oscillates or settles cleanly. Mass: how heavy the object feels. High stiffness + low damping = snappy but unstable. High damping + low stiffness = sluggish but secure.

**Easing anatomy.** `cubic-bezier(x1, y1, x2, y2)`. x1,y1 shapes responsiveness — how quickly motion begins. x2,y2 shapes the landing. If an animation feels uncomfortable at the end, x2,y2 is where to look. **Fix the duration before the curve** — shortening timing nearly always improves perceived responsiveness first.

---

## AnimatePresence Mastery

**`useIsPresent`.** Returns `true` while mounted, `false` during exit. Lets a component know it is leaving — disable interactions, switch content, trigger cleanup. Must be called inside a child of `AnimatePresence`, not in the parent that conditionally renders.

```tsx
function Card() {
  const isPresent = useIsPresent();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    >
      {isPresent ? "Mounted content" : "Exit content"}
    </motion.div>
  );
}
```

**`usePresence` + `safeToRemove`.** Manual exit control. Exit animation starts immediately. Async work (saving drafts, network request, handing off to GSAP) runs in parallel. Element stays mounted until `safeToRemove()` is called — both must complete before unmount.

```tsx
function Notification() {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      const timer = setTimeout(() => safeToRemove(), 500);
      return () => clearTimeout(timer);
    }
  }, [isPresent, safeToRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {isPresent ? "Notification" : "Cleaning up..."}
    </motion.div>
  );
}
```

**`propagate` prop.** Removing a parent `AnimatePresence` kills child exits by default. `propagate` fires both.

```tsx
<AnimatePresence>
  {show && (
    <motion.div exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}>
      <AnimatePresence propagate>
        {items.map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )}
</AnimatePresence>
```

**Modes.**
- `sync`: entering and exiting simultaneously — crossfades, both elements visible at once
- `wait`: exit finishes before entrance starts — doubles perceived duration; compensate by shortening individual durations
- `popLayout`: exits immediately leave document flow (become absolutely positioned) — use for list reordering, morphing layouts, or when parent bounds need to update in sync with the animation

---

## Animating Container Bounds

`width` and `height` are not animatable in CSS — the browser cannot interpolate between a fixed value and `auto`. Containers snap. The fix is two divs: the outer `motion.div` is animated, the inner `div` is measured.

```tsx
function useMeasure() {
  const [element, setElement] = useState(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const ref = useCallback((node) => setElement(node), []);

  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
}
```

```tsx
// Animated height (accordions, expandable sections)
<motion.div animate={{ height: bounds.height > 0 ? bounds.height : "auto" }}>
  <div ref={ref}>{children}</div>
</motion.div>

// Animated width (morphing button labels)
<MotionConfig transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1], delay: 0.05 }}>
  <motion.button animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}>
    <div ref={ref}>
      <motion.span
        key={label}
        initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        exit={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1], delay: 0.05 }}
      >
        {label}
      </motion.span>
    </div>
  </motion.button>
</MotionConfig>
```

**Gotchas.** Guard `bounds > 0 ? bounds : "auto"` on mount — without it the container animates from 0 on first render. Never put both `ref` and `animate` on the same element — creates a feedback loop. `delay: 0.05` gives the natural feel of content catching up.

---

## Laws of UX

**Fitts's Law.** Time to reach a target is a function of size and distance. Use `::before` to expand hit areas invisibly:

```css
button { position: relative; }
button::before {
  content: '';
  position: absolute;
  inset: -8px;
}
```

**Hick's Law.** Decision time increases logarithmically with choices. 2→4 is noticeable. 8→16 is painful. Solution: progressive disclosure — show what matters now, reveal complexity on demand.
**Miller's Law.** Working memory holds ~7 items (±2). Chunk data or comprehension drops. `415-867-5309` processes faster than `4158675309`. Same data, different cognitive load.
**Doherty Threshold.** Under 100ms: instant. Under 400ms: noticeable. Over 2000ms: feels broken. If you can't make something fast, make it feel fast — optimistic UI, skeleton screens, progress indicators.
**Postel's Law.** Accept messy human input, output clean format. Users type meaning, not format. Validate generously, format strictly.

---

## View Transitions & Pseudo-elements

**View Transitions API.** `document.startViewTransition()` snapshots the DOM, applies changes, then generates a pseudo-element tree to animate between states. Replaces JavaScript-heavy morphing for lightboxes, page transitions, and shared-element animations.

```css
::view-transition-group(card) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
```

Assign the same `view-transition-name` to both source and destination. Inside the transition callback, remove it from the source and assign to the destination. The browser interpolates position, size, and style automatically.

**`::before` hover background** — tactile scale effect without extra markup:

```css
button { position: relative; overflow: hidden; }
button::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: currentColor;
  opacity: 0;
  transform: scale(0.95);
  transition: transform 150ms ease, opacity 150ms ease;
}
button:hover::before { opacity: 0.06; transform: scale(1); }
```

---

## Numerical Reference

| Parameter | Value | Context |
|---|---|---|
| Doherty — instant | < 100ms | Feels like extension of hand |
| Doherty — threshold | < 400ms | Noticeable but acceptable |
| Doherty — broken | > 2000ms | User questions if it worked |
| Press / hover | 120–180ms | Easing curves; springs have no fixed duration |
| Small state changes | 180–260ms | Dropdowns, badges, icon swaps |
| Larger transitions | up to 300ms | Panels, modals |
| View transition | 300ms | `::view-transition-group` timing |
| Working memory cap | 7 ± 2 items | Miller's Law — chunk past this |
| Spring — toast | stiffness 500, damping 30 | Notification / toast |
| Spring — gesture | stiffness 900, damping 80, mass 10 | Snappy drag / gesture |
| Morphing label ease | `[0.19, 1, 0.22, 1]` | Container bounds, label morphs |

---

## Practical Tips

| Scenario | Solution |
|---|---|
| Container snaps on content change | Two-div bounds: `motion.div` outer + `useMeasure` inner |
| Element exits without animating | Wrap with `AnimatePresence` |
| Nested children vanish on parent exit | `propagate` on inner `AnimatePresence` |
| List reorder / layout jumps | `mode="popLayout"` — exits leave flow immediately |
| Drag / gesture feels robotic | Spring — survives interruption, reflects input energy |
| Progress bar easing looks wrong | `linear` — easing breaks the time/progress relationship |
| Button hard to tap | `::before` expanded inset (Fitts's Law) |
| Animation feels slow | Fix duration first, then the curve |
| Too many choices cause hesitation | Progressive disclosure (Hick's Law) |
| Input rejects valid formats | Accept any format, normalize output (Postel's Law) |

---

## Decision Frameworks

**User-driven → spring. System-driven → ease.** Motion reacting to input needs to survive interruption. Motion announcing state can run a fixed timeline.
**Sequential > simultaneous.** Animate one element at a time when staging complex reveals.
**Perceived speed is real speed.** How fast something feels is what the user experiences. Optimistic UI and skeletons are not tricks.
**Emotion scales exaggeration.** Errors warrant more exaggeration than button hovers.
**Craft is the differentiator.** When AI can generate any feature, the feeling of using software is the product. Great animation is invisible.
