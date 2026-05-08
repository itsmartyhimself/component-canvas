import type { CSSProperties } from "react"

export type StatusDotTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"

export type StatusDotVariant = "solid" | "hollow"

export interface StatusDotProps {
  tone: StatusDotTone
  variant?: StatusDotVariant
  size?: 8 | 10
  ariaLabel?: string
}

const TONE_TOKEN: Record<StatusDotTone, string> = {
  success: "var(--color-tag-success-ink)",
  warning: "var(--color-tag-warning-ink)",
  danger: "var(--color-tag-danger-ink)",
  info: "var(--color-tag-info-ink)",
  neutral: "var(--color-text-tertiary)",
}

export function StatusDot({
  tone,
  variant = "solid",
  size = 8,
  ariaLabel,
}: StatusDotProps) {
  const color = TONE_TOKEN[tone]
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    background: variant === "solid" ? color : "transparent",
    boxShadow: variant === "hollow" ? `inset 0 0 0 1px ${color}` : undefined,
  }
  return (
    <span
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      style={style}
    />
  )
}
