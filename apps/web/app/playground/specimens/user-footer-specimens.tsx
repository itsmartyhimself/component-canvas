"use client"

import { UserFooter } from "@/components/live/user-footer"
import { Specimen, SpecimenGroup, SIDEBAR_WIDTH_SPECIMEN } from "./_shared"

export function UserFooterSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-11)",
      }}
    >
      <SpecimenGroup title="Initial fallback">
        <Specimen
          label={`user.avatarUrl unset → initial from name`}
          width={SIDEBAR_WIDTH_SPECIMEN}
        >
          <UserFooter
            user={{
              name: "Martin Heneby",
              email: "martin@component-canvas.dev",
            }}
          />
        </Specimen>
      </SpecimenGroup>
      <SpecimenGroup title="With stub avatar image">
        <Specimen
          label={`user.avatarUrl="https://i.pravatar.cc/96?img=12"`}
          width={SIDEBAR_WIDTH_SPECIMEN}
        >
          <UserFooter
            user={{
              name: "Ellie Chen",
              email: "ellie@component-canvas.dev",
              avatarUrl: "https://i.pravatar.cc/96?img=12",
            }}
          />
        </Specimen>
      </SpecimenGroup>
    </div>
  )
}
