"use client"

// TODO(ROADMAP: "Sidebar" → folder rename / delete UI): folder rows intentionally
// have no hover "..." menu — the chevron is the only trailing affordance. The
// "manage folders" view + click-into-rename follow-ups are captured in
// apps/web/ROADMAP.md under Sidebar.

import type { CSSProperties, ReactNode } from "react"
import { Collapsible } from "radix-ui"
import {
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/imports/shadcn/sidebar"
import { Row } from "@/components/live/row"
import type { FolderRecord } from "@/lib/registry/types"
import { useSidebarPanel } from "./use-sidebar-panel"

interface SidebarFolderProps {
  folder: FolderRecord
  children: ReactNode
  hasChildren: boolean
}

const subStyle: CSSProperties = {
  borderLeftColor: "var(--sidebar-indent-rail)",
  marginLeft: "var(--spacing-4)",
  marginRight: 0,
  paddingLeft: "var(--spacing-3)",
  paddingRight: "var(--spacing-3)",
  paddingTop: "var(--spacing-2)",
  paddingBottom: "var(--spacing-2)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-1)",
  listStyle: "none",
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
