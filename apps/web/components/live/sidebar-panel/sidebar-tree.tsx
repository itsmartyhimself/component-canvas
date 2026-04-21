"use client"

// TODO(ROADMAP: "Sidebar" → virtualize ~200 rows): the tree is rendered in full
// today. When registries grow, swap the inner SidebarMenu rendering for a
// virtualised list (react-virtual or equivalent).

import type { CSSProperties } from "react"
import { SidebarMenu, SidebarMenuItem } from "@/components/imports/shadcn/sidebar"
import { Row } from "@/components/live/row"
import { SidebarDivider } from "./sidebar-divider"
import { SidebarSection } from "./sidebar-section"
import { useSidebarPanel } from "./use-sidebar-panel"

const topPagesWrapperStyle: CSSProperties = {
  padding: "var(--spacing-2) var(--spacing-3)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-1)",
}

export function SidebarTree() {
  const { registry, actions } = useSidebarPanel()

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SidebarMenu style={topPagesWrapperStyle}>
        {registry.topPages.map((page) => (
          <SidebarMenuItem key={page.id}>
            <Row
              label={page.label}
              size={32}
              leading={{ kind: "icon", icon: page.iconName }}
              onClick={() => actions.openDoc(page.id)}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarDivider />
      {registry.sections.map((section, idx) => {
        const folders = registry.folders
          .filter((folder) => folder.sectionId === section.id)
          .sort((a, b) => a.order - b.order)
        const leaves = registry.leaves.filter(
          (leaf) => leaf.sectionId === section.id,
        )
        return (
          <div key={section.id}>
            {idx > 0 ? <div style={{ height: "var(--spacing-2)" }} /> : null}
            <SidebarSection
              section={section}
              folders={folders}
              leaves={leaves}
            />
          </div>
        )
      })}
    </div>
  )
}
