"use client"

import { SectionHeader } from "@/components/live/section-header"
import { Specimen, SIDEBAR_WIDTH_SPECIMEN } from "./_shared"

export function SectionHeaderSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-5)",
      }}
    >
      <Specimen label={`label="LIBRARY"`} width={SIDEBAR_WIDTH_SPECIMEN}>
        <SectionHeader label="LIBRARY" />
      </Specimen>
      <Specimen label={`label="FRONTEND"`} width={SIDEBAR_WIDTH_SPECIMEN}>
        <SectionHeader label="FRONTEND" />
      </Specimen>
      <Specimen label={`label="PROJECTS"`} width={SIDEBAR_WIDTH_SPECIMEN}>
        <SectionHeader label="PROJECTS" />
      </Specimen>
      <Specimen label={`label="DESIGN SYSTEM"`} width={SIDEBAR_WIDTH_SPECIMEN}>
        <SectionHeader label="DESIGN SYSTEM" />
      </Specimen>
    </div>
  )
}
