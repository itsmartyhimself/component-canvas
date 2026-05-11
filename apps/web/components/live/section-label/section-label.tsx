import type { CSSProperties, ReactNode } from "react"

interface SectionLabelProps {
  label: string
  trailing?: ReactNode
  className?: string
  style?: CSSProperties
}

export function SectionLabel({ label, trailing, className, style }: SectionLabelProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--spacing-3)",
        ...style,
      }}
    >
      <span
        className="type-3 font-medium"
        style={{
          color: "var(--color-text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      {trailing ? (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)" }}>
          {trailing}
        </div>
      ) : null}
    </div>
  )
}
