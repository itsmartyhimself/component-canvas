import type { MouseEventHandler, ReactNode } from "react"
import type { CarbonIconName } from "@/lib/icons/registry"

export type RowSize = 24 | 28 | 32 | 36

export type RowVariant = "menu-button" | "menu-sub-button"

export type RowLeading =
  | { kind: "icon"; icon: CarbonIconName }
  | { kind: "folder"; expanded?: boolean }
  | { kind: "dot" }
  | { kind: "initial"; letter: string }
  | { kind: "none" }

export type RowTrailing =
  | { kind: "chevron"; expanded?: boolean }
  | { kind: "action"; action: ReactNode }
  | { kind: "badge"; content: ReactNode }
  | { kind: "kbd"; label: string }
  | { kind: "none" }

export interface RowProps {
  label: string
  size?: RowSize
  variant?: RowVariant
  leading?: RowLeading
  trailing?: RowTrailing
  active?: boolean
  expanded?: boolean
  editing?: boolean
  editDefaultValue?: string
  onCommitEdit?: (value: string) => void
  onCancelEdit?: () => void
  loading?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  onHoverChange?: (hovered: boolean) => void
  href?: string
  ariaLabel?: string
  className?: string
  collapsed?: boolean
  tooltipLabel?: string
}

export interface RowDimension {
  height: number
  paddingX: string
  paddingY: string
  typeClass: string
  gap: string
  radius: string
}

export const ROW_DIMENSIONS: Record<RowSize, RowDimension> = {
  24: {
    height: 24,
    paddingX: "var(--spacing-3)",
    paddingY: "var(--spacing-1)",
    typeClass: "type-3",
    gap: "var(--spacing-3)",
    radius: "var(--radius-1-5)",
  },
  28: {
    height: 28,
    paddingX: "var(--spacing-3)",
    paddingY: "var(--spacing-2-5)",
    typeClass: "type-3",
    gap: "var(--spacing-3)",
    radius: "var(--radius-1-5)",
  },
  32: {
    height: 32,
    paddingX: "var(--spacing-3)",
    paddingY: "var(--spacing-2-5)",
    typeClass: "type-4",
    gap: "var(--spacing-3)",
    radius: "var(--radius-2)",
  },
  36: {
    height: 36,
    paddingX: "var(--spacing-3)",
    paddingY: "var(--spacing-3)",
    typeClass: "type-4",
    gap: "var(--spacing-3)",
    radius: "var(--radius-2)",
  },
}

export interface RowStateStyle {
  background: string
  foreground: string
  iconColor: string
}

export const ROW_STATE: Record<
  "default" | "hover" | "active" | "expanded" | "disabled" | "loading",
  RowStateStyle
> = {
  default: {
    background: "transparent",
    foreground: "var(--color-text-primary)",
    iconColor: "var(--color-text-secondary)",
  },
  hover: {
    background: "transparent",
    foreground: "var(--color-text-primary)",
    iconColor: "var(--color-text-primary)",
  },
  active: {
    background: "var(--color-text-primary)",
    foreground: "var(--color-bg-primary)",
    iconColor: "var(--color-bg-primary)",
  },
  expanded: {
    background: "transparent",
    foreground: "var(--color-text-primary)",
    iconColor: "var(--color-text-primary)",
  },
  disabled: {
    background: "transparent",
    foreground: "var(--color-text-tertiary)",
    iconColor: "var(--color-text-tertiary)",
  },
  loading: {
    background: "var(--color-bg-hover)",
    foreground: "var(--color-text-tertiary)",
    iconColor: "var(--color-text-tertiary)",
  },
}

export const ROW_ICON_SIZE = 16

export const ROW_HOVER_PILL = {
  background: "var(--color-bg-hover)",
}

export const ROW_SPRING = { type: "spring" as const, stiffness: 350, damping: 35 }

export const DEFAULT_SIZE_FOR_VARIANT: Record<RowVariant, RowSize> = {
  "menu-button": 32,
  "menu-sub-button": 28,
}
