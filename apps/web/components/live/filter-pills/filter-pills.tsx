"use client"

import { useState, type CSSProperties } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { Tag } from "@/components/live/tag"
import { ROW_SPRING } from "@/components/live/row/row.config"

export interface FilterPill {
  key: string
  label: string
}

interface FilterPillsProps {
  pills: FilterPill[]
  value: string
  onChange: (key: string) => void
}

export function FilterPills({ pills, value, onChange }: FilterPillsProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

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
          const hovered = !active && hoveredKey === pill.key
          const buttonStyle: CSSProperties = {
            position: "relative",
            display: "inline-flex",
            padding: 0,
            border: 0,
            borderRadius: "var(--radius-3)",
            background: hovered ? "var(--color-bg-secondary)" : "transparent",
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
              onMouseEnter={() => setHoveredKey(pill.key)}
              onMouseLeave={() =>
                setHoveredKey((k) => (k === pill.key ? null : k))
              }
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
