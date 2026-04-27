"use client"

import type { CSSProperties, ReactElement } from "react"
import { ChevronSort } from "@carbon/icons-react"
import { Avatar, Popover } from "radix-ui"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/imports/shadcn/tooltip"
import { tooltipStyle } from "@/components/live/canvas-controls/tooltip-style"
import {
  SIDEBAR_EASE_OUT_SOFT,
  SIDEBAR_LABEL_ENTER_MS,
  SIDEBAR_LABEL_EXIT_MS,
} from "@/components/live/sidebar-panel/sidebar-panel.config"
import type { User } from "@/lib/registry/types"

export interface UserFooterProps {
  user: User
  collapsed?: boolean
}

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  // Child spacing is managed by marginLeft on labels/chevron so it can CSS-
  // transition when collapsing. Row `gap` itself doesn't transition.
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
  // Matches expanded row's 4px vertical padding so the avatar stays anchored
  // to the same Y position when toggling. 0 horizontal keeps 28px avatar
  // inside the 28px content area.
  padding: "var(--spacing-2) 0",
  borderRadius: "var(--radius-2)",
  background: "transparent",
  cursor: "pointer",
  border: 0,
  outline: "none",
}

const avatarRootStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "var(--radius-full)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  background: "var(--color-bg-tertiary)",
  color: "var(--color-text-primary)",
  flexShrink: 0,
}

const avatarImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
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
  minWidth: 180,
  padding: "var(--spacing-2)",
  borderRadius: "var(--radius-2)",
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-layered)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-1)",
  zIndex: 40,
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

export function UserFooter({ user, collapsed = false }: UserFooterProps) {
  const buttonEl: ReactElement = (
    <button
      type="button"
      aria-label="User menu"
      style={collapsed ? collapsedRowStyle : rowStyle}
    >
      <Avatar.Root style={avatarRootStyle}>
        {user.avatarUrl ? (
          <Avatar.Image
            src={user.avatarUrl}
            alt={user.name}
            style={avatarImageStyle}
          />
        ) : null}
        <Avatar.Fallback
          delayMs={0}
          className="type-3"
          style={{ display: "inline-flex" }}
        >
          {getInitial(user.name)}
        </Avatar.Fallback>
      </Avatar.Root>
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
          {user.name}
        </span>
        <span
          className="type-3 truncate"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {user.email}
        </span>
      </span>
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
    </button>
  )

  const popoverContent = (
    <Popover.Portal>
      <Popover.Content
        side="top"
        align="start"
        sideOffset={4}
        style={popoverContentStyle}
      >
        <button
          type="button"
          className="type-3"
          style={{
            padding: "var(--spacing-2)",
            borderRadius: "var(--radius-1-5)",
            textAlign: "left",
            color: "var(--color-text-primary)",
            background: "transparent",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "var(--color-bg-hover-elevated)"
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "transparent"
          }}
        >
          Log out
        </button>
      </Popover.Content>
    </Popover.Portal>
  )

  if (collapsed) {
    // Nested asChild: TooltipTrigger -> Popover.Trigger -> button. Both
    // wrappers forward props/refs onto the same underlying button so hover
    // shows the tooltip and click still opens the popover.
    return (
      <Popover.Root>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover.Trigger asChild>{buttonEl}</Popover.Trigger>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} style={tooltipStyle}>
            Profile
          </TooltipContent>
        </Tooltip>
        {popoverContent}
      </Popover.Root>
    )
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{buttonEl}</Popover.Trigger>
      {popoverContent}
    </Popover.Root>
  )
}
