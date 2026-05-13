"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { Branch, Search } from "@carbon/icons-react"
import {
  BRANCH_DROPDOWN_MAX_LIST_HEIGHT,
  BRANCH_DROPDOWN_WIDTH,
} from "./instance-breadcrumb.config"
import { BranchRow } from "./branch-row"
import type { BranchSummary } from "./types"

const contentStyle: CSSProperties = {
  width: BRANCH_DROPDOWN_WIDTH,
  borderRadius: "var(--radius-3)",
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-layered)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}

const searchRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-2)",
  height: 36,
  padding: "0 var(--spacing-3)",
  borderBottom: "1px solid var(--color-border-primary)",
  color: "var(--color-text-secondary)",
}

const searchInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  background: "transparent",
  color: "var(--color-text-primary)",
  border: 0,
  outline: "none",
  padding: 0,
}

const listScrollStyle: CSSProperties = {
  maxHeight: BRANCH_DROPDOWN_MAX_LIST_HEIGHT,
  overflowY: "auto",
  overflowX: "hidden",
  overscrollBehavior: "contain",
  scrollbarWidth: "thin",
  scrollbarColor: "var(--color-border-secondary) transparent",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-1)",
}

const emptyStyle: CSSProperties = {
  padding: "var(--spacing-4) var(--spacing-3)",
  color: "var(--color-text-tertiary)",
  textAlign: "center",
}

const otherBranchesStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-2)",
  height: 36,
  padding: "0 var(--spacing-3)",
  borderTop: "1px solid var(--color-border-primary)",
  color: "var(--color-text-secondary)",
  border: 0,
  outline: "none",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  transition: "background-color var(--duration-micro) ease",
}

export interface BranchDropdownProps {
  branches: BranchSummary[]
  activeBranchId: string
  onSelect: (branchId: string) => void
  onLoadOtherBranches?: () => void
}

export function BranchDropdown({
  branches,
  activeBranchId,
  onSelect,
  onLoadOtherBranches,
}: BranchDropdownProps) {
  const [query, setQuery] = useState("")
  const [otherBranchesHovered, setOtherBranchesHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  // On open: focus search and bring the active row into view. Runs once on
  // mount — search filtering must not re-trigger scroll, otherwise typing
  // jumps the list.
  useEffect(() => {
    inputRef.current?.focus()
    const activeEl = listRef.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    )
    activeEl?.scrollIntoView({ block: "nearest" })
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return branches
    return branches.filter((branch) =>
      branch.name.toLowerCase().includes(q),
    )
  }, [branches, query])

  return (
    <div style={contentStyle}>
      <div style={searchRowStyle}>
        <Search size={14} />
        <input
          ref={inputRef}
          className="type-3"
          style={searchInputStyle}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find branch…"
          aria-label="Find branch"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div ref={listRef} style={listScrollStyle}>
        {filtered.length === 0 ? (
          <div className="type-3" style={emptyStyle}>
            {query ? "No matches" : "No branches yet"}
          </div>
        ) : (
          filtered.map((branch) => (
            <BranchRow
              key={branch.id}
              branch={branch}
              active={branch.id === activeBranchId}
              onSelect={() => onSelect(branch.id)}
            />
          ))
        )}
      </div>
      {onLoadOtherBranches ? (
        <button
          type="button"
          className="type-3"
          style={{
            ...otherBranchesStyle,
            background: otherBranchesHovered
              ? "var(--color-bg-hover-elevated)"
              : "transparent",
          }}
          onMouseEnter={() => setOtherBranchesHovered(true)}
          onMouseLeave={() => setOtherBranchesHovered(false)}
          onClick={onLoadOtherBranches}
        >
          <Branch size={14} />
          <span>Other branches…</span>
        </button>
      ) : null}
    </div>
  )
}
