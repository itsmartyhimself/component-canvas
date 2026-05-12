import { StatusDot, type StatusDotTone } from "@/components/live/status-dot"
import { Tag, type TagTone } from "@/components/live/tag"

export type StatusChipTone = "synced" | "syncing" | "failed" | "stale" | "info"

interface StatusChipProps {
  tone: StatusChipTone
  label: string
}

interface ToneConfig {
  dotTone: StatusDotTone
  dotVariant: "solid" | "hollow"
  tagTone: TagTone
}

const TONE_CONFIG: Record<StatusChipTone, ToneConfig> = {
  synced: { dotTone: "success", dotVariant: "solid", tagTone: "success" },
  syncing: { dotTone: "neutral", dotVariant: "hollow", tagTone: "neutral" },
  failed: { dotTone: "danger", dotVariant: "solid", tagTone: "danger" },
  stale: { dotTone: "neutral", dotVariant: "hollow", tagTone: "neutral" },
  info: { dotTone: "info", dotVariant: "solid", tagTone: "info" },
}

export function StatusChip({ tone, label }: StatusChipProps) {
  const cfg = TONE_CONFIG[tone]
  return (
    <Tag
      size="sm"
      tone={cfg.tagTone}
      leading={<StatusDot tone={cfg.dotTone} variant={cfg.dotVariant} size={8} />}
    >
      {label}
    </Tag>
  )
}
