"use client"

import { ConnectRepoRow } from "@/components/live/connect-repo-row"
import { DEMO_AVAILABLE_REPOS } from "@/lib/dashboard/demo"

interface StepSelectRepoProps {
  value: string | null
  onChange: (id: string) => void
}

export function StepSelectRepo({ value, onChange }: StepSelectRepoProps) {
  return (
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
      {DEMO_AVAILABLE_REPOS.map((repo) => {
        const selected = repo.id === value
        return (
          <ConnectRepoRow
            key={repo.id}
            label={repo.orgRepo}
            selected={selected}
            disabled={repo.alreadyConnected}
            onSelect={() => onChange(repo.id)}
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
  )
}
