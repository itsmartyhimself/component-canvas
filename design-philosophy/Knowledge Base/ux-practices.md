# UX Practices — Laws, Methods, and Defaults

The most useful UX work comes from a small set of cognitive laws applied with judgment, not from comprehensive theory. This document distills the operationally load-bearing parts of Jon Yablonski's *Laws of UX*, the European Accessibility Act, and tactical defaults from practicing designers and engineers. Reference when shaping hierarchy, reducing decisions, choosing copy, hitting accessibility, or settling whether something feels right. Use it as a working compass, not a glossary.

---

## Match the Mental Model

**Users spend most of their time on other sites.** Jakob's Law: people transfer expectations from familiar products. Form controls echo physical objects, shopping carts behave like grocery carts, and reset links live in the upper right because they always have. Mental models — internal representations of how a system works — are built from prior products, not from your design.

**Match before you invent.** Common patterns are common because users understand them. Novelty is a tax — you have to teach the user something they didn't ask to learn. Reserve invention for the rare places where the existing pattern actively fails.

**Be liberal in what you accept, conservative in what you send.** Postel's Law in interface form: accept variable inputs, normalize them quietly, return clear feedback. Match formats, accept loose phone numbers, forgive trailing whitespace, and don't punish a user for the shape of their data.

**The paradox of the active user.** Users skip manuals and start clicking. They don't optimize, don't read tooltips, don't learn shortcuts you didn't surface. Build instruction into the workflow itself — contextual prompts at the moment of confusion, not before.

## Cognitive Limits

**Working memory is small and short.** It holds 4–7 chunks for 20–30 seconds before fading without rehearsal. The ceiling is meaningless if information is unchunked: `XSIDNEGU` is hard, `UX DESIGN` is easy. Chunking is the lever — group related controls, segment phone numbers, paginate dense lists, surface step counts in flows.

**Recognition beats recall.** Working memory cannot be relied on across screens. Make decisions visible — visited-link styling, breadcrumbs, sticky comparison tables, persistent filter chips. Anything the system can carry on the user's behalf should be carried.

**Attention is selective.** Users filter aggressively for goal-relevant signal — content shaped like an ad gets ignored even when it isn't one (banner blindness). Cognitive load splits between intrinsic (the task at hand) and extraneous (the interface itself). The interface's only job is to drive extraneous load toward zero.

**Perception is biased.** Curse of knowledge makes designers overestimate what users already understand. Confirmation bias contaminates research synthesis. The Hawthorne effect inflates engagement during usability testing. Treat your own intuition skeptically and your user data as pattern-matching, not proof.

## Information Hierarchy

**Gestalt does the work of grouping.** Proximity: items close together read as related. Similarity: items sharing shape, color, or size read as a family. Common region: items inside a shared border or background read as a cluster. Uniform connectedness: items joined by a line read as related. Prägnanz: ambiguous shapes resolve to the simplest possible interpretation.

**Use one grouping signal at a time.** Stacking proximity with backgrounds with borders with similarity makes the hierarchy fight itself. Pick the lightest cue that works — usually proximity — and add others only when it doesn't.

**The serial position effect.** Users remember the first and last items in a list better than the middle. Anchor primary actions to the start or end of navigation; bury low-importance items in the middle.

**Von Restorff effect.** What differs is what's remembered. A single highlighted CTA outperforms five competing ones. Restraint is the cost of contrast — once everything is emphasized, nothing is.

**Fitts's Law.** Time to acquire a target is a function of distance and size. Make tap targets large, primary actions close to the user's last touchpoint, and screen edges and corners — which behave as infinitely large on touch and pointer — preferred for frequent actions.

## Choice and Action

**Hick's Law.** Decision time grows with the number and complexity of options. Limit visible choices, highlight a default or recommendation, break long forms into steps, and use progressive disclosure for advanced options. Be careful not to abstract so far that the user can't tell what they're picking.

**Choice overload.** Beyond a threshold, more options reduce satisfaction even when they expand capability. Side-by-side comparison and clear differentiation rescue the choice — a flat list of twenty plans does not.

**Tesler's Law of Conservation of Complexity.** Every system has irreducible complexity; the only question is who absorbs it — the user or the designer. One engineer-week saving complexity beats millions of user-minutes lost to it. Default to absorbing it.

