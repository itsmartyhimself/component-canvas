"use client"

import { useEffect } from "react"
import { useToast } from "@/components/live/toast"

// TODO: ROADMAP §Stale viewer detection — 30s setTimeout mocks the Supabase
// Realtime event on last_synced_commit_sha change. Replace with the real
// channel subscription once instance channels are wired up.
const TRIGGER_AFTER_MS = 30_000

export function StaleViewerTrigger() {
  const { showToast } = useToast()

  useEffect(() => {
    const t = window.setTimeout(() => {
      showToast({
        tone: "warning",
        title: "This branch has an update",
        action: {
          label: "Refresh",
          onClick: () => window.location.reload(),
        },
        duration: Infinity,
      })
    }, TRIGGER_AFTER_MS)
    return () => window.clearTimeout(t)
  }, [showToast])

  return null
}
