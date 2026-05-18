import type { CSSProperties, ReactNode } from "react"
import { Branch } from "@carbon/icons-react"

interface HeroCardProps {
  brand?: ReactNode
  title: string
  subtitle?: string
  children?: ReactNode
  legal?: ReactNode
  width?: number
  className?: string
}

// TODO: ROADMAP §Dashboard — HeroCard inline-hardcodes border-radius: 40 and a gradient
// of two system colors. Revisit if a new radius/gradient token is added.
const HERO_CARD_RADIUS = 40
const HERO_CARD_GRADIENT =
  "linear-gradient(180deg, var(--color-bg-primary) 50%, var(--color-bg-secondary) 100%)"

export function HeroCard({
  brand,
  title,
  subtitle,
  children,
  legal,
  width = 480,
  className,
}: HeroCardProps) {
  const style: CSSProperties = {
    width,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "var(--spacing-9)",
    padding: "var(--spacing-7)",
    borderRadius: HERO_CARD_RADIUS,
    background: HERO_CARD_GRADIENT,
    border: "1px solid var(--color-border-primary)",
  }

  return (
    <div className={className} style={style}>
      {brand ? (
        <div style={{ display: "flex", justifyContent: "center" }}>{brand}</div>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-3)",
          padding: "0 var(--spacing-7)",
          textAlign: "center",
        }}
      >
        <h1 className="type-8 font-medium" style={{ color: "var(--color-text-primary)" }}>
          {title}
        </h1>
        {subtitle ? (
          <p className="type-4" style={{ color: "var(--color-text-secondary)" }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {children ? <div>{children}</div> : null}
      {legal ? (
        <div
          className="type-2"
          style={{
            color: "var(--color-text-tertiary)",
            textAlign: "center",
            padding: "0 var(--spacing-7)",
          }}
        >
          {legal}
        </div>
      ) : null}
    </div>
  )
}

export function HeroCardIconTile({ icon }: { icon?: ReactNode }) {
  return (
    <div
      aria-hidden
      style={{
        width: 56,
        height: 56,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-3)",
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border-secondary)",
        color: "var(--color-text-secondary)",
      }}
    >
      {icon ?? <Branch size={24} />}
    </div>
  )
}
