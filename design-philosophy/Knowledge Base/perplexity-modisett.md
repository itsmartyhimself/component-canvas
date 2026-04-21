# Perplexity Design Thinking — Henry Modisett

Henry Modisett is VP of Design and founding designer at Perplexity AI. This document distills his design philosophy, decision frameworks, and operational culture. Reference when making product design decisions, evaluating interface approaches, thinking about AI product UX, or building design team culture.

---

## The Four Constraints

Perplexity's design is governed by four operational constraints, not aspirational values: **Speed** — make the product fast. **Usefulness** — useful every single day. **Trustworthiness** — show sources transparently. **Reliability** — consistent every single time.

These are filters, not principles to balance. When assessing any capability: "Does it make sense in our product?" Identity clarity — knowing what you are and what you want to be great at — is what makes the design feel simple. The pinnacle: every day the product should get more powerful without feeling more complex.

## The Utility Mindset

Perplexity should feel like a subway system — infrastructure that's out of the way. "You shouldn't be thinking about the product, you should be getting the value." The product is not the point. The outcome is the point. "Answers" is a word anyone understands. When the internal language matches what users naturally say about you, the design is working.

This narrow scope is deliberate. "OpenAI is building a platform that has to work for all kinds of use cases we're not thinking about." Perplexity's constraint creates clarity. When Henry convinced the team that ChatGPT wasn't a consumer product, it opened a clear lane. "We're winning if people are saying internally what we're saying externally."

## What Not to Build

**Not everything should be a chat.** AI will be embedded in everything as enabling infrastructure, not as a personality. "If your fork said 'bon appétit' every time you picked it up, people would get sick of that." Users asking a question want the answer, not a conversation with a fake human.

**Prompting is temporary.** "The worst software experience ever. There's no way it survives." Design inputs to feel familiar — Perplexity's search box leverages external consistency so users can type a few keywords without prompt engineering.

**Innovate as a last resort.** Common patterns are common because users understand them. If you need a teaching experience, you've lost the plot. The highest bar isn't novelty — it's making something feel so obvious users cannot imagine it working any other way. "Booking.com is a masterclass. Go learn from them."

**Design is not a visualizer for leadership anxiety.** Asking design to explore 10 options because leadership doesn't know what to do disconnects design from problem-solving. Most design problems aren't UI problems — they're product problems.

## Prototype to Productize

The traditional sequence — PRD, design, engineering, ship — is dead for AI products. Replacement:

**Strategic conversation → get anything working → prune possibilities → design → ship → observe.**

Designers work with the actual product, not mockups. The team explores LLM capabilities with simple prototypes — sometimes command-line implementations. "Ugly/confusing but useful is always a downhill design problem."

Writing comes before mockups: Why are we doing this? Who uses it? How does it work? "The alternative is mockups, and that's a waste of time just to get everyone on the same page." Taste drives most iterations. "90% of iterations are inspired by my own taste and judgment. If you want to build something novel, most people won't help you. You have to have conviction."

## Code-First Design

Perplexity's design team designs in React, not Figma. This is philosophical, not just practical.

"When you write code, you develop a stronger emotional attachment to the product. You're empowered to continually make improvements without going through engineers. The more removed you are from what ships, the easier it is to blame someone else." "When I'm the one writing the code, I lose sleep if it's not good because I'm the only one that can make it better."

Before knowing what the product would be, Modisett built a component system — buttons, type, colors. Design systems aren't what you invest in once the interface is figured out. They're speed infrastructure from day one. "An open-ended box of Legos." A good component library makes it hard to ship something that looks bad.

CSS is design, not engineering — layout language, best practices, mobile considerations are design decisions. The collaboration model is a spectrum, not a clean delineation. "Every day we ask: 'Here are 10 things. Who's doing what?' and projects go fine." Engineers teach designers to code. Designers teach engineers design thinking. Boundaries dissolve.

## Designing Non-Deterministic Systems

Building AI products is comparable to urban planning: unpredictability from both users and the AI itself. Every use results in a different outcome. "As an engineer, it's easy to get too zoomed in and forget the interface could be completely reorganized. Reorganize it slightly and everything works differently even if the code's the same." **Think in abstractions** — design "entity comparison" as a pattern, not "dog breed comparison." One interface system handles infinite use cases.

**Accept probabilistic outcomes** — "Sometimes it vomits out something awful. You're building the system, giving it tools, hoping it works most of the time." Fix the root, squash the failure percentage.

**Generative UI.** Perplexity already lets the AI choose between text input, radio buttons, and other components based on context. "Just the beginning of a reality where we let the interface unravel itself as people use it."

