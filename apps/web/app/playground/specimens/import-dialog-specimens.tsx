"use client"

import type { CSSProperties } from "react"
import { Button } from "@/components/live/button"
import { Specimen } from "./_shared"

const contentStyle: CSSProperties = {
  width: "min(480px, 100%)",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  borderRadius: "var(--radius-3)",
  padding: "var(--spacing-7)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-5)",
  boxShadow: "var(--shadow-layered)",
}

const inputStyle: CSSProperties = {
  height: 32,
  borderRadius: "var(--radius-2)",
  border: "1px solid var(--color-border-primary)",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  padding: "0 var(--spacing-3)",
  outline: "none",
}

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-2)",
}

export function ImportDialogSpecimens() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
      <Specimen label={`open=true inline (no overlay) — stub form`}>
        <div style={contentStyle}>
          <h3 className="type-6" style={{ color: "var(--color-text-primary)" }}>
            Import component
          </h3>
          <p className="type-3" style={{ color: "var(--color-text-tertiary)" }}>
            Real repo-connect is coming. For now the component is added to the
            in-memory registry so you can exercise the UX.
          </p>
          <label style={fieldStyle}>
            <span
              className="type-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Name
            </span>
            <input
              className="type-3"
              style={inputStyle}
              defaultValue="Hero Banner"
            />
          </label>
          <label style={fieldStyle}>
            <span
              className="type-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Folder
            </span>
            <select className="type-3" style={inputStyle} defaultValue="forms">
              <option value="forms">Forms</option>
              <option value="navigation">Navigation</option>
              <option value="feedback">Feedback</option>
            </select>
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--spacing-3)",
              marginTop: "var(--spacing-3)",
            }}
          >
            <Button label="Cancel" variant="ghost" size="small" />
            <Button label="Add" variant="pop" size="small" />
          </div>
        </div>
      </Specimen>
    </div>
  )
}