**Occam's Razor.** Among equivalent designs, prefer the one with fewer assumptions. Strip features, words, and decorations until removing more would damage the experience — then stop.

**Pareto Principle.** Roughly 80% of value comes from 20% of effort. Don't polish every surface equally — chase the 20% of flows where most users live, and accept thin coverage on the rest. The rare surface still ships, but doesn't deserve obsession.

## Time and the Memory of Experience

**Doherty Threshold.** Productivity sustains when system response stays under 400ms. Below it, attention holds. Above it, users disengage and start checking other tabs. Use perceived performance — skeleton states, optimistic UI, animated progress — when actual response can't make it.

**Goal-gradient and Zeigarnik.** Motivation accelerates as users approach a goal, and incomplete tasks linger in memory more than completed ones. Show progress explicitly — checklists with crossed-off steps, percentage bars, "3 of 5" counters. An almost-finished profile pulls the user back; a numberless one doesn't.

**Peak-end rule.** Users judge an experience by its emotional peaks and its ending — not its average. Engineer the peaks: the moment a payment confirms, the moment a search returns the right result, the moment an empty state turns into a first item. Engineer the closes: error recovery, confirmation modals, sign-out. Negative peaks are remembered more vividly than positive ones — fix the worst moments before adding new highs.

**Aesthetic-usability effect.** Users rate good-looking interfaces as more usable, even when they aren't. Beauty buys forgiveness for minor flaws — and conceals usability problems during testing. Run usability research on rough fidelities to keep the aesthetic from masking the flow.

**Parkinson's Law.** Tasks expand to fill the time allotted. Beat the user's expected duration: autofill, sensible defaults, one-click actions on repeat tasks. Faster than anticipated reads as competent.

## Accessibility as the Default

**POUR is the spine.** Perceivable, Operable, Understandable, Robust — the four WCAG principles that everything else operationalizes. Accessibility starts at design and code, not at audit.

**Shift left.** Fixing accessibility issues during design costs ~1× the engineering hour. Implementation, ~6.5×. Testing, ~15×. Maintenance, ~100×. Teams that integrate accessibility into the workflow add 1–5% to total effort. Teams that bolt it on at the end double or triple it.

**Compliance is a floor, not a ceiling.** WCAG 2.1 A and AA are the European Accessibility Act's threshold (effective June 28, 2025); 2.2 adds further AA criteria worth meeting. 4.5:1 contrast for normal text, 3:1 for large text, 3:1 for UI components and graphical objects (1.4.11). Touch targets at minimum 24×24 CSS pixels (2.5.8), with 44pt iOS / 48dp Android as practical minimums. Reflow without horizontal scroll at 320 CSS px (1.4.10); text remains usable at 200% zoom; layout works in both portrait and landscape (1.3.4).

**Semantic HTML before ARIA.** Native elements carry built-in accessibility. `<button>` for actions, `<a href>` for navigation — never `<div onClick>` without role and keyboard handlers. One `<h1>` per page; don't skip heading levels. Landmarks (`<main>`, `<nav>`, `<aside>`, `<footer>`) let assistive tech jump by region. Form inputs paired with `<label>` via `for`/`id` — placeholder text is not a label. Reach for ARIA only when native semantics can't express the pattern, then verify it actually helps a screen reader rather than adds noise.

**Tab order is design, not afterthought.** Every interactive element must be reachable by keyboard, in a sequence that matches visual order. CSS reorder tricks (`flex-direction: row-reverse`, `order`, absolute positioning) silently break this — verify Tab traversal after layout. Visible focus rings always; never `outline: none` without an alternative indicator. Focus must not be obscured by sticky headers or floating elements (2.4.11). Modal dialogs trap focus inside and return it to the trigger on close; `Escape` dismisses. Skip links to `#main` are the first focusable element on long pages.

**Forms forgive.** Errors identify the field and describe how to fix it — never red-only, never generic. Don't strip whitespace silently from password fields. Don't force redundant entry of information already provided in the same flow (3.3.7). Avoid cognitive function tests for authentication where alternatives exist (3.3.8) — let users paste passwords and never block password manager autofill.

**Hover and tooltip.** Content triggered by hover or focus must be dismissible without moving the pointer, hoverable so the user can move into it without losing it, and persistent until explicitly dismissed (1.4.13). Tooltips that vanish before they can be read fail accessibility and good UX both.

