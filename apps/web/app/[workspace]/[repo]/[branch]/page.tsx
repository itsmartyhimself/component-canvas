import { AppShell } from "@/components/live/app-shell"

// TODO: ROADMAP §Sidebar — InstanceBreadcrumb wiring. Route params are now threaded
// through to AppShell as `instance`; live registry fetch keyed off them is deferred
// to migration-plan Step 3 (AppShell still renders the demo registry until then).
export default async function InstancePage({
  params,
}: {
  params: Promise<{ workspace: string; repo: string; branch: string }>
}) {
  const { workspace, repo, branch } = await params
  if (process.env.NODE_ENV !== "production")
    console.debug("[InstancePage] params", { workspace, repo, branch })
  return <AppShell instance={{ workspace, repo, branch }} />
}
