"use client"

import type { CSSProperties, ReactNode } from "react"
import { useState } from "react"
import {
  DocumentAdd,
  Edit,
  OverflowMenuHorizontal,
  TrashCan,
} from "@carbon/icons-react"
import { AlertDialog, DropdownMenu } from "radix-ui"
import { Button } from "@/components/live/button"
import { cn } from "@/lib/utils"

// `scope` must match the shadcn group name on the closest ancestor list item
// ("menu-item" for top-level `SidebarMenuItem`, "menu-sub-item" for
// `SidebarMenuSubItem`). Picking the wrong scope (or using both) makes the
// trigger appear when an ancestor item is hovered — e.g. hovering a folder
// revealing "..." on every nested leaf.
type RowActionScope = "menu-item" | "menu-sub-item"

interface BaseProps {
  ariaLabel: string
  itemName: string
  itemKind: "folder" | "leaf"
  scope: RowActionScope
  onRename: () => void
  onConfirmDelete: () => void
}

interface FolderProps extends BaseProps {
  itemKind: "folder"
  onAddComponent: () => void
}

interface LeafProps extends BaseProps {
  itemKind: "leaf"
}

export type RowActionMenuProps = FolderProps | LeafProps

const triggerStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  right: "var(--spacing-2)",
  transform: "translateY(-50%)",
  width: 20,
  height: 20,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius-1-5)",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-secondary)",
  border: "1px solid var(--color-border-primary)",
  cursor: "pointer",
}

const contentStyle: CSSProperties = {
  minWidth: 200,
  padding: "var(--spacing-2)",
  borderRadius: "var(--radius-2)",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-layered)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-1)",
  zIndex: 40,
}

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-3)",
  padding: "var(--spacing-2) var(--spacing-2)",
  borderRadius: "var(--radius-1-5)",
  color: "var(--color-text-primary)",
  cursor: "pointer",
  outline: "none",
  userSelect: "none",
}

const iconSlotStyle: CSSProperties = {
  width: 16,
  height: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-text-secondary)",
  flexShrink: 0,
}

const alertOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(18, 17, 17, 0.35)",
  zIndex: 50,
}

const alertContentStyle: CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(440px, calc(100vw - var(--spacing-11)))",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  borderRadius: "var(--radius-3)",
  padding: "var(--spacing-7)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-5)",
  boxShadow: "var(--shadow-layered)",
  zIndex: 51,
}

interface ItemProps {
  label: string
  icon: ReactNode
  onSelect: () => void
  destructive?: boolean
}

function ActionItem({ label, icon, onSelect }: ItemProps) {
  return (
    <DropdownMenu.Item
      className={cn("type-3")}
      style={itemStyle}
      onSelect={(event) => {
        event.preventDefault()
        onSelect()
      }}
    >
      <span style={iconSlotStyle}>{icon}</span>
      <span>{label}</span>
    </DropdownMenu.Item>
  )
}

const HOVER_CLASSES: Record<RowActionScope, string> = {
  "menu-item":
    "group-hover/menu-item:opacity-100 group-focus-within/menu-item:opacity-100",
  "menu-sub-item":
    "group-hover/menu-sub-item:opacity-100 group-focus-within/menu-sub-item:opacity-100",
}

export function RowActionMenu(props: RowActionMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = () => {
    setMenuOpen(false)
    setDeleteOpen(true)
  }

  const handleRename = () => {
    setMenuOpen(false)
    props.onRename()
  }

  const handleAddComponent = () => {
    setMenuOpen(false)
    if (props.itemKind === "folder") props.onAddComponent()
  }

  return (
    <>
      <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label={props.ariaLabel}
            data-row-action
            data-state={menuOpen ? "open" : "closed"}
            className={cn(
              "opacity-0 transition-opacity",
              HOVER_CLASSES[props.scope],
              "data-[state=open]:opacity-100",
            )}
            style={triggerStyle}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <OverflowMenuHorizontal size={14} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="right"
            align="start"
            sideOffset={4}
            style={contentStyle}
          >
            <ActionItem
              label="Rename"
              icon={<Edit size={14} />}
              onSelect={handleRename}
            />
            {props.itemKind === "folder" ? (
              <ActionItem
                label="Add component here"
                icon={<DocumentAdd size={14} />}
                onSelect={handleAddComponent}
              />
            ) : null}
            <ActionItem
              label="Delete"
              icon={<TrashCan size={14} />}
              onSelect={handleDelete}
              destructive
            />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <AlertDialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay style={alertOverlayStyle} />
          <AlertDialog.Content style={alertContentStyle}>
            <AlertDialog.Title
              className="type-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Delete {props.itemKind === "folder" ? "folder" : "component"}?
            </AlertDialog.Title>
            <AlertDialog.Description
              className="type-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {props.itemKind === "folder"
                ? `"${props.itemName}" and everything inside it will be removed from the sidebar.`
                : `"${props.itemName}" will be removed from the sidebar.`}
            </AlertDialog.Description>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--spacing-3)",
              }}
            >
              <AlertDialog.Cancel asChild>
                <Button label="Cancel" variant="ghost" size="small" />
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  label="Delete"
                  variant="pop"
                  size="small"
                  onClick={() => props.onConfirmDelete()}
                />
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  )
}
