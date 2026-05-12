"use client"

import { forwardRef, type CSSProperties, type Ref } from "react"
import { ChevronDown } from "@carbon/icons-react"
import type { Workspace } from "@/lib/dashboard/types"
import { Tag } from "@/components/live/tag"

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

  const wrapperStyle: CSSProperties = {
    display: "inline-flex",
    borderRadius: "var(--radius-3)",
    boxShadow: active ? "inset 0 0 0 1px var(--color-text-primary)" : "none",
    cursor: onClick ? "pointer" : "default",
    transition: "box-shadow 120ms ease",
  }

  const leading = isTeam ? (
    <span
      className="font-mono font-medium type-2 nested-radius-inner"
      style={{
        width: 24,
        height: 24,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
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
      style={wrapperStyle}
      onClick={onClick}
    >
      <Tag
        size="md"
        tone="neutral"
        leading={leading}
        leadingBoxSize={isTeam ? 24 : undefined}
        trailing={
          active ? (
            <ChevronDown
              size={12}
              style={{ color: "var(--color-text-secondary)", flexShrink: 0 }}
            />
          ) : null
        }
      >
        {workspace.name}
      </Tag>
    </button>
  )
}

export const WorkspaceChip = forwardRef(WorkspaceChipBase)
WorkspaceChip.displayName = "WorkspaceChip"
