"use client"

import type { CSSProperties } from "react"
import { ChevronSort } from "@carbon/icons-react"
import { Popover } from "radix-ui"
import type { Team } from "@/lib/registry/types"

export interface TeamSwitcherProps {
  teams: Team[]
  activeTeamId?: string
}

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-3)",
  width: "100%",
  padding: "var(--spacing-2)",
  borderRadius: "var(--radius-2)",
  background: "transparent",
  cursor: "pointer",
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

const linesStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  flex: 1,
  alignItems: "flex-start",
}

const chevronStyle: CSSProperties = {
  width: 20,
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
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-layered)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-3)",
  zIndex: 40,
}

export function TeamSwitcher({ teams, activeTeamId }: TeamSwitcherProps) {
  const activeTeam = teams.find((team) => team.id === activeTeamId) ?? teams[0]
  if (!activeTeam) return null

  const hasMultipleTeams = teams.length > 1

  const content = (
    <>
      <span style={tileStyle} className="type-4">
        {activeTeam.initial}
      </span>
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
      {hasMultipleTeams ? (
        <span style={chevronStyle}>
          <ChevronSort size={16} />
        </span>
      ) : null}
    </>
  )

  if (!hasMultipleTeams) {
    return (
      <div aria-label={`Team ${activeTeam.name}`} style={rowStyle}>
        {content}
      </div>
    )
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" aria-label="Switch team" style={rowStyle}>
          {content}
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
