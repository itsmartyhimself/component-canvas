import type { CSSProperties } from "react"
import { StatusDot, type StatusDotTone } from "@/components/live/status-dot"

export type StatusChipTone = "synced" | "syncing" | "failed" | "stale" | "info"

interface StatusChipProps {
  tone: StatusChipTone
  label: string
}

interface ToneConfig {
  dotTone: StatusDotTone
  dotVariant: "solid" | "hollow"
  background: string
  border: string
  color: string
}

const TONE_CONFIG: Record<StatusChipTone, ToneConfig> = {
  synced: {
    dotTone: "success",
    dotVariant: "solid",
    background: "var(--color-tag-success-wash)",
    border: "transparent",
    color: "var(--color-tag-success-ink)",
  },
  syncing: {
    dotTone: "neutral",
    dotVariant: "hollow",
    background: "var(--color-bg-elevated)",
    border: "var(--color-border-secondary)",
    color: "var(--color-text-secondary)",
  },
  failed: {
    dotTone: "danger",
    dotVariant: "solid",
    background: "var(--color-tag-danger-wash)",
    border: "transparent",
    color: "var(--color-tag-danger-ink)",
  },
  stale: {
    dotTone: "neutral",
    dotVariant: "hollow",
    background: "var(--color-bg-elevated)",
    border: "var(--color-border-secondary)",
    color: "var(--color-text-tertiary)",
  },
  info: {
    dotTone: "info",
    dotVariant: "solid",
    background: "var(--color-tag-info-wash)",
    border: "transparent",
    color: "var(--color-tag-info-ink)",
  },
}

export function StatusChip({ tone, label }: StatusChipProps) {
  const cfg = TONE_CONFIG[tone]
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--spacing-2-5)",
    height: 24,
    paddingInline: "var(--spacing-3-5)",
    borderRadius: "var(--radius-full)",
    background: cfg.background,
    border: `1px solid ${cfg.border}`,
    color: cfg.color,
  }
  return (
    <span className="font-mono font-medium type-2" style={style}>
      <StatusDot tone={cfg.dotTone} variant={cfg.dotVariant} size={8} />
      {label}
    </span>
  )
}
