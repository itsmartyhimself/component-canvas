"use client"

import type { CSSProperties, ReactNode } from "react"

interface ConnectRepoRowProps {
  label: string
  selected?: boolean
  disabled?: boolean
  onSelect?: () => void
  rightContent?: ReactNode
  // Per-instance override for the selected-state background. Defaults to bg-secondary
  // (matches Pencil's `#F6F8F9` selected fill). StepSelectRepo overrides to gradient-twilight.
  selectedBackground?: string
}

export function ConnectRepoRow({
  label,
  selected = false,
  disabled = false,
  onSelect,
  rightContent,
  selectedBackground = "var(--color-bg-secondary)",
}: ConnectRepoRowProps) {
  const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--spacing-4)",
    height: 52,
    padding: "var(--spacing-5)",
    borderRadius: "var(--radius-4)",
    background: selected ? selectedBackground : "var(--color-bg-elevated)",
    border: 0,
    cursor: disabled ? "default" : "pointer",
    textAlign: "left",
    width: "100%",
    opacity: 1,
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
      <span
        className="font-mono type-4"
        style={{
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
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--spacing-3)",
          flexShrink: 0,
        }}
      >
        {rightContent}
        <RadioIndicator selected={selected} />
      </span>
    </button>
  )
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: selected ? "var(--color-text-primary)" : "transparent",
        border: selected
          ? "1.5px solid var(--color-text-primary)"
          : "1.5px solid var(--color-text-tertiary)",
        display: "inline-flex",
        flexShrink: 0,
      }}
    />
  )
}
