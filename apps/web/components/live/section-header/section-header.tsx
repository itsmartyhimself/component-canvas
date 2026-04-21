"use client"

import type { CSSProperties, ReactNode } from "react"
import {
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/imports/shadcn/sidebar"

export interface SectionHeaderProps {
  label: string
  action?: ReactNode
  actionLabel?: string
}

const labelStyle: CSSProperties = {
  color: "var(--color-text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "var(--spacing-2) var(--spacing-3)",
  height: "auto",
  borderRadius: 0,
  background: "transparent",
  width: "100%",
}

const actionStyle: CSSProperties = {
  position: "absolute",
  right: "var(--spacing-2)",
  top: "50%",
  transform: "translateY(-50%)",
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  background: "transparent",
  color: "var(--color-text-secondary)",
}

export function SectionHeader({ label, action, actionLabel }: SectionHeaderProps) {
  return (
    <div className="relative flex items-center" style={{ width: "100%" }}>
      <SidebarGroupLabel asChild>
        <div className="type-2" style={labelStyle}>
          {label}
        </div>
      </SidebarGroupLabel>
      {action ? (
        <SidebarGroupAction
          asChild
          aria-label={actionLabel ?? `Add to ${label}`}
        >
          <div style={actionStyle}>{action}</div>
        </SidebarGroupAction>
      ) : null}
    </div>
  )
}
