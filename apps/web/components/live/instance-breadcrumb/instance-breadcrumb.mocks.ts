// DEMO-ONLY — replace with real data fetched from URL params + registry.
// See apps/web/ROADMAP.md → "Sidebar / InstanceBreadcrumb wiring".

import type { BranchSummary, InstanceBreadcrumbData } from "./types"

const NOW = Date.now()
const minutesAgo = (n: number) => new Date(NOW - n * 60_000)
const hoursAgo = (n: number) => new Date(NOW - n * 60 * 60_000)
const daysAgo = (n: number) => new Date(NOW - n * 24 * 60 * 60_000)

export const MOCK_BRANCHES: BranchSummary[] = [
  {
    id: "main",
    name: "main",
    pinned: true,
    status: "synced",
    lastSyncedAt: minutesAgo(12),
  },
  {
    id: "feat-cart-redesign",
    name: "feat/cart-redesign",
    pinned: true,
    status: "synced",
    lastSyncedAt: minutesAgo(41),
  },
  {
    id: "release-2026-q2",
    name: "release/2026-Q2",
    pinned: true,
    status: "syncing",
    lastSyncedAt: hoursAgo(2),
  },
  {
    id: "fix-typography-scale",
    name: "fix/typography-scale",
    pinned: true,
    status: "stale",
    lastSyncedAt: daysAgo(3),
  },
  {
    id: "experiment-iframe-cache",
    name: "experiment/iframe-cache",
    pinned: true,
    status: "failed",
    lastSyncedAt: hoursAgo(5),
  },
]

export const MOCK_INSTANCE: InstanceBreadcrumbData = {
  trail: [
    { kind: "workspace", label: "acme" },
    { kind: "repo", label: "design-system" },
  ],
  branch: { id: "main", name: "main" },
  branches: MOCK_BRANCHES,
}
