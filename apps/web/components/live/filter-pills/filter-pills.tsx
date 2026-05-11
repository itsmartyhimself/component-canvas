"use client"

import type { CSSProperties, ReactNode } from "react"

export interface FilterPill {
  key: string
  label: string
  leading?: ReactNode | ((active: boolean) => ReactNode)
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
        const hasLeading = !!leadingNode
        const style: CSSProperties = {
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--spacing-2-5)",
          height: 28,
          paddingLeft: hasLeading ? "var(--spacing-2-5)" : "var(--spacing-4)",
          paddingRight: "var(--spacing-4)",
          borderRadius: "var(--radius-full)",
          color: active ? "var(--color-bg-primary)" : "var(--color-text-secondary)",
          background: active ? "var(--color-text-primary)" : "transparent",
          cursor: "pointer",
          transition: "background-color 120ms ease, color 120ms ease",
        }
        return (
          <button
            key={pill.key}
            type="button"
            role="tab"
            aria-selected={active}
            className="type-3 font-medium"
            style={style}
            onClick={() => onChange(pill.key)}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = "var(--color-bg-secondary)"
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = "transparent"
            }}
          >
            {leadingNode}
            {pill.label}
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

// Mini avatar used inside team filter pills. When the pill is active (dark fill),
// the avatar inverts to a white surface with dark text so it stays legible.
export function FilterPillAvatar({ initial, active }: FilterPillAvatarProps) {
  return (
    <span
      className="font-mono font-medium type-2"
      style={{
        width: 18,
        height: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-full)",
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
