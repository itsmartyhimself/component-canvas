"use client"

import type { CSSProperties } from "react"
import { useState } from "react"
import {
  OverflowMenuHorizontal,
  View,
  ViewOff,
} from "@carbon/icons-react"
import { DropdownMenu } from "radix-ui"
import { cn } from "@/lib/utils"

interface DocActionMenuProps {
  ariaLabel: string
  hidden: boolean
  onToggleHidden: () => void
}

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
  padding: "var(--spacing-2)",
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

export function DocActionMenu({
  ariaLabel,
  hidden,
  onToggleHidden,
}: DocActionMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          data-row-action
          data-state={open ? "open" : "closed"}
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
          <DropdownMenu.Item
            className={cn("type-3")}
            style={itemStyle}
            onSelect={(event) => {
              event.preventDefault()
              onToggleHidden()
              setOpen(false)
            }}
          >
            <span style={iconSlotStyle}>
              {hidden ? <View size={14} /> : <ViewOff size={14} />}
            </span>
            <span>{hidden ? "Show in sidebar" : "Hide from sidebar"}</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
