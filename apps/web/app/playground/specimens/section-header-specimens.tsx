"use client"

import { Add } from "@carbon/icons-react"
import { SectionHeader } from "@/components/live/section-header"
import { Specimen, SIDEBAR_WIDTH_SPECIMEN } from "./_shared"

const addGlyph = (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      color: "inherit",
    }}
  >
    <Add size={16} />
  </span>
)

export function SectionHeaderSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-5)",
      }}
    >
      <Specimen label={`label="LIBRARY" action=<Add>`} width={SIDEBAR_WIDTH_SPECIMEN}>
        <SectionHeader label="LIBRARY" action={addGlyph} />
      </Specimen>
      <Specimen label={`label="FRONTEND" action=<Add>`} width={SIDEBAR_WIDTH_SPECIMEN}>
        <SectionHeader label="FRONTEND" action={addGlyph} />
      </Specimen>
      <Specimen label={`label="PROJECTS" action=<Add>`} width={SIDEBAR_WIDTH_SPECIMEN}>
        <SectionHeader label="PROJECTS" action={addGlyph} />
      </Specimen>
      <Specimen
        label={`label="DESIGN SYSTEM" (no action)`}
        width={SIDEBAR_WIDTH_SPECIMEN}
      >
        <SectionHeader label="DESIGN SYSTEM" />
      </Specimen>
    </div>
  )
}