**Agent transparency.** The agent always shows what it's doing — screenshots, abstracted timelines, shared notes. "You can always intervene and take over." Three interaction modes: delegate, collaborate, or do it yourself. All require showing work. Trust is built through robustness: "The most important thing we can do is not mess it up. We only have a few chances."

**Network density over use cases.** "We don't build from 'here are 10 use cases.' We're building a network density of abilities, and then people show us what they're doing with it." Designers communicate with guidance and ideas, not comprehensive mockups. It's collaborative crafting, not handoff.

## Decision Frameworks

**Mechanics > Dynamics > Aesthetics (MDA).** From game design theory. How something works is the foundation. How users interact comes next. Visual polish last. Get the mechanics right and aesthetics become downhill. Twitter's character limit isn't a constraint — it changes human behavior.

**Flexibility-Usability Tradeoff.** The more flexible a system, the less usable. Narrow scope allows tighter optimization.

**Gravitational Pull.** The most successful UI draws users toward the right actions naturally. "You open it up and just fall through it. The decisions are just obvious and clear."

**Constraint-Driven Design.** "Assume the user needs to figure this out in 300 milliseconds." If you put everything on screen, people become blind to UI.

**Power Laws in Surfaces.** Not every surface is equal. Chase ROI on where obsession matters. This earns credibility when you say "this experience needs obsession."

**Decisiveness Over Exploration.** You could launch three more things in the time it takes to perfect one. When metrics always go up, you can't run accurate experiments. Go with intuition and conviction. "It's fine to be wrong. We just don't know all the time."

**80/20 Every Week.** Focus on the most impactful effort, ship it, return next week to improve. "If you ship something and realise it could be better a week later, users won't remember the worse version."

## Quality Through Ownership

Quality comes from empowered individuals, not better processes. "I'll fix things just because I have an hour. It's not a process problem, it's an empowerment problem. If you build a culture where people feel this is their baby and lose sleep when it's not good enough, this stuff just happens."

No fixed critique cadence — structured crits create waiting and performance. People decide when they need feedback.

Velocity is the primary value. "Go fast, and therefore how do we maintain quality?" — flip the framing. If it's a UX question, the designer makes the call. Decision-making structure matters more than skill: "The organization needs to be set up where decisiveness is valued because the alternative is death."

Dog-fooding as design method. "I only use Perplexity. I'm going to use this thing until it breaks, then try to make it better."

## Team Architecture

**Ocean's 11.** Complementary skills, not similarity. "I wanted to find people that could do things I couldn't do." The leader floats, removes blockers, provides confidence — the goal is a self-functioning team.

**Hire for hunger.** Look for self-directed invention, not homework completion. "I want to find someone who didn't do their homework and did something else instead." Seek ambition, comfort with ambiguity, people energized by being the underdog.

**High agency, high taste.** "The future isn't PMs, designers, or engineers. It's product people who uncover problems, create concepts, and ship solutions. The disciplines were just constructs. AI collapses the scaffolding. The builders are what matter now."

**Brand as recruitment.** People join the brand, not the company. "If the product is beautiful, people will want to join. You can't fake it." Brand guidelines should be dynamic, not stencils — the logo stays the same but implementation adapts. Most tech companies don't think about brand at all. That's a huge opportunity.

**Scaling without losing identity.** The hardest part of growth is knowing what to change about who you are. The answer isn't abandoning speed — it's creating just enough structure that people can still be decisive. Formalize only what's proven. Stay organic as long as possible.

## Thinking in the AI Era

**Understand trajectory, not current state.** "Assume it's getting better really quickly. If you're thinking about what would be great if this existed, start building it now." AI compresses complexity into simple UI patterns and creates shortcuts that weren't available before — Perplexity worked in every language before login existed, no localization effort needed.

**Faster loops, faster learning.** Code generation is 10xing. "There's no reason for quarterly planning anymore. Do bi-weekly." Getting good at anything is reps with feedback — if you get feedback quickly, you get good quickly. Design is democratized but the bar for "great" is raised. The gap between decent and great is where design thinking lives.

**Competitive blindness.** "It's a trap to look at a competitor and make minor tweaks." Perplexity was built from first principles — you need to ask questions, you need to see answers. Follow-up felt natural. That's it. Learn from everywhere except your industry: game design theory, booking sites, industries that compete purely on brand.

**The largest value of a designer.** "Showing there are way more outcomes than you can imagine if you just let somebody run with an idea." When infinite choices exist, designers navigate that space best. This is the age for startups to disrupt bigger companies stuck in how they operate — when technology is commodified, the differentiator becomes design sensibility and product thinking.

Design process is about how we think, not what tools we use. The process should be malleable and hungry — absorbing seemingly unrelated methodologies. Everything around us was made by somebody. You can change anything.
