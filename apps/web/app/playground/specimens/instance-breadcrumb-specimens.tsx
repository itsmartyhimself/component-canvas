"use client"

import { useState, type CSSProperties } from "react"
import {
  InstanceBreadcrumb,
  MOCK_INSTANCE,
  type BranchSummary,
  type InstanceBreadcrumbData,
} from "@/components/live/instance-breadcrumb"
import { Specimen, SpecimenGroup, SIDEBAR_WIDTH_SPECIMEN } from "./_shared"

const frameStyle: CSSProperties = {
  width: SIDEBAR_WIDTH_SPECIMEN,
  padding: "var(--spacing-3) var(--spacing-3) 0 var(--spacing-3)",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  borderRadius: "var(--radius-2)",
}

function FramedBreadcrumb({
  data,
  collapsed,
}: {
  data: InstanceBreadcrumbData
  collapsed?: boolean
}) {
  const [active, setActive] = useState(data.branch)
  return (
    <div style={frameStyle}>
      <InstanceBreadcrumb
        data={{ ...data, branch: active }}
        collapsed={collapsed}
        onSwitchBranch={(id) => {
          const next = data.branches.find((b) => b.id === id)
          if (next) setActive({ id: next.id, name: next.name })
        }}
        onLoadOtherBranches={() => {
          // demo no-op
        }}
      />
    </div>
  )
}

const LONG_TRAIL_DATA: InstanceBreadcrumbData = {
  trail: [
    { kind: "workspace", label: "anthropic-engineering" },
    { kind: "repo", label: "monorepo-with-very-long-name" },
  ],
  branch: { id: "main", name: "feat/super-long-branch-name-that-should-fit" },
  branches: MOCK_INSTANCE.branches,
}

const TWO_ITEM_TRAIL_DATA: InstanceBreadcrumbData = {
  trail: [{ kind: "repo", label: "design-system" }],
  branch: { id: "main", name: "main" },
  branches: MOCK_INSTANCE.branches,
}

const EMPTY_BRANCHES_DATA: InstanceBreadcrumbData = {
  trail: [
    { kind: "workspace", label: "acme" },
    { kind: "repo", label: "fresh-repo" },
  ],
  branch: { id: "main", name: "main" },
  branches: [] as BranchSummary[],
}

export function InstanceBreadcrumbSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-11)",
      }}
    >
      <SpecimenGroup title="Default — workspace ▸ repo ▸ branch">
        <Specimen label="trail=2 items, click chip to open dropdown">
          <FramedBreadcrumb data={MOCK_INSTANCE} />
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Single trail item — repo ▸ branch">
        <Specimen label="trail=1 item (no workspace)">
          <FramedBreadcrumb data={TWO_ITEM_TRAIL_DATA} />
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Long names — ellipsis truncation">
        <Specimen label="long workspace + repo + branch — chip stays full size, trail truncates">
          <FramedBreadcrumb data={LONG_TRAIL_DATA} />
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Empty branches — fresh repo">
        <Specimen label="branches=[] → 'No branches yet' state in dropdown">
          <FramedBreadcrumb data={EMPTY_BRANCHES_DATA} />
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Sidebar collapsed — breadcrumb hides entirely">
        <Specimen label="collapsed=true → max-height 0 + opacity 0; team-switcher shifts up">
          <FramedBreadcrumb data={MOCK_INSTANCE} collapsed />
        </Specimen>
      </SpecimenGroup>
    </div>
  )
}
