export type InstanceTrailItemKind = "workspace" | "repo"

export interface InstanceTrailItem {
  kind: InstanceTrailItemKind
  label: string
  href?: string
}

export type BranchSyncStatus = "synced" | "syncing" | "failed" | "stale"

export interface BranchSummary {
  id: string
  name: string
  pinned: boolean
  status: BranchSyncStatus
  lastSyncedAt: Date | null
}

export interface InstanceBreadcrumbData {
  trail: InstanceTrailItem[]
  branch: { id: string; name: string }
  branches: BranchSummary[]
}
