"use client"

import type { CSSProperties, ReactNode } from "react"
import { Tag } from "@/components/live/tag"

export interface FilterPill {
  key: string
  label: string
  leading?: ReactNode | ((active: boolean) => ReactNode)
  leadingBoxSize?: number
}

interface FilterPillsProps {
  pills: FilterPill[]
  value: string
  onChange: (key: string) => void
}

export function FilterPills({ pills, value, onChange }: FilterPillsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--spacing-3)",
      }}
    >
      {pills.map((pill) => {
        const active = pill.key === value
        const leadingNode =
          typeof pill.leading === "function" ? pill.leading(active) : pill.leading
        const buttonStyle: CSSProperties = {
          display: "inline-flex",
          borderRadius: "var(--radius-3)",
          background: "transparent",
          cursor: "pointer",
          transition: "background-color 120ms ease",
        }
        return (
          <button
            key={pill.key}
            type="button"
            role="tab"
            aria-selected={active}
            style={buttonStyle}
            onClick={() => onChange(pill.key)}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = "var(--color-bg-secondary)"
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = "transparent"
            }}
          >
            <Tag
              size="md"
              tone={active ? "pop" : "ghost"}
              leading={leadingNode}
              leadingBoxSize={pill.leadingBoxSize}
              className="font-medium"
            >
              {pill.label}
            </Tag>
          </button>
        )
      })}
    </div>
  )
}

interface FilterPillAvatarProps {
  initial: string
  active: boolean
}

export function FilterPillAvatar({ initial, active }: FilterPillAvatarProps) {
  return (
    <span
      className="font-mono font-medium type-2 nested-radius-inner"
      style={{
        width: 24,
        height: 24,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "var(--color-bg-primary)" : "var(--color-text-primary)",
        color: active ? "var(--color-text-primary)" : "var(--color-bg-primary)",
        flexShrink: 0,
      }}
      aria-hidden
    >
      {initial}
    </span>
  )
}
