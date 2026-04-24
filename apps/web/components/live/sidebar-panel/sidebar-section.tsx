"use client"

import type { CSSProperties } from "react"
import { Add } from "@carbon/icons-react"
import { SidebarGroup, SidebarMenu } from "@/components/imports/shadcn/sidebar"
import { AddMenu } from "@/components/live/add-menu"
import { IconButton } from "@/components/live/icon-button"
import { SectionHeader } from "@/components/live/section-header"
import type {
  FolderRecord,
  LeafRecord,
  SectionRecord,
} from "@/lib/registry/types"
import { SidebarFolder } from "./sidebar-folder"
import { SidebarLeaf } from "./sidebar-leaf"
import {
  SIDEBAR_EASE_OUT_SOFT,
  SIDEBAR_LABEL_ENTER_MS,
  SIDEBAR_LABEL_EXIT_MS,
  SIDEBAR_WIDTH_DURATION_MS,
} from "./sidebar-panel.config"
import { useSidebarPanel } from "./use-sidebar-panel"

interface SidebarSectionProps {
  section: SectionRecord
  folders: FolderRecord[]
  leaves: LeafRecord[]
}

const emptyHintStyle: CSSProperties = {
  padding: "var(--spacing-2) var(--spacing-3)",
  color: "var(--color-text-tertiary)",
}

// Section header uses the grid-template-rows: 0fr/1fr trick so height
// collapses without hardcoding a fixed pixel value. Browser-interpolated at
// the style-recalc level (no JS per frame). Height + opacity transition in
// lockstep with the aside width for unified "everything moves together"
// motion.
function headerCollapseStyle(collapsed: boolean): CSSProperties {
  const labelMs = collapsed ? SIDEBAR_LABEL_EXIT_MS : SIDEBAR_LABEL_ENTER_MS
  return {
    display: "grid",
    gridTemplateRows: collapsed ? "0fr" : "1fr",
    opacity: collapsed ? 0 : 1,
    pointerEvents: collapsed ? "none" : undefined,
    transition: [
      `grid-template-rows ${SIDEBAR_WIDTH_DURATION_MS}ms ${SIDEBAR_EASE_OUT_SOFT}`,
      `opacity ${labelMs}ms ${SIDEBAR_EASE_OUT_SOFT}`,
    ].join(", "),
  }
}

export function SidebarSection({
  section,
  folders,
  leaves,
}: SidebarSectionProps) {
  const { searchMatch, collapsed } = useSidebarPanel()

  const filteredFolderIds = searchMatch
    ? new Set(
        folders
          .filter(
            (folder) =>
              searchMatch.folders.has(folder.id) ||
              searchMatch.ancestors.has(folder.id) ||
              leaves.some(
                (leaf) =>
                  leaf.folderId === folder.id &&
                  searchMatch.leaves.has(leaf.id),
              ),
          )
          .map((folder) => folder.id),
      )
    : null

  const displayFolders = filteredFolderIds
    ? folders.filter((folder) => filteredFolderIds.has(folder.id))
    : folders

  const displayLeaves = searchMatch
    ? leaves.filter((leaf) => searchMatch.leaves.has(leaf.id))
    : leaves

  const addAction = section.actionable ? (
    <AddMenu
      scope={section.id}
      trigger={
        <IconButton
          icon={<Add size={14} />}
          size={20}
          bordered={false}
          ariaLabel={`Add to ${section.label}`}
        />
      }
    />
  ) : undefined

  return (
    <SidebarGroup>
      <div style={headerCollapseStyle(collapsed)}>
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <SectionHeader label={section.label} action={addAction} />
        </div>
      </div>
      <SidebarMenu>
        {section.kind === "folders" ? (
          <>
            {displayFolders.length === 0 ? (
              <li className="type-3" style={emptyHintStyle}>
                {collapsed
                  ? null
                  : searchMatch
                    ? "No matches in this section."
                    : "No folders yet. Click + to add one."}
              </li>
            ) : (
              displayFolders.map((folder) => {
                const childLeaves = displayLeaves
                  .filter((leaf) => leaf.folderId === folder.id)
                  .sort((a, b) => a.order - b.order)
                return (
                  <SidebarFolder
                    key={folder.id}
                    folder={folder}
                    hasChildren={childLeaves.length > 0}
                  >
                    {childLeaves.map((leaf) => (
                      <SidebarLeaf key={leaf.id} leaf={leaf} />
                    ))}
                  </SidebarFolder>
                )
              })
            )}
          </>
        ) : (
          <>
            {displayLeaves.length === 0 ? (
              <li className="type-3" style={emptyHintStyle}>
                {collapsed ? null : "No items."}
              </li>
            ) : (
              displayLeaves
                .sort((a, b) => a.order - b.order)
                .map((leaf) => (
                  <SidebarLeaf key={leaf.id} leaf={leaf} depth={0} />
                ))
            )}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
