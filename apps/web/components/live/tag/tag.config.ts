export type TagSize = "xs" | "sm" | "md"

export type TagTone =
  | "ghost"
  | "neutral"
  | "pop"
  | "archive"
  | "danger"
  | "highlight"
  | "info"
  | "success"
  | "warning"

export const HEIGHT_MAP: Record<TagSize, number> = {
  xs: 20,
  sm: 24,
  md: 28,
}

export const RADIUS_MAP: Record<TagSize, string> = {
  xs: "var(--radius-2)",
  sm: "var(--radius-2-5)",
  md: "var(--radius-3)",
}

export const PADDING_INLINE_MAP: Record<TagSize, string> = {
  xs: "var(--spacing-3)",
  sm: "var(--spacing-3-5)",
  md: "var(--spacing-4)",
}

export const GAP = "var(--spacing-2)"

export const TYPE_CLASS = "type-3"

interface ToneColors {
  bg: string
  fg: string
}

export const TONE_COLORS: Record<TagTone, ToneColors> = {
  ghost: { bg: "transparent", fg: "var(--color-text-secondary)" },
  neutral: { bg: "var(--color-bg-hover-elevated)", fg: "var(--color-text-secondary)" },
  pop: { bg: "var(--color-text-primary)", fg: "var(--color-bg-primary)" },
  archive: { bg: "var(--color-tag-archive-wash)", fg: "var(--color-tag-archive-ink)" },
  danger: { bg: "var(--color-tag-danger-wash)", fg: "var(--color-tag-danger-ink)" },
  highlight: { bg: "var(--color-tag-highlight-wash)", fg: "var(--color-tag-highlight-ink)" },
  info: { bg: "var(--color-tag-info-wash)", fg: "var(--color-tag-info-ink)" },
  success: { bg: "var(--color-tag-success-wash)", fg: "var(--color-tag-success-ink)" },
  warning: { bg: "var(--color-tag-warning-wash)", fg: "var(--color-tag-warning-ink)" },
}
