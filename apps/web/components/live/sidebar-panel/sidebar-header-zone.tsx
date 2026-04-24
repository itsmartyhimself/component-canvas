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
import { useSidebarPanel } from "./use-sidebar-panel"
import { SidebarDivider } from "./sidebar-divider"

const expandedHeaderStyle: CSSProperties = {
  padding: "var(--spacing-3) var(--spacing-3) 0 var(--spacing-3)",
  display: "flex",
  flexDirection: "column",
}

const expandedSearchRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-2)",
  padding: "0 var(--spacing-3) var(--spacing-3) var(--spacing-3)",
}

const collapsedHeaderStyle: CSSProperties = {
  padding: "var(--spacing-3) var(--spacing-3) 0 var(--spacing-3)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const collapsedActionRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
}

export function SidebarHeaderZone() {
  const { searchQuery, actions, registry, collapsed, addButtonRef } =
    useSidebarPanel()

  if (collapsed) {
    return (
      <div style={collapsedHeaderStyle}>
        <TeamSwitcher
          teams={[registry.team]}
          activeTeamId={registry.team.id}
          collapsed
        />
        <SidebarDivider />
        <div style={collapsedActionRowStyle}>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                icon={<Add size={16} />}
                size={28}
                ariaLabel="Add folder or component"
                onClick={actions.requestAddFocus}
              />
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8} style={tooltipStyle}>
              Add
            </TooltipContent>
          </Tooltip>
        </div>
        <SidebarDivider />
      </div>
    )
  }

  return (
    <div style={expandedHeaderStyle}>
      <TeamSwitcher teams={[registry.team]} activeTeamId={registry.team.id} />
      <SidebarDivider />
      <div style={expandedSearchRowStyle}>
        <SearchInput
          value={searchQuery}
          onValueChange={actions.setSearchQuery}
          placeholder="Search"
        />
        <AddMenu
          scope={null}
          trigger={
            <IconButton
              ref={addButtonRef}
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
