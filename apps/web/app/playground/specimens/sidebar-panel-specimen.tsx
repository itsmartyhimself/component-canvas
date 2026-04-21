"use client"

import type { CSSProperties } from "react"
import { Suspense } from "react"
import { SidebarPanel } from "@/components/live/sidebar-panel"
import { Specimen } from "./_shared"

const frameStyle: CSSProperties = {
  height: 560,
  width: 320,
  display: "flex",
  border: "1px solid var(--color-border-primary)",
  borderRadius: "var(--radius-3)",
  overflow: "hidden",
  background: "var(--color-bg-primary)",
}

export function SidebarPanelSpecimen() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-5)",
      }}
    >
      <Specimen
        label={`Full SidebarPanel mounted inside a 320 × 560 frame`}
      >
        <div style={frameStyle}>
          <Suspense fallback={null}>
            <SidebarPanel />
          </Suspense>
        </div>
      </Specimen>
    </div>
  )
}
