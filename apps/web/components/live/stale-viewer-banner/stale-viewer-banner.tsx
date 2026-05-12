"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Close, Renew } from "@carbon/icons-react"
import { StatusDot } from "@/components/live/status-dot"

// TODO: ROADMAP §Dashboard — 30s timer mocks a Supabase Realtime event on
// last_synced_commit_sha change. Replace with the real subscription once instance
// channels are wired up.
const TRIGGER_AFTER_MS = 30_000

// Banner sits on a #FEFAF1 cream that has no dark-mode override, so colors are
// hardcoded (not tokens that flip) — dark text + dark refresh pill stay legible
// against the cream background in either theme.
const BANNER_TEXT = "#121111"
const BANNER_PILL_BG = "#121111"
const BANNER_PILL_FG = "#FFFFFF"

export function StaleViewerBanner() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const onDashboard = pathname === "/"

  useEffect(() => {
    if (dismissed || !onDashboard) return
    const t = window.setTimeout(() => setVisible(true), TRIGGER_AFTER_MS)
    return () => window.clearTimeout(t)
  }, [dismissed, onDashboard])

  if (!onDashboard) return null

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
  }

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          style={{
            position: "absolute",
            top: 60 + 16,
            left: 280,
            right: 280,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--spacing-4)",
            padding: "var(--spacing-4) var(--spacing-5)",
            borderRadius: "var(--radius-4)",
            background: "var(--color-tag-warning-wash)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-4)",
            }}
          >
            <StatusDot tone="success" variant="solid" size={8} />
            <span
              className="type-4"
              style={{ color: BANNER_TEXT, lineHeight: 1.2 }}
            >
              A new version of this branch is available
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-2)",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => {
                handleDismiss()
                window.location.reload()
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--spacing-2-5)",
                height: 44,
                paddingInline: "var(--spacing-5)",
                borderRadius: "var(--radius-4)",
                background: BANNER_PILL_BG,
                color: BANNER_PILL_FG,
                cursor: "pointer",
              }}
            >
              <Renew size={14} />
              <span className="type-4 font-medium" style={{ color: BANNER_PILL_FG }}>
                Refresh
              </span>
            </button>
            <button
              type="button"
              aria-label="Dismiss banner"
              onClick={handleDismiss}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: "var(--radius-4)",
                color: BANNER_TEXT,
                cursor: "pointer",
              }}
            >
              <Close size={16} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
