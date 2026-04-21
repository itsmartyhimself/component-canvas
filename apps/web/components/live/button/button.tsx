"use client"

import {
  useState,
  type AriaAttributes,
  type CSSProperties,
  type ReactNode,
} from "react"
import { motion } from "framer-motion"
import { Button as ShadcnButton } from "@/components/imports/shadcn/button"
import { cn } from "@/lib/utils"

import {
  HEIGHT_MAP,
  TEXT_LINK_HEIGHT,
  RADIUS_MAP,
  ICON_SIZE,
  PADDING_MAP,
  TEXT_LINK_PADDING,
  LABEL_GAP,
  BUTTON_SHADOW,
  getTypeClass,
  getBaseColors,
  getHoverColors,
  validateButtonProps,
  type ButtonProps,
} from "./button.config"

type DataAttributes = {
  [K in `data-${string}`]?: string | number | boolean
}

type ButtonComponentProps = ButtonProps & AriaAttributes & DataAttributes

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
}

export function Button({
  label,
  size = "small",
  variant = "primary",
  form = "label",
  icon,
  fill = false,
  loading = false,
  disabled = false,
  onClick,
  href,
  type = "button",
  ariaLabel,
  className,
  ...rest
}: ButtonComponentProps) {
  validateButtonProps(variant, form, label, ariaLabel, icon)

  const [isHovered, setIsHovered] = useState(false)

  const isTextLink = variant === "text-link"
  const isDisabled = disabled || loading
  const isIconOnly = form === "icon-only"

  const baseColors = getBaseColors(variant)
  const hoverColors = getHoverColors(variant)
  const typeClass = getTypeClass(size, variant)
  const height = isTextLink ? TEXT_LINK_HEIGHT : HEIGHT_MAP[size]
  const radius = isTextLink ? "0" : RADIUS_MAP[size]
  const padding = isTextLink ? TEXT_LINK_PADDING : PADDING_MAP[size][form]

  const resolvedBg =
    !isDisabled && isHovered && hoverColors ? hoverColors.bg : baseColors.bg
  const resolvedColor =
    !isDisabled && isHovered && hoverColors
      ? hoverColors.color
      : baseColors.color
  const resolvedBorder =
    !isDisabled && isHovered && hoverColors
      ? hoverColors.border
      : baseColors.border

  const rootStyle: CSSProperties = {
    height,
    borderRadius: radius,
    padding,
    gap: isIconOnly ? 0 : LABEL_GAP,
    backgroundColor: resolvedBg,
    color: resolvedColor,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: resolvedBorder,
    boxShadow: baseColors.shadow ? BUTTON_SHADOW : "none",
    transition:
      "background-color 120ms ease, color 120ms ease, border-color 120ms ease",
    textDecoration: isTextLink && isHovered ? "underline" : "none",
    textUnderlineOffset: isTextLink ? "4px" : undefined,
    opacity: isDisabled ? 0.4 : 1,
    cursor: isDisabled ? "not-allowed" : "pointer",
    width: fill ? "100%" : undefined,
  }

  const iconElement: ReactNode = icon ? (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: ICON_SIZE,
        height: ICON_SIZE,
        flexShrink: 0,
      }}
    >
      {icon}
    </span>
  ) : null

  const inner = isIconOnly ? (
    iconElement
  ) : (
    <>
      {iconElement}
      {label && <span className={typeClass}>{label}</span>}
    </>
  )

  const buttonElement = (
    <ShadcnButton
      variant={null}
      size={null}
      asChild={!!href}
      className={cn(
        "translate-y-0 active:translate-y-0",
        "focus-visible:ring-0 focus-visible:border-transparent",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-[initial]",
        className,
      )}
      style={rootStyle}
      disabled={isDisabled}
      type={href ? undefined : type}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {href ? <a href={href}>{inner}</a> : inner}
    </ShadcnButton>
  )

  if (isTextLink || isDisabled) return buttonElement

  return (
    <motion.div
      style={{
        display: "inline-flex",
        willChange: "transform",
        ...(fill && { width: "100%" }),
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
    >
      {buttonElement}
    </motion.div>
  )
}
