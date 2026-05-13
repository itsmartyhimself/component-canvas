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

const EXPANDED_MAX_HEIGHT = 64

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-3)",
  width: "100%",
  padding: "var(--spacing-2)",
  borderRadius: "var(--radius-2)",
  background: "transparent",
  border: 0,
  outline: "none",
}

const linesStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  alignItems: "flex-start",
  overflow: "hidden",
  whiteSpace: "nowrap",
  flex: 1,
}

const chevronStyle: CSSProperties = {
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-text-tertiary)",
  flexShrink: 0,
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

  const transitionMs = collapsed
    ? SIDEBAR_LABEL_EXIT_MS
    : SIDEBAR_LABEL_ENTER_MS
  const wrapperStyle: CSSProperties = {
    overflow: "hidden",
    maxHeight: collapsed ? 0 : EXPANDED_MAX_HEIGHT,
    opacity: collapsed ? 0 : 1,
    transition: [
      `max-height ${transitionMs}ms ${SIDEBAR_EASE_OUT_SOFT}`,
      `opacity ${transitionMs}ms ${SIDEBAR_EASE_OUT_SOFT}`,
    ].join(", "),
  }

  const labels = (
    <span style={linesStyle}>
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
  )

  const chevron = hasMultipleTeams ? (
    <span style={chevronStyle}>
      <ChevronSort size={16} />
    </span>
  ) : null

  const inner = hasMultipleTeams ? (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Switch team"
          style={{ ...rowStyle, cursor: "pointer" }}
        >
          {labels}
          {chevron}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          style={popoverContentStyle}
        >
          <p className="type-3" style={{ color: "var(--color-text-tertiary)" }}>
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
  ) : (
    <div aria-label={`Team ${activeTeam.name}`} style={rowStyle}>
      {labels}
    </div>
  )

  return (
    <div aria-hidden={collapsed || undefined} style={wrapperStyle}>
      {inner}
    </div>
  )
}
