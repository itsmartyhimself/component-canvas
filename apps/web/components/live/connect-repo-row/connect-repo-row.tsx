"use client"

import type { CSSProperties, ReactNode } from "react"
import { Checkmark } from "@carbon/icons-react"

interface ConnectRepoRowProps {
  label: string
  selected?: boolean
  disabled?: boolean
  onSelect?: () => void
  rightContent?: ReactNode
  // Optional element rendered absolutely behind row content. Typically a
  // layoutId motion.div from a parent LayoutGroup so the active fill travels
  // between selected rows.
  activeFill?: ReactNode
}

export function ConnectRepoRow({
  label,
  selected = false,
  disabled = false,
  onSelect,
  rightContent,
  activeFill,
}: ConnectRepoRowProps) {
  const style: CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--spacing-4)",
    height: 52,
    padding: "var(--spacing-5)",
    borderRadius: "var(--radius-4)",
    background: "var(--color-bg-elevated)",
    border: 0,
    cursor: disabled ? "default" : "pointer",
    textAlign: "left",
    width: "100%",
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      style={style}
    >
      {activeFill}
      <span
        className="font-mono type-4"
        style={{
          position: "relative",
          zIndex: 2,
          color: disabled
            ? "var(--color-text-tertiary)"
            : "var(--color-text-primary)",
          fontWeight: selected ? 500 : 400,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          position: "relative",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--spacing-3)",
          flexShrink: 0,
        }}
      >
        {rightContent}
        {!disabled ? <SelectedIndicator selected={selected} /> : null}
      </span>
    </button>
  )
}

function SelectedIndicator({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span
        aria-hidden
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "var(--color-tag-success-ink)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Checkmark size={12} style={{ color: "#ffffff" }} />
      </span>
    )
  }
  return (
    <span
      aria-hidden
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "transparent",
        border: "1.5px solid var(--color-text-tertiary)",
        display: "inline-flex",
        flexShrink: 0,
      }}
    />
  )
}
