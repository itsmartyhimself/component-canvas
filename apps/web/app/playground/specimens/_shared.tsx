import type { CSSProperties, ReactNode } from "react"

export interface SpecimenProps {
  label: string
  width?: number | string
  children: ReactNode
}

const specimenStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-3)",
}

const labelStyle: CSSProperties = {
  color: "var(--color-text-tertiary)",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
}

export function Specimen({ label, width, children }: SpecimenProps) {
  return (
    <div style={specimenStyle}>
      <p className="type-3" style={labelStyle}>
        {label}
      </p>
      <div style={{ width }}>{children}</div>
    </div>
  )
}

export interface SpecimenGroupProps {
  title: string
  children: ReactNode
}

export function SpecimenGroup({ title, children }: SpecimenGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-5)",
      }}
    >
      <h3 className="type-5" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-7)",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const SIDEBAR_WIDTH_SPECIMEN = 280
