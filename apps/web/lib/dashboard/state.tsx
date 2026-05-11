"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  DEMO_RECENT_REPOS,
  DEMO_REPOS,
  DEMO_WORKSPACES,
} from "./demo"
import type {
  FilterKey,
  RecentRepo,
  RepoConnection,
  SortKey,
  Workspace,
} from "./types"

interface DashboardState {
  workspaces: Workspace[]
  repos: RepoConnection[]
  recentRepos: RecentRepo[]
  // Single-row expansion: only one RepoRow can be open at a time. Clicking a
  // different repo closes the previously-open one.
  expandedRepoId: string | null
  expandedExpanderIds: Set<string>
  filter: FilterKey
  sort: SortKey
  toggleExpanded: (id: string) => void
  toggleExpander: (id: string) => void
  setFilter: (filter: FilterKey) => void
  setSort: (sort: SortKey) => void
  filteredRepos: RepoConnection[]
}

const DashboardStateContext = createContext<DashboardState | null>(null)

export function DashboardStateProvider({
  children,
  initiallyExpandedRepoId = null,
}: {
  children: ReactNode
  initiallyExpandedRepoId?: string | null
}) {
  const [expandedRepoId, setExpandedRepoId] = useState<string | null>(
    initiallyExpandedRepoId,
  )
  const [expandedExpanderIds, setExpandedExpanders] = useState<Set<string>>(
    () => new Set(),
  )
  const [filter, setFilter] = useState<FilterKey>("all")
  const [sort, setSort] = useState<SortKey>("lastSync")

  const toggleExpanded = (id: string) => {
    setExpandedRepoId((prev) => (prev === id ? null : id))
  }

  const toggleExpander = (id: string) => {
    setExpandedExpanders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredRepos = useMemo(() => {
    let list = DEMO_REPOS
    if (filter === "personal") {
      list = list.filter((r) => r.workspaceId === "ws-personal")
    } else if (filter !== "all") {
      list = list.filter((r) => r.workspaceId === filter)
    }
    const sorted = [...list].sort((a, b) => {
      if (sort === "name") return a.orgRepo.localeCompare(b.orgRepo)
      return b.lastSyncedAtMs - a.lastSyncedAtMs
    })
    return sorted
  }, [filter, sort])

  const value: DashboardState = {
    workspaces: DEMO_WORKSPACES,
    repos: DEMO_REPOS,
    recentRepos: DEMO_RECENT_REPOS,
    expandedRepoId,
    expandedExpanderIds,
    filter,
    sort,
    toggleExpanded,
    toggleExpander,
    setFilter,
    setSort,
    filteredRepos,
  }

  return (
    <DashboardStateContext.Provider value={value}>
      {children}
    </DashboardStateContext.Provider>
  )
}

export function useDashboardState(): DashboardState {
  const ctx = useContext(DashboardStateContext)
  if (!ctx) {
    throw new Error("useDashboardState must be used inside <DashboardStateProvider>")
  }
  return ctx
}
