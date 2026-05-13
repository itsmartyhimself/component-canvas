"use client"

import { useState } from "react"
import { ChevronDown } from "@carbon/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/imports/shadcn/dropdown-menu"
import {
  FilterPills,
  type FilterPill,
} from "@/components/live/filter-pills"
import { useDashboardState } from "@/lib/dashboard/state"
import type { SortKey } from "@/lib/dashboard/types"

interface DashboardListHeaderProps {
  title: string
  count: number
  showFilters?: boolean
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "lastSync", label: "Last sync" },
  { key: "name", label: "Name" },
]

export function DashboardListHeader({
  title,
  count,
  showFilters = true,
}: DashboardListHeaderProps) {
  const { workspaces, filter, setFilter, sort, setSort } = useDashboardState()
  const [sortOpen, setSortOpen] = useState(false)

  const pills: FilterPill[] = [
    { key: "all", label: "All" },
    { key: "personal", label: "Personal" },
    ...workspaces
      .filter((w) => w.kind === "team")
      .map((w) => ({
        key: w.id,
        label: `Team ${w.name}`,
      })),
  ]

  const sortLabel = SORT_OPTIONS.find((s) => s.key === sort)?.label ?? "Sort"

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--spacing-5)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-4)",
        }}
      >
        <h1
          className="type-7 font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h1>
        <span
          className="font-mono type-3"
          style={{
            paddingInline: "var(--spacing-3)",
            paddingBlock: "var(--spacing-1)",
            background: "var(--color-bg-tertiary)",
            color: "var(--color-text-secondary)",
            borderRadius: "var(--radius-1-5)",
          }}
        >
          {count}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-3)",
        }}
      >
        {showFilters ? (
          <FilterPills pills={pills} value={filter} onChange={setFilter} />
        ) : null}
        <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="type-3 font-medium"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--spacing-2-5)",
                height: 28,
                paddingInline: "var(--spacing-3-5)",
                borderRadius: "var(--radius-full)",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border-secondary)",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
              }}
            >
              {sortLabel}
              <ChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-secondary)",
              borderRadius: "var(--radius-2-5)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.key}
                className="type-3"
                onSelect={() => setSort(opt.key)}
                style={{
                  cursor: "pointer",
                  color:
                    opt.key === sort
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                }}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
