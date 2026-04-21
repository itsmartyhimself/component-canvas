"use client"

import type { CSSProperties } from "react"
import { ChevronSort } from "@carbon/icons-react"
import { Avatar, Popover } from "radix-ui"
import type { User } from "@/lib/registry/types"

export interface UserFooterProps {
  user: User
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
  minWidth: 180,
  padding: "var(--spacing-2)",
  borderRadius: "var(--radius-2)",
  background: "var(--color-bg-primary)",
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

export function UserFooter({ user }: UserFooterProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" aria-label="User menu" style={rowStyle}>
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
          <span style={linesStyle}>
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
          <span style={chevronStyle}>
            <ChevronSort size={16} />
          </span>
        </button>
      </Popover.Trigger>
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
              event.currentTarget.style.background = "var(--color-bg-secondary)"
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "transparent"
            }}
          >
            Log out
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
