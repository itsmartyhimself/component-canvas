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

export function SidebarSection({
  section,
  folders,
  leaves,
}: SidebarSectionProps) {
  const { searchMatch, hiddenDocIds, hiddenDocsHydrated } = useSidebarPanel()

  // Before the post-mount hydration of `hiddenDocIds` from localStorage, SSR
  // and the first client render must render identical markup. Only filter
  // once the hydration flag flips true.
  const visibleLeaves = hiddenDocsHydrated
    ? leaves.filter((leaf) => !hiddenDocIds.has(leaf.id))
    : leaves

  const filteredFolderIds = searchMatch
    ? new Set(
        folders
          .filter(
            (folder) =>
              searchMatch.folders.has(folder.id) ||
              searchMatch.ancestors.has(folder.id) ||
              visibleLeaves.some(
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
    ? visibleLeaves.filter((leaf) => searchMatch.leaves.has(leaf.id))
    : visibleLeaves

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
      <SectionHeader label={section.label} action={addAction} />
      <SidebarMenu>
        {section.kind === "folders" ? (
          <>
            {displayFolders.length === 0 ? (
              <li className="type-3" style={emptyHintStyle}>
                {searchMatch
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
                No items.
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
