import type { CSSProperties } from "react"

const style: CSSProperties = {
  height: 1,
  background: "var(--color-border-primary)",
  margin: "var(--spacing-3) var(--spacing-3)",
}

export function SidebarDivider() {
  return <div style={style} aria-hidden />
}
