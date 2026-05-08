"use client"

import type { CSSProperties } from "react"
import {
  StatusDot,
  type StatusDotTone,
  type StatusDotVariant,
} from "@/components/live/status-dot"
import { formatRelativeTimeShort } from "@/lib/time/relative"
import type { BranchSummary, BranchSyncStatus } from "./types"
import { BRANCH_DROPDOWN_ROW_HEIGHT } from "./instance-breadcrumb.config"

const STATUS_TO_DOT: Record<
  BranchSyncStatus,
  { tone: StatusDotTone; variant: StatusDotVariant; label: string }
> = {
  synced: { tone: "success", variant: "solid", label: "Synced" },
  syncing: { tone: "neutral", variant: "hollow", label: "Syncing" },
  failed: { tone: "danger", variant: "solid", label: "Failed" },
  stale: { tone: "warning", variant: "solid", label: "Stale" },
}

const STATUS_TO_TIME_LABEL: Record<BranchSyncStatus, string | null> = {
  synced: null,
  syncing: "sync",
  failed: null,
  stale: null,
}

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--spacing-3)",
  height: BRANCH_DROPDOWN_ROW_HEIGHT,
  padding: "0 var(--spacing-3)",
  borderRadius: 0,
  background: "transparent",
  border: 0,
  outline: "none",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  color: "var(--color-text-primary)",
}

const labelGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-2)",
  minWidth: 0,
  flex: 1,
}

const nameStyle: CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

const trailingStyle: CSSProperties = {
  color: "var(--color-text-tertiary)",
  flexShrink: 0,
  minWidth: 36,
  textAlign: "right",
}

export interface BranchRowProps {
  branch: BranchSummary
  active: boolean
  onSelect: () => void
}

export function BranchRow({ branch, active, onSelect }: BranchRowProps) {
  const dot = STATUS_TO_DOT[branch.status]
  const timeLabelOverride = STATUS_TO_TIME_LABEL[branch.status]
  const timeLabel =
    timeLabelOverride ?? formatRelativeTimeShort(branch.lastSyncedAt)

  return (
    <button
      type="button"
      style={{
        ...rowStyle,
        background: active ? "var(--color-bg-secondary)" : "transparent",
      }}
      onMouseEnter={(event) => {
        if (active) return
        event.currentTarget.style.background =
          "var(--color-bg-hover-elevated)"
      }}
      onMouseLeave={(event) => {
        if (active) return
        event.currentTarget.style.background = "transparent"
      }}
      onClick={onSelect}
      aria-current={active || undefined}
      data-active={active || undefined}
      title={branch.name}
    >
      <span style={labelGroupStyle}>
        <StatusDot
          tone={dot.tone}
          variant={dot.variant}
          ariaLabel={dot.label}
        />
        <span
          className="font-mono type-3"
          style={{
            ...nameStyle,
            fontWeight: active ? 500 : 400,
          }}
        >
          {branch.name}
        </span>
      </span>
      <span className="type-3" style={trailingStyle}>
        {timeLabel}
      </span>
    </button>
  )
}
