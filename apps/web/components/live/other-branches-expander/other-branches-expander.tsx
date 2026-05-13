"use client"

import type { CSSProperties } from "react"
import { motion } from "framer-motion"
import { Branch, ChevronDown, CircleDash } from "@carbon/icons-react"
import { ROW_SPRING } from "@/components/live/row/row.config"
import { Tag } from "@/components/live/tag"

interface OtherBranchesExpanderProps {
  totalUnpinned: number
  expanded: boolean
  loading?: boolean
  onToggle: () => void
}

export function OtherBranchesExpander({
  totalUnpinned,
  expanded,
  loading = false,
  onToggle,
}: OtherBranchesExpanderProps) {
  const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingTop: "var(--spacing-3-5)",
    paddingBottom: "var(--spacing-3-5)",
    paddingRight: "var(--spacing-6)",
    paddingLeft: "var(--spacing-11)",
    gap: "var(--spacing-3)",
    borderRadius: "var(--radius-4)",
    background: expanded
      ? "var(--color-bg-primary)"
      : "var(--color-bg-secondary)",
    border: 0,
    cursor: "pointer",
    width: "100%",
  }

  return (
    <button
      type="button"
      data-other-branches-expander=""
      onClick={onToggle}
      aria-expanded={expanded}
      style={style}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--spacing-3)",
        }}
      >
        {loading ? (
          <span
            className="icon-spin"
            style={{ display: "inline-flex", color: "var(--color-text-secondary)" }}
            aria-hidden
          >
            <CircleDash size={14} />
          </span>
        ) : (
          <Branch
            size={14}
            data-obx="icon"
            style={{ color: "var(--color-text-tertiary)" }}
          />
        )}
        <span
          className="type-4"
          data-obx="label"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {loading
            ? "Loading branches…"
            : expanded
              ? `Other branches · showing ${totalUnpinned} of ${totalUnpinned}`
              : "Other branches"}
        </span>
        {!loading && !expanded ? (
          <Tag tone="neutral" size="xs" className="font-mono" data-obx="pill">
            {totalUnpinned} not pinned
          </Tag>
        ) : null}
      </span>
      {!loading ? (
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={ROW_SPRING}
          data-obx="chevron"
          style={{
            display: "inline-flex",
            color: "var(--color-text-tertiary)",
          }}
        >
          <ChevronDown size={14} />
        </motion.span>
      ) : null}
    </button>
  )
}
