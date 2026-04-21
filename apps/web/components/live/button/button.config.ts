import type { ReactNode } from "react"

export type ButtonSize = "small" | "medium" | "large"

export type ButtonVariant =
  | "pop"
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "text-link"

export type ButtonForm = "label" | "icon-only"

export interface ButtonProps {
  label?: string
  size?: ButtonSize
  variant?: ButtonVariant
  form?: ButtonForm
  icon?: ReactNode
  fill?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  href?: string
  type?: "button" | "submit" | "reset"
  ariaLabel?: string
  className?: string
}

export const HEIGHT_MAP: Record<ButtonSize, number> = {
  small: 36,
  medium: 44,
  large: 48,
}

export const TEXT_LINK_HEIGHT = "auto"

export const RADIUS_MAP: Record<ButtonSize, string> = {
  small: "var(--radius-3)",
  medium: "var(--radius-3)",
  large: "var(--radius-4)",
}

export const ICON_SIZE = 16

export const PADDING_MAP: Record<ButtonSize, Record<ButtonForm, string>> = {
  small: {
    label: "0 var(--spacing-6)",
    "icon-only": "0 var(--spacing-4)",
  },
  medium: {
    label: "0 var(--spacing-6)",
    "icon-only": "0 var(--spacing-4)",
  },
  large: {
    label: "0 var(--spacing-6)",
    "icon-only": "0 var(--spacing-4)",
  },
}

export const TEXT_LINK_PADDING = "0 var(--spacing-2)"

export const LABEL_GAP = "var(--spacing-3)"

export const BUTTON_SHADOW = "0 2px 3.5px rgba(0,0,0,0.05)"

export function getTypeClass(size: ButtonSize, variant: ButtonVariant): string {
  if (size === "small") return "type-4"
  if (variant === "text-link" && size === "large") return "type-6"
  return "type-5"
}

interface VariantColors {
  bg: string
  color: string
  border: string
  shadow: boolean
}

const VARIANT_COLORS: Record<ButtonVariant, VariantColors> = {
  pop: {
    bg: "var(--color-text-primary)",
    color: "var(--color-bg-primary)",
    border: "transparent",
    shadow: true,
  },
  primary: {
    bg: "var(--color-bg-tertiary)",
    color: "var(--color-text-primary)",
    border: "var(--color-bg-secondary)",
    shadow: true,
  },
  secondary: {
    bg: "var(--color-border-primary)",
    color: "var(--color-text-secondary)",
    border: "var(--color-bg-tertiary)",
    shadow: true,
  },
  tertiary: {
    bg: "transparent",
    color: "var(--color-text-primary)",
    border: "var(--color-text-primary)",
    shadow: false,
  },
  ghost: {
    bg: "transparent",
    color: "var(--color-text-primary)",
    border: "transparent",
    shadow: false,
  },
  "text-link": {
    bg: "transparent",
    color: "var(--color-text-primary)",
    border: "transparent",
    shadow: false,
  },
}

export function getBaseColors(variant: ButtonVariant): VariantColors {
  return VARIANT_COLORS[variant]
}

interface HoverColors {
  bg: string
  color: string
  border: string
}

const HOVER_OVERRIDES: Partial<Record<ButtonVariant, HoverColors>> = {
  tertiary: {
    bg: "var(--color-text-primary)",
    color: "var(--color-bg-primary)",
    border: "var(--color-text-primary)",
  },
  ghost: {
    bg: "var(--color-border-secondary)",
    color: "var(--color-text-primary)",
    border: "var(--color-border-primary)",
  },
}

export function getHoverColors(
  variant: ButtonVariant,
): HoverColors | undefined {
  return HOVER_OVERRIDES[variant]
}

export function validateButtonProps(
  variant: ButtonVariant,
  form: ButtonForm,
  label?: string,
  ariaLabel?: string,
  icon?: unknown,
): void {
  if (process.env.NODE_ENV !== "production") {
    if (form !== "icon-only" && !label) {
      console.warn(`[Button] label is required when form is "${form}".`)
    }

    if (form === "icon-only" && !ariaLabel) {
      console.warn(
        `[Button] ariaLabel is required when form is "icon-only" for accessibility.`,
      )
    }

    if (form === "icon-only" && !icon) {
      console.warn(`[Button] icon is required when form is "icon-only".`)
    }
  }
}
