import { Suspense } from "react"
import { CanvasStage } from "./canvas-stage"

export function Canvas() {
  return (
    <section
      className="relative flex-1 overflow-hidden"
      style={{
        borderRadius: "var(--radius-6)",
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border-primary)",
      }}
    >
      <Suspense fallback={null}>
        <CanvasStage />
      </Suspense>
      <div className="absolute inset-0 pointer-events-none" />
    </section>
  )
}
