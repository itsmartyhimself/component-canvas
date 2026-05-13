# Interaction Design — Rauno Freiberg

Gesture timing, spatial motion, novelty, and choreography. Kowalski covers animation defaults. Raphael covers springs and UX laws.

---

## Swipe Gesture Timing

- Trigger **during the gesture** for lightweight, non-destructive actions (overlays, peeks)
- Trigger **on gesture end** for destructive or high-commitment actions — never commit an irreversible action on mid-gesture threshold crossing
- Showing zero feedback until threshold, then snapping, feels broken — the interface seems unresponsive at lower velocity

## Responsive Gestures

- Gestures must give visual feedback at the first frame of input, even when the action triggers later
- Apply scale delta or resistance in real-time → snap or complete only after threshold is crossed
- Animations that cannot be interrupted mid-gesture make the interface feel brittle

## Spatial Consistency

- Animate from where the thing logically lives: sheets enter from bottom, dropdowns from trigger, list items return where they came from
- Exit direction should reverse entry — not fade to center
- When source is ambiguous, animate from the icon; when singular, animate from the source

## Novelty

- **90% familiar, 10% novel** — novelty only works as contrast against sameness
- High-frequency actions lose novelty fast — they deserve speed, not flourish
- Reserve novel animations for rare moments: first login, onboarding, one-time reveals
- One-time animations should not repeat on return — set a flag and skip after first run
- Every non-standard interaction pattern is a novelty tax the user must pay to learn it

## Choreographing Motion

- Elements sharing space should not reveal simultaneously — sequence them
- Prioritize motion near the trigger first, then reveal other elements after
- Discrete states: blur background → surface content → transition input → settle on release
- Each state responds to what just finished, not running in lockstep

## Staggering Motion

- Sibling elements in perfect synchrony look mechanical — offset their timing
- Stagger list reveals, grid loads, and unlock animations for perceived depth
- A few milliseconds between siblings is enough — goal is to break lockstep, not perform a sequence

## Indicating Affordance

- How an element animates out signals whether it can be recovered
- Blur + fade out = behind the modal layer, not currently reachable
- Slide out at full opacity = still reachable, reverse the gesture to recall it
