"use client"

import type { CSSProperties } from "react"
import { Popover } from "radix-ui"
import {
  ArrowLeft,
  DocumentAdd,
  FolderAdd,
} from "@carbon/icons-react"
import { Specimen, SpecimenGroup } from "./_shared"

const contentStyle: CSSProperties = {
  minWidth: 240,
  padding: "var(--spacing-2)",
  borderRadius: "var(--radius-2)",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-layered)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-1)",
}

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-3)",
  padding: "var(--spacing-2)",
  borderRadius: "var(--radius-1-5)",
  color: "var(--color-text-primary)",
  width: "100%",
}

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-3)",
  padding: "var(--spacing-2) var(--spacing-2) 0",
  color: "var(--color-text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
}

const iconSlot: CSSProperties = {
  width: 16,
  height: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-text-secondary)",
}

function SectionPickerContent() {
  return (
    <>
      <div className="type-2" style={headerStyle}>
        ADD TO
      </div>
      {["LIBRARY", "FRONTEND", "PROJECTS"].map((label) => (
        <div key={label} className="type-3" style={itemStyle}>
          <span style={iconSlot}>
            <FolderAdd size={14} />
          </span>
          {label}
        </div>
      ))}
    </>
  )
}

function ActionListContent({ sectionLabel }: { sectionLabel: string }) {
  return (
    <>
      <div className="type-2" style={headerStyle}>
        {sectionLabel}
      </div>
      <div className="type-3" style={itemStyle}>
        <span style={iconSlot}>
          <ArrowLeft size={14} />
        </span>
        Back
      </div>
      <div className="type-3" style={itemStyle}>
        <span style={iconSlot}>
          <FolderAdd size={14} />
        </span>
        New folder
      </div>
      <div className="type-3" style={itemStyle}>
        <span style={iconSlot}>
          <DocumentAdd size={14} />
        </span>
        Import component
      </div>
    </>
  )
}

function StaticPopover({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Popover.Root open>
      <Popover.Trigger asChild>
        <button
          type="button"
          style={{
            ...itemStyle,
            width: "auto",
            padding: "var(--spacing-3) var(--spacing-5)",
            border: "1px solid var(--color-border-primary)",
            borderRadius: "var(--radius-2)",
            background: "var(--color-bg-primary)",
          }}
          className="type-3"
        >
          {title}
        </button>
      </Popover.Trigger>
      <Popover.Content
        side="bottom"
        align="start"
        sideOffset={6}
        style={contentStyle}
      >
        {children}
      </Popover.Content>
    </Popover.Root>
  )
}

export function AddMenuSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-11)",
      }}
    >
      <SpecimenGroup title="Section picker (top-right + trigger)">
        <Specimen label={`scope=null — picker step`}>
          <StaticPopover title="Add (scope=null)">
            <SectionPickerContent />
          </StaticPopover>
        </Specimen>
      </SpecimenGroup>
      <SpecimenGroup title="Action list (section-scoped + trigger)">
        <Specimen label={`scope="library" — two-action menu`}>
          <StaticPopover title="Add to LIBRARY">
            <ActionListContent sectionLabel="LIBRARY" />
          </StaticPopover>
        </Specimen>
      </SpecimenGroup>
    </div>
  )
}
