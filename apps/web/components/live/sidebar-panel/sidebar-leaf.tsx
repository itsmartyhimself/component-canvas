"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import {
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/imports/shadcn/sidebar"
import { Row } from "@/components/live/row"
import type { LeafRecord } from "@/lib/registry/types"
import { DocActionMenu } from "./doc-action-menu"
import { RowActionMenu } from "./row-action-menu"
import { useSidebarPanel } from "./use-sidebar-panel"

interface SidebarLeafProps {
  leaf: LeafRecord
  depth?: 0 | 1
}

export function SidebarLeaf({ leaf, depth = 1 }: SidebarLeafProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { actions, renamingId, hiddenDocIds } = useSidebarPanel()

  const selectedId = searchParams.get("component")
  const active = leaf.kind === "component" && selectedId === leaf.id
  const editing = renamingId === leaf.id

  const handleClick = useCallback(() => {
    if (leaf.disabled || leaf.loading) return
    if (leaf.kind === "doc") {
      actions.openDoc(leaf.id)
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set("component", leaf.id)
    router.push(`${pathname}?${params.toString()}`)
  }, [leaf, actions, pathname, router, searchParams])

  const leading = (() => {
    if (leaf.kind === "nav") return { kind: "dot" } as const
    if (leaf.iconName) return { kind: "icon", icon: leaf.iconName } as const
    return { kind: "icon", icon: "cube" } as const
  })()

  const actionNode = editing
    ? null
    : leaf.kind === "doc"
      ? (
          <DocActionMenu
            ariaLabel={`Actions for ${leaf.name}`}
            hidden={hiddenDocIds.has(leaf.id)}
            onToggleHidden={() => {
              if (hiddenDocIds.has(leaf.id)) actions.unhideDoc(leaf.id)
              else actions.hideDoc(leaf.id)
            }}
          />
        )
      : (
          <RowActionMenu
            ariaLabel={`Actions for ${leaf.name}`}
            itemKind="leaf"
            itemName={leaf.name}
            onRename={() => actions.startRename(leaf.id)}
            onConfirmDelete={() => actions.deleteEntry(leaf.id)}
          />
        )

  if (depth === 1) {
    return (
      <SidebarMenuSubItem style={{ position: "relative" }}>
        <SidebarMenuSubButton asChild>
          <Row
            label={leaf.name}
            size={28}
            variant="menu-sub-button"
            depth={1}
            leading={leading}
            active={active}
            disabled={leaf.disabled}
            loading={leaf.loading}
            editing={editing}
            editDefaultValue={leaf.name}
            onCommitEdit={(value) => actions.commitRename(leaf.id, value)}
            onCancelEdit={() => actions.cancelRename()}
            onClick={handleClick}
          />
        </SidebarMenuSubButton>
        {actionNode}
      </SidebarMenuSubItem>
    )
  }

  return (
    <SidebarMenuItem style={{ position: "relative" }}>
      <Row
        label={leaf.name}
        size={32}
        leading={leading}
        active={active}
        disabled={leaf.disabled}
        loading={leaf.loading}
        editing={editing}
        editDefaultValue={leaf.name}
        onCommitEdit={(value) => actions.commitRename(leaf.id, value)}
        onCancelEdit={() => actions.cancelRename()}
        onClick={handleClick}
      />
      {actionNode}
    </SidebarMenuItem>
  )
}
