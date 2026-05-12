"use client"

import type { CSSProperties, ReactNode } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { Tag } from "@/components/live/tag"
import { ROW_SPRING } from "@/components/live/row/row.config"

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
    <LayoutGroup>
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
            position: "relative",
            display: "inline-flex",
            padding: 0,
            border: 0,
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
              {active && (
                <motion.span
                  layoutId="filter-pill-indicator"
                  transition={ROW_SPRING}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "var(--radius-3)",
                    background: "var(--color-text-primary)",
                  }}
                />
              )}
              <Tag
                size="md"
                tone="ghost"
                leading={leadingNode}
                leadingBoxSize={pill.leadingBoxSize}
                className="font-medium"
                style={{
                  position: "relative",
                  zIndex: 1,
                  color: active ? "var(--color-bg-primary)" : undefined,
                  transition: "color 200ms ease",
                }}
              >
                {pill.label}
              </Tag>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
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
