"use client"

import { useEffect, useState } from "react"
import { DEMO_REPOS } from "@/lib/dashboard/demo"
import type { RepoConnection } from "@/lib/dashboard/types"
import {
  SEARCH_HOLD_MS,
  SEARCH_MAX_ROWS,
} from "@/components/live/search-modal/search-modal.config"

export type RepoSearchState = "idle" | "pending" | "resolved"

interface RepoSearchResult {
  state: RepoSearchState
  data: RepoConnection[]
}

// TODO: ROADMAP §Dashboard — DEMO returns the full repo set for any non-empty
// query (intentional, lets the demo modal render real components without
// requiring specific trigger terms). Replace with Supabase server-side fuzzy
// search once GitHub App + branch enumeration land. At that point: include
// branch hits and bring back fuzzy matching.
export function useRepoSearch(query: string): RepoSearchResult {
  const [state, setState] = useState<RepoSearchState>("idle")
  const [data, setData] = useState<RepoConnection[]>([])

  useEffect(() => {
    if (query.trim().length === 0) {
      setState("idle")
      setData([])
      return
    }
    setState("pending")
    const timer = setTimeout(() => {
      setData(DEMO_REPOS.slice(0, SEARCH_MAX_ROWS))
      setState("resolved")
    }, SEARCH_HOLD_MS)
    return () => clearTimeout(timer)
  }, [query])

  return { state, data }
}
