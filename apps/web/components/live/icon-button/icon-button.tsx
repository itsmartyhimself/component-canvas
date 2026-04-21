"use client"

import { forwardRef, useState, type CSSProperties, type Ref } from "react"
import { cn } from "@/lib/utils"
import {
  ICON_BUTTON_DIMENSIONS,
  type IconButtonProps,
} from "./icon-button.config"

function IconButtonBase(
  props: IconButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  const {
    icon,
    size = 24,
    ariaLabel,
    disabled = false,
    active = false,
    onClick,
    className,
    type = "button",
    bordered = true,
  } = props

  const dims = ICON_BUTTON_DIMENSIONS[size]
  const [hovered, setHovered] = useState(false)

  const iconColor = disabled
    ? "var(--color-text-tertiary)"
    : active || hovered
      ? "var(--color-text-primary)"
      : "var(--color-text-secondary)"

  const background = active
    ? "var(--color-bg-secondary)"
    : "var(--color-bg-primary)"

  const rootStyle: CSSProperties = {
    width: dims.size,
    height: dims.size,
    borderRadius: dims.radius,
    border: bordered ? "1px solid var(--color-border-primary)" : "1px solid transparent",
    background,
    color: iconColor,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "background-color 120ms ease, color 120ms ease, border-color 120ms ease",
    flexShrink: 0,
  }

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        onClick?.()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      style={rootStyle}
    >
      {icon}
    </button>
  )
}

export const IconButton = forwardRef(IconButtonBase)
IconButton.displayName = "IconButton"
