"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/live/button"
import { GithubMark } from "@/components/live/auth-button/github-mark"
import { ConnectRepoCrumb } from "@/components/live/connect-repo-crumb"
import { ConnectRepoHeader } from "@/components/live/connect-repo-header"
import { StepSelectRepo } from "./step-select-repo"
import { StepAssignWorkspace } from "./step-assign-workspace"
import { DEMO_AVAILABLE_REPOS, ACME_WORKSPACE } from "@/lib/dashboard/demo"
import { useToast } from "@/components/live/toast"

export function ConnectRepoForm() {
  const router = useRouter()
  const { showToast } = useToast()
  const firstSelectable =
    DEMO_AVAILABLE_REPOS.find((r) => !r.alreadyConnected)?.id ?? null
  const [repoId, setRepoId] = useState<string | null>(firstSelectable)
  const [workspaceId, setWorkspaceId] = useState<string>(ACME_WORKSPACE.id)

  const canSubmit = !!repoId && !!workspaceId

  const handleSubmit = () => {
    if (!canSubmit) return
    // TODO: ROADMAP §Dashboard — wire to /apps/api install-callback + create-repo-connection.
    showToast({
      tone: "success",
      title: "Initial sync started",
    })
    router.push("/")
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-7)",
      }}
    >
      <ConnectRepoCrumb />
      <ConnectRepoHeader />
      <StepSelectRepo value={repoId} onChange={setRepoId} />
      <StepAssignWorkspace value={workspaceId} onChange={setWorkspaceId} />
      <ConnectRepoFooter canSubmit={canSubmit} onSubmit={handleSubmit} />
    </div>
  )
}

function ConnectRepoFooter({
  canSubmit,
  onSubmit,
}: {
  canSubmit: boolean
  onSubmit: () => void
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--spacing-5)",
      }}
    >
      <p
        className="type-3"
        style={{
          margin: 0,
          color: "var(--color-text-tertiary)",
          lineHeight: 1.4,
        }}
      >
        Organization repos require admin install on GitHub.
      </p>
      <div style={{ display: "flex", gap: "var(--spacing-3)" }}>
        <Button
          variant="ghost"
          size="small"
          form="label"
          label="Cancel"
          href="/"
          borderColor="var(--color-border-secondary)"
        />
        <Button
          variant="pop"
          size="small"
          form="label"
          label="Connect repo"
          icon={<GithubMark size={14} />}
          disabled={!canSubmit}
          onClick={onSubmit}
        />
      </div>
    </div>
  )
}
