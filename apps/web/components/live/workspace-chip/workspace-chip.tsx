"use client"

import type { Workspace } from "@/lib/dashboard/types"
import { Tag } from "@/components/live/tag"

interface WorkspaceChipProps {
  workspace: Workspace
}

export function WorkspaceChip({ workspace }: WorkspaceChipProps) {
  return (
    <Tag size="md" tone="neutral">
      {workspace.name}
    </Tag>
  )
}
