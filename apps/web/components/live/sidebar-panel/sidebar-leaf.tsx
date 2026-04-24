"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, type CSSProperties } from "react"
import {
  SidebarMenuItem,
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
  const {
    actions,
    renamingId,
    hiddenDocIds,
    registerRow,
    setHoverId,
    collapsed,
  } = useSidebarPanel()
  const rowRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)

  useEffect(() => {
    registerRow(leaf.id, rowRef.current)
    return () => registerRow(leaf.id, null)
  }, [leaf.id, registerRow])

  const selectedId = searchParams.get("component")
  const active = leaf.kind === "component" && selectedId === leaf.id
  const editing = renamingId === leaf.id

  const isHidden = leaf.kind === "doc" && hiddenDocIds.has(leaf.id)

  const handleClick = useCallback(() => {
    if (leaf.disabled || leaf.loading) return
    if (collapsed) actions.expandIfCollapsed()
    if (leaf.kind === "doc") {
      actions.openDoc(leaf.id)
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set("component", leaf.id)
    router.push(`${pathname}?${params.toString()}`)
  }, [leaf, actions, pathname, router, searchParams, collapsed])

  const leading = (() => {
    if (leaf.kind === "nav") return { kind: "dot" } as const
    if (leaf.iconName) return { kind: "icon", icon: leaf.iconName } as const
    return { kind: "icon", icon: "cube" } as const
  })()

  const actionScope = depth === 1 ? "menu-sub-item" : "menu-item"

  const actionNode = editing || collapsed
    ? null
    : leaf.kind === "doc"
      ? (
          <DocActionMenu
            ariaLabel={`Actions for ${leaf.name}`}
            hidden={hiddenDocIds.has(leaf.id)}
            scope={actionScope}
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
            scope={actionScope}
            onRename={() => actions.startRename(leaf.id)}
            onConfirmDelete={() => actions.deleteEntry(leaf.id)}
          />
        )

  const itemStyle: CSSProperties = {
    position: "relative",
    display: isHidden ? "none" : undefined,
  }

  const rowNode = (
    <Row
      ref={rowRef}
      label={leaf.name}
      size={depth === 1 ? 28 : 32}
      variant={depth === 1 ? "menu-sub-button" : "menu-button"}
      leading={leading}
      active={active}
      disabled={leaf.disabled}
      loading={leaf.loading}
      editing={editing}
      editDefaultValue={leaf.name}
      onCommitEdit={(value) => actions.commitRename(leaf.id, value)}
      onCancelEdit={() => actions.cancelRename()}
      onClick={handleClick}
      onHoverChange={(h) => {
        if (h) setHoverId(leaf.id)
      }}
      collapsed={collapsed}
      tooltipLabel={collapsed ? leaf.name : undefined}
    />
  )

  if (depth === 1) {
    return (
      <SidebarMenuSubItem style={itemStyle}>
        {rowNode}
        {actionNode}
      </SidebarMenuSubItem>
    )
  }

  return (
    <SidebarMenuItem style={itemStyle}>
      {rowNode}
      {actionNode}
    </SidebarMenuItem>
  )
}
