"use client"

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { Collapsible } from "radix-ui"
import { AnimatePresence, motion } from "framer-motion"
import {
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/imports/shadcn/sidebar"
import { Row } from "@/components/live/row"
import { ROW_SPRING } from "@/components/live/row/row.config"
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
    registerRow,
    setHoverId,
    collapsed,
  } = useSidebarPanel()
  const rowRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)

  // See sidebar-leaf.tsx — `collapsed` is in deps because Row swaps a Tooltip
  // wrap around its inner button on collapse, remounting the DOM node.
  useEffect(() => {
    registerRow(folder.id, rowRef.current)
    return () => registerRow(folder.id, null)
  }, [folder.id, registerRow, collapsed])

  const expanded = !collapsed && effectiveExpandedIds.has(folder.id)
  const editing = renamingId === folder.id

  const leading = folder.iconName
    ? ({ kind: "icon", icon: folder.iconName } as const)
    : ({ kind: "folder", expanded } as const)

  const handleClick = useCallback(() => {
    if (collapsed) {
      actions.expandIfCollapsed()
      if (!effectiveExpandedIds.has(folder.id)) {
        actions.toggleExpanded(folder.id)
      }
      return
    }
    actions.toggleExpanded(folder.id)
  }, [collapsed, actions, effectiveExpandedIds, folder.id])

  return (
    <SidebarMenuItem>
      <Collapsible.Root open={expanded} onOpenChange={() => undefined}>
        <Collapsible.Trigger asChild>
          <Row
            ref={rowRef}
            label={folder.name}
            size={32}
            leading={leading}
            trailing={{ kind: "chevron", expanded }}
            expanded={expanded}
            editing={editing}
            editDefaultValue={folder.name}
            onCommitEdit={(value) => actions.commitRename(folder.id, value)}
            onCancelEdit={() => actions.cancelRename()}
            onClick={handleClick}
            onHoverChange={(h) => {
              if (h) setHoverId(folder.id)
            }}
            collapsed={collapsed}
            tooltipLabel={collapsed ? folder.name : undefined}
          />
        </Collapsible.Trigger>
        <AnimatePresence initial={false}>
          {expanded ? (
            <Collapsible.Content forceMount asChild>
              <motion.div
                key="content"
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                transition={ROW_SPRING}
                style={{ overflow: "hidden" }}
              >
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
              </motion.div>
            </Collapsible.Content>
          ) : null}
        </AnimatePresence>
      </Collapsible.Root>
    </SidebarMenuItem>
  )
}
