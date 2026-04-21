"use client"

// DEMO-ONLY — submits to the in-memory SidebarActions facade. The real import
// pipeline is tracked in apps/web/ROADMAP.md → "Backend / Registry".

import type { CSSProperties } from "react"
import { useEffect, useState } from "react"
import { Dialog } from "radix-ui"
import { Button } from "@/components/live/button"
import type { SectionId } from "@/lib/registry/types"
import { useSidebarPanel } from "@/components/live/sidebar-panel/use-sidebar-panel"

interface ImportDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultSection?: SectionId | null
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
  width: "min(480px, calc(100vw - var(--spacing-11)))",
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

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-2)",
}

const inputStyle: CSSProperties = {
  height: 32,
  borderRadius: "var(--radius-2)",
  border: "1px solid var(--color-border-primary)",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  padding: "0 var(--spacing-3)",
  outline: "none",
}

export function ImportDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultSection,
}: ImportDialogProps = {}) {
  const {
    importDialogOpen,
    importDialogSection,
    registry,
    actions,
  } = useSidebarPanel()

  const open = controlledOpen ?? importDialogOpen
  const handleOpenChange =
    controlledOnOpenChange ??
    ((next: boolean) => {
      if (!next) actions.closeImportDialog()
    })

  const effectiveSection = defaultSection ?? importDialogSection ?? "library"
  const foldersInSection = registry.folders.filter(
    (folder) => folder.sectionId === effectiveSection,
  )

  const [name, setName] = useState("")
  const [folderId, setFolderId] = useState<string>(
    foldersInSection[0]?.id ?? "",
  )

  useEffect(() => {
    if (!open) return
    setName("")
    setFolderId(foldersInSection[0]?.id ?? "")
  }, [open, effectiveSection, foldersInSection])

  const canSubmit = name.trim().length > 0

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    actions.addComponent({
      name,
      folderId: folderId || null,
      sectionId: effectiveSection,
    })
    handleOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyle} />
        <Dialog.Content style={contentStyle}>
          <Dialog.Title
            className="type-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Import component
          </Dialog.Title>
          <Dialog.Description
            className="type-3"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Real repo-connect is coming. For now the component is added to the
            in-memory registry so you can exercise the UX.
          </Dialog.Description>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-5)",
            }}
            onSubmit={handleSubmit}
          >
            <label style={fieldStyle}>
              <span
                className="type-3"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Name
              </span>
              <input
                className="type-3"
                style={inputStyle}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Hero Banner"
                autoFocus
              />
            </label>
            <label style={fieldStyle}>
              <span
                className="type-3"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Folder
              </span>
              <select
                className="type-3"
                style={inputStyle}
                value={folderId}
                onChange={(event) => setFolderId(event.target.value)}
              >
                {foldersInSection.length === 0 ? (
                  <option value="">(no folder)</option>
                ) : null}
                {foldersInSection.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name || "Unnamed"}
                  </option>
                ))}
              </select>
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--spacing-3)",
                marginTop: "var(--spacing-3)",
              }}
            >
              <Dialog.Close asChild>
                <Button label="Cancel" variant="ghost" size="small" />
              </Dialog.Close>
              <Button
                label="Add"
                variant="pop"
                size="small"
                type="submit"
                disabled={!canSubmit}
              />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
