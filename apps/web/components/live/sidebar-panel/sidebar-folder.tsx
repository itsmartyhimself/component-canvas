"use client"

import type { CSSProperties, ReactNode } from "react"
import { Collapsible } from "radix-ui"
import {
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/imports/shadcn/sidebar"
import { Row } from "@/components/live/row"
import type { FolderRecord } from "@/lib/registry/types"
import { RowActionMenu } from "./row-action-menu"
import { useSidebarPanel } from "./use-sidebar-panel"

interface SidebarFolderProps {
  folder: FolderRecord
  children: ReactNode
  hasChildren: boolean
}

const subStyle: CSSProperties = {
  borderLeftColor: "var(--sidebar-indent-rail)",
  paddingLeft: "var(--spacing-3)",
  marginLeft: "var(--spacing-4)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-1)",
  listStyle: "none",
  paddingTop: 0,
  paddingBottom: 0,
  marginRight: 0,
  paddingRight: 0,
}

export function SidebarFolder({
  folder,
  children,
  hasChildren,
}: SidebarFolderProps) {
  const {
    effectiveExpandedIds,
    renamingId,
    actions,
  } = useSidebarPanel()

  const expanded = effectiveExpandedIds.has(folder.id)
  const editing = renamingId === folder.id

  const leading = folder.iconName
    ? ({ kind: "icon", icon: folder.iconName } as const)
    : ({ kind: "folder", expanded } as const)

  return (
    <SidebarMenuItem>
      <Collapsible.Root
        open={expanded}
        onOpenChange={() => actions.toggleExpanded(folder.id)}
      >
        <div style={{ position: "relative" }}>
          <Collapsible.Trigger asChild>
            <Row
              label={folder.name}
              size={32}
              leading={leading}
              trailing={{ kind: "chevron", expanded }}
              expanded={expanded}
              editing={editing}
              editDefaultValue={folder.name}
              onCommitEdit={(value) => actions.commitRename(folder.id, value)}
              onCancelEdit={() => actions.cancelRename()}
            />
          </Collapsible.Trigger>
          {!editing ? (
            <RowActionMenu
              ariaLabel={`Actions for ${folder.name}`}
              itemKind="folder"
              itemName={folder.name || "New folder"}
              onRename={() => actions.startRename(folder.id)}
              onAddComponent={() => {
                actions.openAddMenu(folder.sectionId)
              }}
              onConfirmDelete={() => actions.deleteEntry(folder.id)}
            />
          ) : null}
        </div>
        <Collapsible.Content>
          {hasChildren ? (
            <SidebarMenuSub style={subStyle}>{children}</SidebarMenuSub>
          ) : (
            <div
              className="type-3"
              style={{
                color: "var(--color-text-tertiary)",
                padding:
                  "var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-7)",
              }}
            >
              Empty folder
            </div>
          )}
        </Collapsible.Content>
      </Collapsible.Root>
    </SidebarMenuItem>
  )
}
