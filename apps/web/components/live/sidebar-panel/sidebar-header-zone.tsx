"use client"

import type { CSSProperties } from "react"
import { Add } from "@carbon/icons-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/imports/shadcn/tooltip"
import { AddMenu } from "@/components/live/add-menu"
import { tooltipStyle } from "@/components/live/canvas-controls/tooltip-style"
import { IconButton } from "@/components/live/icon-button"
import { SearchInput } from "@/components/live/search-input"
import { TeamSwitcher } from "@/components/live/team-switcher"
import { InstanceBreadcrumb } from "@/components/live/instance-breadcrumb"
// TODO(ROADMAP: "Sidebar / InstanceBreadcrumb wiring"): replace MOCK_INSTANCE
// with route-derived data once /[workspace]/[repo]/[branch] exists.
import { MOCK_INSTANCE } from "@/components/live/instance-breadcrumb/instance-breadcrumb.mocks"
import {
  SIDEBAR_EASE_OUT_SOFT,
  SIDEBAR_LABEL_EXIT_MS,
  SIDEBAR_WIDTH_DURATION_MS,
} from "./sidebar-panel.config"
import { useSidebarPanel } from "./use-sidebar-panel"
import { SidebarDivider } from "./sidebar-divider"

const headerStyle: CSSProperties = {
  padding: "var(--spacing-3) var(--spacing-3) 0 var(--spacing-3)",
  display: "flex",
  flexDirection: "column",
}

// Single element in both states — padding transitions with the aside so the
// "+" button slides to its collapsed centre instead of jumping.
function searchRowStyle(collapsed: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 0,
    width: "100%",
    padding: collapsed
      ? "0"
      : "0 var(--spacing-3) var(--spacing-3) var(--spacing-3)",
    transition: `padding ${SIDEBAR_WIDTH_DURATION_MS}ms ${SIDEBAR_EASE_OUT_SOFT}`,
  }
}

function searchWrapStyle(collapsed: boolean): CSSProperties {
  const ms = SIDEBAR_LABEL_EXIT_MS
  return {
    flex: 1,
    minWidth: 0,
    maxWidth: collapsed ? 0 : 999,
    opacity: collapsed ? 0 : 1,
    overflow: "hidden",
    marginRight: collapsed ? 0 : "var(--spacing-2)",
    transition: [
      `max-width ${ms}ms ${SIDEBAR_EASE_OUT_SOFT}`,
      `opacity ${ms}ms ${SIDEBAR_EASE_OUT_SOFT}`,
      `margin ${ms}ms ${SIDEBAR_EASE_OUT_SOFT}`,
    ].join(", "),
  }
}

const tooltipSpanStyle: CSSProperties = { display: "inline-flex" }

export function SidebarHeaderZone() {
  const { searchQuery, actions, registry, collapsed, addButtonRef } =
    useSidebarPanel()

  return (
    <div style={headerStyle}>
      <InstanceBreadcrumb data={MOCK_INSTANCE} collapsed={collapsed} />
      <TeamSwitcher
        teams={[registry.team]}
        activeTeamId={registry.team.id}
        collapsed={collapsed}
      />
      <SidebarDivider />
      <div style={searchRowStyle(collapsed)}>
        <div style={searchWrapStyle(collapsed)}>
          <SearchInput
            value={searchQuery}
            onValueChange={actions.setSearchQuery}
            placeholder="Search"
          />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span style={tooltipSpanStyle}>
              <AddMenu
                scope={null}
                trigger={
                  <IconButton
                    ref={addButtonRef}
                    icon={<Add size={16} />}
                    size={28}
                    ariaLabel="Add folder or component"
                    onClick={(event) => {
                      // In collapsed, "+" expands the sidebar instead of
                      // opening the menu. preventDefault stops Radix's
                      // composed Popover.Trigger handler from firing.
                      if (collapsed) {
                        event.preventDefault()
                        actions.requestAddFocus()
                      }
                    }}
                  />
                }
              />
            </span>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={8} style={tooltipStyle}>
              Add
            </TooltipContent>
          )}
        </Tooltip>
      </div>
      {collapsed && <SidebarDivider />}
    </div>
  )
}
