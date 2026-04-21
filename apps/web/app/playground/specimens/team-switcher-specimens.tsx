"use client"

import { TeamSwitcher } from "@/components/live/team-switcher"
import { DEMO_REGISTRY, DEMO_TEAMS_MULTI } from "@/lib/registry/data"
import { Specimen, SpecimenGroup, SIDEBAR_WIDTH_SPECIMEN } from "./_shared"

export function TeamSwitcherSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-11)",
      }}
    >
      <SpecimenGroup title="Single team (chevron hidden)">
        <Specimen
          label={`teams=[Acme] activeTeamId="acme"`}
          width={SIDEBAR_WIDTH_SPECIMEN}
        >
          <TeamSwitcher
            teams={[DEMO_REGISTRY.team]}
            activeTeamId={DEMO_REGISTRY.team.id}
          />
        </Specimen>
      </SpecimenGroup>
      <SpecimenGroup title="Multi-team (chevron visible, click for stub popover)">
        <Specimen
          label={`teams=[Acme, Northwind] activeTeamId="acme"`}
          width={SIDEBAR_WIDTH_SPECIMEN}
        >
          <TeamSwitcher
            teams={DEMO_TEAMS_MULTI}
            activeTeamId={DEMO_REGISTRY.team.id}
          />
        </Specimen>
      </SpecimenGroup>
    </div>
  )
}
