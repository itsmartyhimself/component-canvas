"use client"

import type { CSSProperties } from "react"
import { ChevronSort } from "@carbon/icons-react"
import { Popover } from "radix-ui"
import {
  SIDEBAR_EASE_OUT_SOFT,
  SIDEBAR_LABEL_ENTER_MS,
  SIDEBAR_LABEL_EXIT_MS,
} from "@/components/live/sidebar-panel/sidebar-panel.config"
import type { Team } from "@/lib/registry/types"

export interface TeamSwitcherProps {
  teams: Team[]
  activeTeamId?: string
  collapsed?: boolean
}

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  // Child spacing is managed by marginLeft on labels/chevron for CSS-
  // transitionability (gap itself doesn't transition).
  gap: 0,
  width: "100%",
  padding: "var(--spacing-2)",
  borderRadius: "var(--radius-2)",
  background: "transparent",
  cursor: "pointer",
  border: 0,
  outline: "none",
}

const collapsedRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0,
  width: "100%",
  // Vertical 4px matches expanded row's uniform 4px padding so the tile stays
  // at the same Y when toggling. Horizontal 0 lets the 28px tile fit in the
  // 28px content area without overflow.
  padding: "var(--spacing-2) 0",
  borderRadius: "var(--radius-2)",
  background: "transparent",
  cursor: "default",
  border: 0,
  outline: "none",
}

const tileStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "var(--radius-1-5)",
  background: "var(--color-text-primary)",
  color: "var(--color-bg-primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}

const linesBaseStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  alignItems: "flex-start",
  overflow: "hidden",
  whiteSpace: "nowrap",
}

const chevronBaseStyle: CSSProperties = {
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-text-tertiary)",
  flexShrink: 0,
  overflow: "hidden",
}

function labelTransition(collapsed: boolean): string {
  const ms = collapsed ? SIDEBAR_LABEL_EXIT_MS : SIDEBAR_LABEL_ENTER_MS
  return `max-width ${ms}ms ${SIDEBAR_EASE_OUT_SOFT}, opacity ${ms}ms ${SIDEBAR_EASE_OUT_SOFT}, margin ${ms}ms ${SIDEBAR_EASE_OUT_SOFT}`
}

const popoverContentStyle: CSSProperties = {
  minWidth: 240,
  padding: "var(--spacing-5)",
  borderRadius: "var(--radius-2)",
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-layered)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-3)",
  zIndex: 40,
}

export function TeamSwitcher({
  teams,
  activeTeamId,
  collapsed = false,
}: TeamSwitcherProps) {
  const activeTeam = teams.find((team) => team.id === activeTeamId) ?? teams[0]
  if (!activeTeam) return null

  const hasMultipleTeams = teams.length > 1

  const tile = (
    <span style={tileStyle} className="type-4">
      {activeTeam.initial}
    </span>
  )

  const labels = (
    <>
      <span
        aria-hidden={collapsed || undefined}
        style={{
          ...linesBaseStyle,
          flex: collapsed ? "0 0 0px" : 1,
          maxWidth: collapsed ? 0 : 999,
          opacity: collapsed ? 0 : 1,
          marginLeft: collapsed ? 0 : "var(--spacing-3)",
          transition: labelTransition(collapsed),
        }}
      >
        <span
          className="type-3 truncate"
          style={{ color: "var(--color-text-primary)" }}
        >
          {activeTeam.name}
        </span>
        <span
          className="type-3 truncate"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {activeTeam.plan}
        </span>
      </span>
      {hasMultipleTeams ? (
        <span
          aria-hidden={collapsed || undefined}
          style={{
            ...chevronBaseStyle,
            maxWidth: collapsed ? 0 : 20,
            width: collapsed ? 0 : 20,
            opacity: collapsed ? 0 : 1,
            marginLeft: collapsed ? 0 : "var(--spacing-3)",
            transition: labelTransition(collapsed),
          }}
        >
          <ChevronSort size={16} />
        </span>
      ) : null}
    </>
  )

  if (collapsed || !hasMultipleTeams) {
    return (
      <div
        aria-label={`Team ${activeTeam.name}`}
        style={collapsed ? collapsedRowStyle : rowStyle}
      >
        {tile}
        {labels}
      </div>
    )
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" aria-label="Switch team" style={rowStyle}>
          {tile}
          {labels}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          style={popoverContentStyle}
        >
          <p
            className="type-3"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Switch team coming soon.
          </p>
          {teams.map((team) => (
            <div
              key={team.id}
              className="type-3"
              style={{
                color:
                  team.id === activeTeam.id
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
              }}
            >
              {team.name} — {team.plan}
            </div>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
