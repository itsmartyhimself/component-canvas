import { Add } from "@carbon/icons-react"
import { Button } from "@/components/live/button"
import { HeroCard, HeroCardIconTile } from "@/components/live/hero-card"

export function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBlock: "var(--spacing-14)",
      }}
    >
      <HeroCard
        brand={<HeroCardIconTile />}
        title="No repos connected yet"
        subtitle="Connect a repo to start exploring its components on the canvas."
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-3)",
            padding: "0 var(--spacing-7)",
            alignItems: "stretch",
          }}
        >
          <Button
            variant="pop"
            size="medium"
            form="label"
            label="Connect a repo"
            icon={<Add size={16} />}
            href="/connect"
            fill
          />
          {/* TODO: re-enable "Try with sample" secondary CTA once usemount.dev/sample-components repo exists — migration-plan Step 1.5 / dashboard-build-plan Open Decision #2 */}
        </div>
      </HeroCard>
    </div>
  )
}
