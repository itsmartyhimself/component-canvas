"use client"

import type { CSSProperties, ReactNode } from "react"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  DocumentAdd,
  FolderAdd,
} from "@carbon/icons-react"
import { Popover } from "radix-ui"
import type { SectionId } from "@/lib/registry/types"
import { useSidebarPanel } from "@/components/live/sidebar-panel/use-sidebar-panel"

interface AddMenuProps {
  trigger: ReactNode
  scope: SectionId | null
}

const contentStyle: CSSProperties = {
  minWidth: 240,
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
  background: "transparent",
  width: "100%",
  textAlign: "left" as const,
  border: 0,
  outline: "none",
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

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-3)",
  padding: "var(--spacing-2) var(--spacing-2) 0",
  color: "var(--color-text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
}

function MenuItem({
  label,
  icon,
  onSelect,
}: {
  label: string
  icon: ReactNode
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className="type-3"
      style={itemStyle}
      onClick={onSelect}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = "var(--color-bg-secondary)"
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = "transparent"
      }}
    >
      <span style={iconSlotStyle}>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export function AddMenu({ trigger, scope }: AddMenuProps) {
  const {
    addMenuOpen,
    addMenuSection,
    registry,
    actions,
  } = useSidebarPanel()

  const open = addMenuOpen && addMenuSection === scope
  const [pickerSection, setPickerSection] = useState<SectionId | null>(null)
  const activeSection = scope ?? pickerSection

  useEffect(() => {
    if (!open) setPickerSection(null)
  }, [open])

  const actionableSections = registry.sections.filter((section) => section.actionable)

  const currentSectionLabel = activeSection
    ? registry.sections.find((section) => section.id === activeSection)?.label
    : null

  const handleOpenChange = (next: boolean) => {
    if (next) {
      actions.openAddMenu(scope)
    } else {
      actions.closeAddMenu()
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={4}
          style={contentStyle}
        >
          {!activeSection ? (
            <>
              <div className="type-2" style={headerStyle}>
                ADD TO
              </div>
              {actionableSections.map((section) => (
                <MenuItem
                  key={section.id}
                  label={section.label}
                  icon={<FolderAdd size={14} />}
                  onSelect={() => setPickerSection(section.id)}
                />
              ))}
            </>
          ) : (
            <>
              <div className="type-2" style={headerStyle}>
                {currentSectionLabel}
              </div>
              {!scope ? (
                <MenuItem
                  label="Back"
                  icon={<ArrowLeft size={14} />}
                  onSelect={() => setPickerSection(null)}
                />
              ) : null}
              <MenuItem
                label="New folder"
                icon={<FolderAdd size={14} />}
                onSelect={() => {
                  actions.startNewFolder(activeSection)
                }}
              />
              <MenuItem
                label="Import component"
                icon={<DocumentAdd size={14} />}
                onSelect={() => {
                  actions.openImportDialog(activeSection)
                }}
              />
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
