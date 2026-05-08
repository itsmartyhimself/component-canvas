"use client"

import { forwardRef, type CSSProperties, type Ref } from "react"
import { ChevronDown, ChevronUp } from "@carbon/icons-react"
import { BREADCRUMB_CHIP_HEIGHT } from "./instance-breadcrumb.config"

const chipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--spacing-2)",
  height: BREADCRUMB_CHIP_HEIGHT,
  padding: "0 var(--spacing-2-5)",
  borderRadius: "var(--radius-1-5)",
  background: "var(--color-bg-secondary)",
  color: "var(--color-text-primary)",
  border: 0,
  outline: "none",
  cursor: "pointer",
  flexShrink: 0,
}

const labelStyle: CSSProperties = {
  fontWeight: 500,
  whiteSpace: "nowrap",
}

const chevronStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-text-tertiary)",
  flexShrink: 0,
}

export interface BranchTriggerProps {
  label: string
  open: boolean
  onClick: () => void
}

export const BranchTrigger = forwardRef(function BranchTrigger(
  { label, open, onClick }: BranchTriggerProps,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      type="button"
      style={chipStyle}
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-label={`Switch branch (current: ${label})`}
    >
      <span className="font-mono type-3" style={labelStyle}>
        {label}
      </span>
      <span style={chevronStyle}>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </span>
    </button>
  )
})

BranchTrigger.displayName = "BranchTrigger"
