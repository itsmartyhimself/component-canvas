import type { MouseEventHandler, ReactNode } from "react"

export type IconButtonSize = 20 | 24 | 32

export interface IconButtonDimension {
  size: number
  radius: string
  iconSize: number
}

export const ICON_BUTTON_DIMENSIONS: Record<IconButtonSize, IconButtonDimension> = {
  20: { size: 20, radius: "var(--radius-1-5)", iconSize: 14 },
  24: { size: 24, radius: "var(--radius-2)", iconSize: 14 },
  32: { size: 32, radius: "var(--radius-2)", iconSize: 16 },
}

export interface IconButtonProps {
  icon: ReactNode
  size?: IconButtonSize
  ariaLabel: string
  disabled?: boolean
  active?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  type?: "button" | "submit" | "reset"
  bordered?: boolean
}
