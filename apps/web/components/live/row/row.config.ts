import type { ReactNode } from "react"
import type { CarbonIconName } from "@/lib/icons/registry"

export type RowSize = 20 | 24 | 28 | 32 | 36

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
  depth?: 0 | 1
  active?: boolean
  expanded?: boolean
  editing?: boolean
  editDefaultValue?: string
  onCommitEdit?: (value: string) => void
  onCancelEdit?: () => void
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  href?: string
  ariaLabel?: string
  className?: string
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
  20: {
    height: 20,
    paddingX: "var(--spacing-3)",
    paddingY: "0",
    typeClass: "type-3",
    gap: "var(--spacing-3)",
    radius: "var(--radius-1-5)",
  },
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
  fontWeight: number | "inherit"
}

export const ROW_STATE: Record<
  "default" | "hover" | "active" | "expanded" | "disabled" | "loading",
  RowStateStyle
> = {
  default: {
    background: "transparent",
    foreground: "var(--color-text-primary)",
    iconColor: "var(--color-text-secondary)",
    fontWeight: 400,
  },
  hover: {
    background: "var(--color-bg-secondary)",
    foreground: "var(--color-text-primary)",
    iconColor: "var(--color-text-primary)",
    fontWeight: 400,
  },
  active: {
    background: "var(--color-text-primary)",
    foreground: "var(--color-bg-primary)",
    iconColor: "var(--color-bg-primary)",
    fontWeight: 500,
  },
  expanded: {
    background: "var(--color-bg-secondary)",
    foreground: "var(--color-text-primary)",
    iconColor: "var(--color-text-primary)",
    fontWeight: 500,
  },
  disabled: {
    background: "transparent",
    foreground: "var(--color-text-tertiary)",
    iconColor: "var(--color-text-tertiary)",
    fontWeight: 400,
  },
  loading: {
    background: "var(--color-bg-secondary)",
    foreground: "var(--color-text-tertiary)",
    iconColor: "var(--color-text-tertiary)",
    fontWeight: 400,
  },
}

export const ROW_ICON_SIZE = 16

export const ROW_TRANSITION =
  "background-color 120ms ease, color 120ms ease"

export const DEFAULT_SIZE_FOR_VARIANT: Record<RowVariant, RowSize> = {
  "menu-button": 32,
  "menu-sub-button": 28,
}
