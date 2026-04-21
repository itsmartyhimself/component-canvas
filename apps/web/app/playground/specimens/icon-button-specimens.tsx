"use client"

import type { CSSProperties } from "react"
import { Add, Search, Edit } from "@carbon/icons-react"
import { IconButton } from "@/components/live/icon-button"
import { Specimen, SpecimenGroup } from "./_shared"

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-5)",
}

export function IconButtonSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-11)",
      }}
    >
      <SpecimenGroup title="Sizes">
        <Specimen label={`size=20 radius=radius-1-5`}>
          <IconButton icon={<Add size={14} />} size={20} ariaLabel="Add (20)" />
        </Specimen>
        <Specimen label={`size=24 radius=radius-2`}>
          <IconButton icon={<Add size={14} />} size={24} ariaLabel="Add (24)" />
        </Specimen>
        <Specimen label={`size=32 radius=radius-2`}>
          <IconButton icon={<Add size={16} />} size={32} ariaLabel="Add (32)" />
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Icons">
        <Specimen label={`Add / Search / Edit at size=24`}>
          <div style={rowStyle}>
            <IconButton icon={<Add size={14} />} size={24} ariaLabel="Add" />
            <IconButton icon={<Search size={14} />} size={24} ariaLabel="Search" />
            <IconButton icon={<Edit size={14} />} size={24} ariaLabel="Edit" />
          </div>
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="States">
        <Specimen label={`active=true (bg-secondary)`}>
          <IconButton
            icon={<Add size={14} />}
            size={24}
            ariaLabel="Add active"
            active
          />
        </Specimen>
        <Specimen label={`disabled=true`}>
          <IconButton
            icon={<Add size={14} />}
            size={24}
            ariaLabel="Add disabled"
            disabled
          />
        </Specimen>
        <Specimen label={`bordered=false (borderless)`}>
          <IconButton
            icon={<Add size={14} />}
            size={24}
            ariaLabel="Add borderless"
            bordered={false}
          />
        </Specimen>
      </SpecimenGroup>
    </div>
  )
}
