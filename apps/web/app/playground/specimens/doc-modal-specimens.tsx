"use client"

import type { CSSProperties } from "react"
import { Button } from "@/components/live/button"
import { Specimen } from "./_shared"

const contentStyle: CSSProperties = {
  width: "min(560px, 100%)",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  borderRadius: "var(--radius-3)",
  padding: "var(--spacing-7)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-5)",
  boxShadow: "var(--shadow-layered)",
}

export function DocModalSpecimens() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
      <Specimen label={`open=true inline (no overlay) — sample title + body`}>
        <div style={contentStyle}>
          <h3 className="type-7" style={{ color: "var(--color-text-primary)" }}>
            Colors
          </h3>
          <p className="type-4" style={{ color: "var(--color-text-secondary)" }}>
            Semantic color tokens: bg-primary, bg-secondary, bg-tertiary,
            text-primary, text-secondary, text-tertiary, border-primary,
            border-secondary.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button label="Close" variant="secondary" size="small" />
          </div>
        </div>
      </Specimen>
    </div>
  )
}
