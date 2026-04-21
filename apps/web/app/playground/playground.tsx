"use client"

import type { CSSProperties, ReactNode } from "react"

interface PlaygroundSection {
  id: string
  title: string
  render: () => ReactNode
}

const SECTIONS: PlaygroundSection[] = []

const rootStyle: CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  overscrollBehavior: "contain",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
}

const containerStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "var(--spacing-12) var(--spacing-7)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-11)",
}

export function Playground() {
  return (
    <div style={rootStyle}>
      <div style={containerStyle}>
        <header style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          <h1 className="type-8 text-trim" style={{ color: "var(--color-text-primary)" }}>
            Component Canvas playground
          </h1>
          <p className="type-3 text-trim" style={{ color: "var(--color-text-tertiary)" }}>
            Every component we ship, every variant, in one scrollable column. Access via <code>/playground</code>.
          </p>
        </header>
        {SECTIONS.map((section) => (
          <PlaygroundSection key={section.id} title={section.title}>
            {section.render()}
          </PlaygroundSection>
        ))}
      </div>
    </div>
  )
}

interface PlaygroundSectionProps {
  title: string
  children: ReactNode
}

export function PlaygroundSection({ title, children }: PlaygroundSectionProps) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-7)",
      }}
    >
      <h2 className="type-7 text-trim" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
