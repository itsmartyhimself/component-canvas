"use client"

import { type CSSProperties } from "react"
import { Checkmark } from "@carbon/icons-react"
import type { Workspace } from "@/lib/dashboard/types"

interface WorkspaceCardProps {
  workspace: Workspace
  selected: boolean
  onSelect: () => void
}

export function WorkspaceCard({ workspace, selected, onSelect }: WorkspaceCardProps) {
  const isTeam = workspace.kind === "team"

  const memberLabel = isTeam
    ? `${workspace.members.length} ${workspace.members.length === 1 ? "member" : "members"}`
    : "Just you"

  const containerStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "var(--spacing-3-5)",
    height: 160,
    padding: "var(--spacing-5) var(--spacing-4)",
    borderRadius: "var(--radius-4)",
    background: "var(--color-bg-elevated)",
    border: 0,
    cursor: "pointer",
    textAlign: "left",
    overflow: "hidden",
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      style={containerStyle}
      onClick={onSelect}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "var(--spacing-3)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-3)",
            minWidth: 0,
          }}
        >
          <span
            className="type-4 font-medium"
            style={{ color: "var(--color-text-primary)", lineHeight: 1 }}
          >
            {workspace.name}
          </span>
          <span
            className="type-3"
            style={{ color: "var(--color-text-secondary)", lineHeight: 1 }}
          >
            {memberLabel}
          </span>
        </div>
        <SelectedIndicator selected={selected} />
      </div>
      <span
        className="type-8"
        style={{
          color: "var(--color-text-primary)",
          lineHeight: 1,
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {workspace.name}
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