**Motion, time, and media.** `prefers-reduced-motion` replaces large transforms with opacity-only fades. Autoplaying media starts muted with a visible pause control. Time-outs warn and offer extension before discarding state. Drag interactions have a single-pointer alternative (2.5.7). Informative images get descriptive `alt`; decorative images get `alt=""` (never omit). Video carries captions; audio carries transcripts; charts carry a text summary or data table. Don't rely on color alone — pair with shape, label, or position.

**Disability is the largest minority.** ~1.3 billion people globally have a significant disability. 57% of working-age computer users benefit from accessibility tech. Every accessible improvement compounds for situational impairments — bright sunlight, noisy environments, one-handed use.

**Verify, don't assume.** Stark, axe DevTools, WAVE, and Lighthouse for automated checks — they catch ~30% of issues. Manual: keyboard-only navigation, screen-reader pass (VoiceOver, NVDA, JAWS), focus-order audit, color-blindness simulator, reflow at 320 CSS px and 200% zoom. When generating UI code, treat tab order, focus indicator, semantic role, and contrast as part of "done" — not a follow-up pass.

## Practical Tips

| Scenario | Solution |
|---|---|
| Selected list item hidden behind a sticky header or scroll-fade | `scroll-padding-top` on the scroll container, matching the fade height |
| Web type renders heavier than the Figma preview | `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale` (or Tailwind `antialiased`) |
| Long form abandoned at the end | Show progress indicator with completed steps; Zeigarnik pulls users back |
| Banner-shaped section ignored despite useful content | Restyle to match content shape; banner blindness applies even to non-ads |
| Choice paralysis on pricing or plan pages | Side-by-side comparison; default-recommended option highlighted |
| Users abandon during waits | Skeleton states, optimistic UI, perceived progress under 400ms |
| Color-only error indication missed by some users | Pair with icon, label, or position |
| Low-importance items lost in middle of list | Move primary actions to start or end (serial position) |
| One CTA among five fights for attention | Strip the four others; restraint is the cost of contrast |
| Edit fields rejecting reasonable inputs | Accept liberally, normalize on submit (Postel) |
| Tooltip disappears before it can be read | Make hover content dismissible, hoverable, and persistent (WCAG 1.4.13) |
| `<div onClick>` button generated instead of `<button>` | Use semantic HTML; `<button>` carries focus, role, and keyboard handlers free |

## Numerical Reference

| Parameter | Value | Context |
|---|---|---|
| Doherty Threshold | **400ms** | System response ceiling for sustained engagement |
| Working memory | **4–7 chunks** | Fade after 20–30s without rehearsal |
| WCAG contrast — normal text | **4.5:1** | Level AA |
| WCAG contrast — large text | **3:1** | Level AA |
| WCAG contrast — UI components | **3:1** | Level AA (1.4.11) |
| Minimum touch target | **24×24 CSS px** | WCAG 2.2 AA (2.5.8); 44pt iOS / 48dp Android in practice |
| Accessibility cost ratio | **1× → 100×** | Design phase vs. maintenance phase |
| Shift-left overhead | **1–5%** | Of total effort, when integrated upstream |
| Pareto split | **80/20** | 80% of value from 20% of inputs |
| EAA enforcement | **June 28, 2025** | WCAG 2.1 A + AA required |
| Global disability prevalence | **~1.3B people** | World's largest minority |
| Automated a11y coverage | **~30%** | Of total issues; manual catches the rest |
| Reflow viewport minimum | **320 CSS px** | WCAG 1.4.10 |

## Decision Frameworks

**Match before you invent.** Familiarity is faster than novelty. Reserve invention for where the pattern actively fails. **Reduce before you refine.** Fewer choices, fewer words, fewer steps — then polish. **Recognize over recall.** What the system can carry, the user shouldn't have to. **Restraint is the cost of contrast.** A standout requires stillness around it. **Real over rational.** Design for users skipping manuals, not users reading them. **Peaks over averages.** A few engineered highs beat uniform competence. **Shift left.** Fix early when it costs 1×; not late when it costs 100×. **Native before ARIA.** Reach for `role` only when semantic HTML can't carry the meaning.
