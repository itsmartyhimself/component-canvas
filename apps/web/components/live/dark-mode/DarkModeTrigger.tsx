"use client"

import type { CSSProperties } from "react"
import { useDarkMode } from "./DarkModeProvider"

const buttonStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "var(--radius-full)",
  background: "var(--gradient-dusk)",
  border: 0,
  padding: 0,
  cursor: "pointer",
  flexShrink: 0,
}

export function DarkModeTrigger() {
  const { isDark, toggle } = useDarkMode()
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <button type="button" aria-label={label} style={buttonStyle} onClick={toggle} />
  )
}
