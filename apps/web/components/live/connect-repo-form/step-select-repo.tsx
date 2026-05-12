"use client"

import { useMemo } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { ConnectRepoRow } from "@/components/live/connect-repo-row"
import { DEMO_AVAILABLE_REPOS } from "@/lib/dashboard/demo"
import { ROW_SPRING } from "@/components/live/row/row.config"

interface StepSelectRepoProps {
  value: string | null
  onChange: (id: string) => void
}

export function StepSelectRepo({ value, onChange }: StepSelectRepoProps) {
  const sortedRepos = useMemo(
    () =>
      [...DEMO_AVAILABLE_REPOS].sort((a, b) => {
        if (a.alreadyConnected === b.alreadyConnected) return 0
        return a.alreadyConnected ? -1 : 1
      }),
    [],
  )

  return (
    <LayoutGroup id="connect-repo-rows">
      <div
        role="radiogroup"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-1)",
          padding: "var(--spacing-1)",
          background: "var(--color-bg-tertiary)",
          borderRadius: "var(--radius-4-5)",
        }}
      >
        {sortedRepos.map((repo) => {
          const selected = repo.id === value
          return (
            <ConnectRepoRow
              key={repo.id}
              label={repo.orgRepo}
              selected={selected}
              disabled={repo.alreadyConnected}
              onSelect={() => onChange(repo.id)}
              activeFill={
                selected ? (
                  <motion.div
                    layoutId="connect-repo-active-pill"
                    initial={false}
                    transition={ROW_SPRING}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "var(--radius-4)",
                      background: "var(--color-bg-hover-elevated)",
                      zIndex: 1,
                    }}
                  />
                ) : null
              }
              rightContent={
                repo.alreadyConnected ? (
                  <span
                    className="type-3"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    already connected
                  </span>
                ) : null
              }
            />
          )
        })}
      </div>
    </LayoutGroup>
  )
}
