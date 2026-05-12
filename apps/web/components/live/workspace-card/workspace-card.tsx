"use client"

import { type CSSProperties } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Checkmark } from "@carbon/icons-react"
import type { Workspace } from "@/lib/dashboard/types"

interface WorkspaceCardProps {
  workspace: Workspace
  selected: boolean
  onSelect: () => void
}

export function WorkspaceCard({ workspace, selected, onSelect }: WorkspaceCardProps) {
  const isTeam = workspace.kind === "team"
  const reduceMotion = useReducedMotion()

  const memberLabel = isTeam
    ? `${workspace.members.length} ${workspace.members.length === 1 ? "member" : "members"}`
    : "Just you"

  const containerStyle: CSSProperties = {
    position: "relative",
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
      data-theme-static={selected ? "light" : undefined}
    >
      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            key="selected-fill"
            aria-hidden
            initial={
              reduceMotion
                ? { clipPath: "inset(0% 0% 0% 0%)" }
                : { clipPath: "inset(100% 0% 0% 0%)" }
            }
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{
              opacity: 0,
              transition: { duration: reduceMotion ? 0 : 0.08 },
            }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
            }
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, var(--color-bg-primary) 50%, var(--color-bg-secondary) 100%)",
              borderRadius: "inherit",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
        ) : null}
      </AnimatePresence>
      <div
        style={{
          position: "relative",
          zIndex: 1,
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
          position: "relative",
          zIndex: 1,
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
