"use client"

import type { ReactNode } from "react"
import { UserAvatar } from "@carbon/icons-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/imports/shadcn/popover"
import type { Workspace } from "@/lib/dashboard/types"

interface WorkspacePopoverProps {
  workspace: Workspace
  trigger: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WorkspacePopover({
  workspace,
  trigger,
  open,
  onOpenChange,
}: WorkspacePopoverProps) {
  const isTeam = workspace.kind === "team"
  const memberLabel = isTeam
    ? `${workspace.members.length} ${workspace.members.length === 1 ? "member" : "members"}`
    : "Just you"

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="!w-[280px] !p-0"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-secondary)",
          borderRadius: "var(--radius-3)",
          boxShadow: "var(--shadow-layered)",
          color: "var(--color-text-primary)",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-5)",
            borderBottom: "1px solid var(--color-border-primary)",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-3)",
          }}
        >
          {isTeam ? (
            <span
              className="font-mono font-medium type-3"
              style={{
                width: 24,
                height: 24,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-1-5)",
                background: "var(--color-text-primary)",
                color: "var(--color-bg-primary)",
              }}
              aria-hidden
            >
              {workspace.initial ?? workspace.name.slice(0, 1).toUpperCase()}
            </span>
          ) : (
            <UserAvatar
              size={20}
              style={{ color: "var(--color-text-secondary)" }}
              aria-hidden
            />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="type-4 font-medium">{workspace.name}</span>
            <span
              className="type-2"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {memberLabel}
            </span>
          </div>
        </div>

        {isTeam ? (
          <div
            style={{
              padding: "var(--spacing-3) var(--spacing-3) var(--spacing-2)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-1)",
            }}
          >
            {workspace.members.map((member) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-3)",
                  paddingBlock: "var(--spacing-2)",
                  paddingInline: "var(--spacing-3)",
                  borderRadius: "var(--radius-2)",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: member.avatarColor,
                    color: "var(--color-bg-primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                  className="type-2 font-medium"
                  aria-hidden
                >
                  {member.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                  <span
                    className="type-3 font-medium"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.name}
                  </span>
                  <span
                    className="type-2"
                    style={{
                      color: "var(--color-text-tertiary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.email}
                  </span>
                </div>
                <span
                  className="type-2"
                  style={{
                    color: "var(--color-text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div
          style={{
            padding: "var(--spacing-2)",
            borderTop: isTeam ? "1px solid var(--color-border-primary)" : "none",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-0)",
          }}
        >
          {/* TODO: ROADMAP §Dashboard — Manage/Invite/Move-to-team actions are visual only. */}
          {isTeam ? (
            <>
              <PopoverAction label="Invite member" />
              <PopoverAction label="Manage members" />
            </>
          ) : (
            <PopoverAction label="Move to a team workspace" />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PopoverAction({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      className="type-3"
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "var(--spacing-3) var(--spacing-3)",
        borderRadius: "var(--radius-2)",
        color: "var(--color-text-primary)",
        cursor: "pointer",
        transition: "background-color 120ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--color-bg-secondary)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent"
      }}
    >
      {label}
    </button>
  )
}
