"use client"

import { useMemo } from "react"
import { DEMO_RECENT_REPOS, DEMO_REPOS } from "@/lib/dashboard/demo"
import type { RepoConnection } from "@/lib/dashboard/types"

// TODO: ROADMAP §Dashboard — replace with Supabase fetch keyed off the signed-in
// user's workspace memberships. Today reads DEMO_RECENT_REPOS.
export function useRecentRepos(limit: number): RepoConnection[] {
  return useMemo(() => {
    const sorted = [...DEMO_RECENT_REPOS].sort(
      (a, b) => b.viewedAtMs - a.viewedAtMs,
    )
    const repos: RepoConnection[] = []
    for (const entry of sorted) {
      const repo = DEMO_REPOS.find((r) => r.id === entry.repoId)
      if (repo) repos.push(repo)
      if (repos.length >= limit) break
    }
    return repos
  }, [limit])
}
