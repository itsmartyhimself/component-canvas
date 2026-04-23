"use client"

import { useCanvasView } from "./canvas-view-context"

const DOT_SPACING = 24
const DOT_RADIUS = 1.2

export function CanvasBackground() {
  const { view } = useCanvasView()
  const tile = DOT_SPACING * view.zoom
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, var(--color-canvas-dot) ${DOT_RADIUS}px, transparent ${DOT_RADIUS}px)`,
        backgroundSize: `${tile}px ${tile}px`,
        backgroundPosition: `${view.x}px ${view.y}px`,
      }}
    />
  )
}
