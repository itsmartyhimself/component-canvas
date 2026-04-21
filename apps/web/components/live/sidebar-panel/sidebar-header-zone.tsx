"use client"

import type { CSSProperties } from "react"
import { Add } from "@carbon/icons-react"
import { AddMenu } from "@/components/live/add-menu"
import { IconButton } from "@/components/live/icon-button"
import { SearchInput } from "@/components/live/search-input"
import { TeamSwitcher } from "@/components/live/team-switcher"
import { useSidebarPanel } from "./use-sidebar-panel"
import { SidebarDivider } from "./sidebar-divider"

const headerStyle: CSSProperties = {
  padding: "var(--spacing-3) var(--spacing-3) 0 var(--spacing-3)",
  display: "flex",
  flexDirection: "column",
}

const searchRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-2)",
  padding: "0 var(--spacing-3) var(--spacing-3) var(--spacing-3)",
}

export function SidebarHeaderZone() {
  const { searchQuery, actions, registry } = useSidebarPanel()

  return (
    <div style={headerStyle}>
      <TeamSwitcher teams={[registry.team]} activeTeamId={registry.team.id} />
      <SidebarDivider />
      <div style={searchRowStyle}>
        <SearchInput
          value={searchQuery}
          onValueChange={actions.setSearchQuery}
          placeholder="Search"
        />
        <AddMenu
          scope={null}
          trigger={
            <IconButton
              icon={<Add size={16} />}
              size={32}
              ariaLabel="Add folder or component"
            />
          }
        />
      </div>
    </div>
  )
}
