"use client"

import type { CSSProperties, ReactNode } from "react"
import { Dialog } from "radix-ui"
import { Button } from "@/components/live/button"
import { useSidebarPanel } from "@/components/live/sidebar-panel/use-sidebar-panel"
import { resolveDocBody, resolveDocTitle } from "./doc-modal.config"

interface DocModalBaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  body?: ReactNode
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(18, 17, 17, 0.35)",
  zIndex: 50,
}

const contentStyle: CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(560px, calc(100vw - var(--spacing-11)))",
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

export function DocModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  title,
  body,
}: DocModalBaseProps = {}) {
  const { openDocId, actions } = useSidebarPanel()
  const isControlled = controlledOpen !== undefined

  const open = isControlled ? controlledOpen : openDocId !== null
  const handleOpenChange =
    controlledOnOpenChange ??
    ((next: boolean) => {
      if (!next) actions.closeDoc()
    })

  const activeId = openDocId
  const resolvedTitle = title ?? (activeId ? resolveDocTitle(activeId) : "Document")
  const resolvedBody =
    body ?? (activeId ? resolveDocBody(activeId) : "Stub doc body.")

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyle} />
        <Dialog.Content style={contentStyle}>
          <Dialog.Title
            className="type-7"
            style={{ color: "var(--color-text-primary)" }}
          >
            {resolvedTitle}
          </Dialog.Title>
          <Dialog.Description
            className="type-4"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {resolvedBody}
          </Dialog.Description>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <Button label="Close" variant="secondary" size="small" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
