# UX Copywriting — Rules and Defaults

This document is a working ruleset for writing product copy. It covers interface text, error messages, labels, buttons, confirmations, and help copy. Use it when writing any string the user reads. Not as a style guide — as a decision system.

---

## The Core Principle

Every word in the UI is a tax. It costs the user attention. The question is never "how should I phrase this?" It is "does this need to exist at all?"

Copy earns its place by doing one job: reducing friction between a user and their next action. If the copy explains what the UI already shows, it fails. If it hedges, qualifies, or encourages, it usually fails. If removing it changes nothing, remove it.

## Clarity Before Personality

Keep personality out of functional copy. "Oops! Something went wrong" is not warm — it is vague and infantilizing. "We couldn't complete your request. Try again in a moment." says the same thing without performing an emotion.

Warmth in product copy comes from precision. Knowing exactly what happened and what to do next is more reassuring than any friendly tone.

Do not use:
- Exclamation points in functional text
- Ellipsis as suspense ("Almost there...")
- Casual hedging ("just", "simply", "quickly", "easily")
- Marketing phrases ("unlock the power of", "seamless experience")
- Vague timelines ("soon", "shortly", "as soon as possible")

## Language Rules

**Active, not passive.** "Deploying your cluster." not "Your cluster is being deployed." Active voice matches the user's mental model — they did something; something is now happening.

**Action-first.** Buttons name the action they trigger: "Deploy Cluster", "Confirm Order", "Generate API Key". Not "Submit". Not "OK". Not "Done" if you can say what's done.

**Specific, not general.** "Your cluster will be ready in under 60 seconds" beats "Your cluster will start shortly." Precision signals confidence. Vagueness signals the copy was an afterthought.

**User-centered, not system-centered.** "Your cluster has dedicated GPUs" not "The system will allocate GPUs." The user doesn't care what the system does. They care what they get.

**Shortest form that preserves clarity.** "Provisioning your cluster." replaces "Your cluster is now being provisioned and will be available shortly." If it's already obvious from the UI, don't say it.

## Terminology and Consistency

Pick one word for each concept and use it everywhere. If it is called "Cluster Size" in the sidebar, it is "Cluster Size" in the form, the confirmation, and the error. Not "GPU Count". Not "Nodes".

Terminology drift is a trust problem. Users notice inconsistency even when they can't name it. It makes the product feel patched together.

Use numerals for quantities at all times. "8 GPUs", not "eight GPUs". "2 hours", not "two hours".

## Capitalization

**Buttons and links:** Title Case. "Deploy Cluster". "Edit Order". "Generate API Key".

**Everything else:** Sentence case. Labels, help text, confirmations, error messages, section headers. "Confirm your order." not "Confirm Your Order."

No ALL CAPS for emphasis. Use structure instead.

## Labels and Forms

Labels should be one to three words. The placeholder should not repeat the label — it should show format or example. "Email" as the label, "you@example.com" as the placeholder. Not "Please enter your email address below."

Do not put help text far from the thing it describes. If it explains a field, it belongs under the field. If it explains an action, it belongs near the button.

## Error Messages

Two things, in order: what happened, what to do. "Your API key is incorrect or expired. Generate a new key in your account settings." Not "Invalid API key."

Stay calm. Errors are not alarming, they are informational. The goal is recovery, not drama. The user didn't break anything. Something didn't work. Here's how to fix it.

Never expose system state directly to users. "Error 503" means nothing. "Server is temporarily unavailable. Try again in a few minutes." solves the problem.

## Confirmations

After an action, confirm it and tell the user what happens next. "Your cluster is being deployed. You'll receive access details shortly." Not just "Your order was placed."

The confirmation has one job: close the loop. It should be short, reassuring, and specific. Do not add upsells or tangential links in a confirmation. The user just did something important. Let them land.

## Unavailable Features

If something is not ready, say so directly. "Persistent storage (coming soon). Contact us for alternatives." Not "This feature is not available." Give the user somewhere to go.

Never imply something is available if it is not. Do not hide unavailability behind vague language.

## Technical Terms

Use them when the audience knows them. Explain them briefly in-line when the audience might not. "InfiniBand networking (high-speed data transfer between nodes)" is correct in a context where it might be new. "Use InfiniBand networking" is correct where it is not.

Do not use technical terms to sound impressive. Use them when they are more precise than the plain alternative. Do not over-explain concepts the user already understands — link to docs instead. Keep product copy focused on action.

## Progressive Disclosure

Start with the minimum. Surface complexity only when the user asks for it or needs it. "Show advanced settings" is correct. Dumping all settings on a first-time user is not.

This applies to help text, documentation, and confirmation screens. The first screen shows what's required. Everything else is on demand.

## Decision Framework

**If the UI already shows it, don't say it.** Labels, structure, and affordances do most of the explaining. Copy fills gaps, it doesn't repeat what's visible.

**If it's vague, make it specific.** Timelines, quantities, states. Every hedge is a missed opportunity to actually inform the user.

**If it's passive, make it active.** Scan for "is being", "has been", "will be" — these are almost always convertible.

**If it sounds like a marketing line, cut it.** Product copy is inside the product. The user is already here. You don't need to sell.

**If it adds no friction to remove it, remove it.** The test isn't "is this correct?" It is "does this help?"

---

Good copy is invisible. It doesn't call attention to itself — it gets the user to the next step without the user noticing it was there. The goal is not memorable writing. The goal is a product that feels obvious to use.
