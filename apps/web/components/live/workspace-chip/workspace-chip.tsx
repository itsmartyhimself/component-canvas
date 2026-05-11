"use client"

import { forwardRef, useState, type CSSProperties, type Ref } from "react"
import { ChevronDown } from "@carbon/icons-react"
import type { Workspace } from "@/lib/dashboard/types"

interface WorkspaceChipProps {
  workspace: Workspace
  active?: boolean
  onClick?: () => void
  ariaLabel?: string
}

function WorkspaceChipBase(
  { workspace, active = false, onClick, ariaLabel }: WorkspaceChipProps,
  ref: Ref<HTMLButtonElement>,
) {
  const isTeam = workspace.kind === "team"
  const initial = workspace.initial ?? workspace.name.slice(0, 1).toUpperCase()
  const [hover, setHover] = useState(false)

  const personalText = hover || active
    ? "var(--color-text-primary)"
    : "var(--color-text-secondary)"
  const teamText = "var(--color-text-primary)"

  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--spacing-3)",
    height: 28,
    paddingTop: "var(--spacing-2)",
    paddingBottom: "var(--spacing-2)",
    paddingLeft: isTeam ? "var(--spacing-2)" : "var(--spacing-3)",
    paddingRight: isTeam ? "var(--spacing-3-5)" : "var(--spacing-3)",
    borderRadius: "var(--radius-2)",
    background: active || hover ? "var(--color-bg-secondary)" : "transparent",
    border: `1px solid ${active ? "var(--color-text-primary)" : "transparent"}`,
    color: isTeam ? teamText : personalText,
    cursor: onClick ? "pointer" : "default",
    transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
  }

  const leading = isTeam ? (
    <span
      className="font-mono font-medium type-2"
      style={{
        width: 18,
        height: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-1-5)",
        background: "var(--color-text-primary)",
        color: "var(--color-bg-elevated)",
        flexShrink: 0,
      }}
      aria-hidden
    >
      {initial}
    </span>
  ) : (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--color-text-tertiary)",
        flexShrink: 0,
      }}
      aria-hidden
    />
  )

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel ?? `${workspace.name} workspace`}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {leading}
      <span className="type-3">{workspace.name}</span>
      {active ? (
        <ChevronDown
          size={12}
          style={{ color: "var(--color-text-secondary)", flexShrink: 0 }}
        />
      ) : null}
    </button>
  )
}

export const WorkspaceChip = forwardRef(WorkspaceChipBase)
WorkspaceChip.displayName = "WorkspaceChip"
