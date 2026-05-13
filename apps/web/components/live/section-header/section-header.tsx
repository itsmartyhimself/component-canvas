"use client"

import type { CSSProperties } from "react"
import { SidebarGroupLabel } from "@/components/imports/shadcn/sidebar"

export interface SectionHeaderProps {
  label: string
}

const labelStyle: CSSProperties = {
  color: "var(--color-text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "var(--spacing-2) var(--spacing-3)",
  height: "auto",
  borderRadius: 0,
  background: "transparent",
}

export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <SidebarGroupLabel asChild>
      <div className="type-2" style={labelStyle}>
        {label}
      </div>
    </SidebarGroupLabel>
  )
}
