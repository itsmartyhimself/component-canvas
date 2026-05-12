"use client"

// The closed-state treatment is intentional: the row stays bare in both
// closed and open states (only the chip's chevron flips). No row-level
// border on open — this matches every other Radix popover in the repo.

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { ChevronRight } from "@carbon/icons-react"
import { Popover } from "radix-ui"
import {
  SIDEBAR_EASE_OUT_SOFT,
  SIDEBAR_LABEL_ENTER_MS,
  SIDEBAR_LABEL_EXIT_MS,
} from "@/components/live/sidebar-panel/sidebar-panel.config"
import { SidebarDivider } from "@/components/live/sidebar-panel/sidebar-divider"
import { BranchDropdown } from "./branch-dropdown"
import { BranchTrigger } from "./branch-trigger"
import {
  BREADCRUMB_CHEVRON_SIZE,
  BREADCRUMB_ROW_HEIGHT,
} from "./instance-breadcrumb.config"
import type { InstanceBreadcrumbData } from "./types"

// Generous max-height cap — fits row + divider without a measured value.
const EXPANDED_MAX_HEIGHT = 80

const collapsibleBase: CSSProperties = {
  overflow: "hidden",
}

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-2)",
  height: BREADCRUMB_ROW_HEIGHT,
  paddingBottom: "var(--spacing-2)",
  minWidth: 0,
}

const trailItemStyle: CSSProperties = {
  color: "var(--color-text-secondary)",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

const separatorStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-text-tertiary)",
  flexShrink: 0,
}

export interface InstanceBreadcrumbProps {
  data: InstanceBreadcrumbData
  collapsed?: boolean
  onSwitchBranch?: (branchId: string) => void
  onLoadOtherBranches?: () => void
}

export function InstanceBreadcrumb({
  data,
  collapsed = false,
  onSwitchBranch,
  onLoadOtherBranches,
}: InstanceBreadcrumbProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  // While collapsed, force the popover closed in controlled mode. Otherwise
  // Radix would re-anchor against a 0-height target and focus-trap escapes
  // into hidden DOM. We only flip to controlled when collapsed; expanded
  // mode stays uncontrolled so Radix's keyboard + ESC handling stays clean.
  useEffect(() => {
    if (collapsed && open) setOpen(false)
  }, [collapsed, open])

  const transitionMs = collapsed
    ? SIDEBAR_LABEL_EXIT_MS
    : SIDEBAR_LABEL_ENTER_MS
  const transition = [
    `max-height ${transitionMs}ms ${SIDEBAR_EASE_OUT_SOFT}`,
    `opacity ${transitionMs}ms ${SIDEBAR_EASE_OUT_SOFT}`,
  ].join(", ")

  const popoverProps = collapsed
    ? { open: false, onOpenChange: () => {} }
    : { open, onOpenChange: setOpen }

  return (
    <div
      aria-hidden={collapsed || undefined}
      style={{
        ...collapsibleBase,
        maxHeight: collapsed ? 0 : EXPANDED_MAX_HEIGHT,
        opacity: collapsed ? 0 : 1,
        transition,
      }}
    >
      <div style={rowStyle}>
        {data.trail.map((item, index) => (
          <span
            key={`${item.kind}-${index}-${item.label}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "var(--spacing-2)", minWidth: 0 }}
          >
            <span
              className="font-mono type-3"
              style={{ ...trailItemStyle, fontWeight: 500 }}
              title={item.label}
            >
              {item.label}
            </span>
            <span style={separatorStyle}>
              <ChevronRight size={BREADCRUMB_CHEVRON_SIZE} />
            </span>
          </span>
        ))}
        <Popover.Root {...popoverProps}>
          <Popover.Trigger asChild>
            <BranchTrigger
              ref={triggerRef}
              label={data.branch.name}
              open={!collapsed && open}
              onClick={() => {}}
            />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={6}
              style={{ zIndex: 40 }}
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <BranchDropdown
                branches={data.branches}
                activeBranchId={data.branch.id}
                onSelect={(branchId) => {
                  setOpen(false)
                  onSwitchBranch?.(branchId)
                }}
                onLoadOtherBranches={onLoadOtherBranches}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <SidebarDivider />
    </div>
  )
}
