"use client"

import type { CSSProperties } from "react"
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
// search bar slides smoothly into its collapsed (zero-width) position.
function searchRowStyle(collapsed: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
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
    transition: [
      `max-width ${ms}ms ${SIDEBAR_EASE_OUT_SOFT}`,
      `opacity ${ms}ms ${SIDEBAR_EASE_OUT_SOFT}`,
    ].join(", "),
  }
}

export function SidebarHeaderZone() {
  const { searchQuery, actions, registry, collapsed } = useSidebarPanel()

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
      </div>
      {collapsed && <SidebarDivider />}
    </div>
  )
}
