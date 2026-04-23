"use client"

// Three-layer canvas:
//   Viewport  — clips, captures input, sets the visible frame.
//   Stage     — transform target (pan + zoom). Hosts the rendered component.
//   Overlays  — screen-space chrome (zoom controls, control panels).
// Dots live on Viewport so they stay at constant visual size while panning/
// zooming. Stage content scales; overlays don't.

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CanvasStage } from "./canvas-stage"
import { CanvasBackground } from "./canvas-background"
import { CanvasOverlays } from "./canvas-overlays"
import { useCanvasView } from "./canvas-view-context"
import { useCanvasInput } from "./use-canvas-input"
import {
  CanvasControls,
  CanvasControlsProvider,
} from "@/components/live/canvas-controls"

function CanvasScene() {
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("component")
  return (
    <CanvasControlsProvider selectedId={selectedId}>
      <CanvasStage selectedId={selectedId} />
      <CanvasControls />
    </CanvasControlsProvider>
  )
}

export function Canvas() {
  const { viewportRef } = useCanvasView()
  useCanvasInput()

  return (
    <section
      ref={viewportRef}
      className="relative flex-1 overflow-hidden"
      style={{
        borderRadius: "var(--radius-6)",
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border-primary)",
        touchAction: "none",
        overscrollBehavior: "contain",
      }}
    >
      <CanvasBackground />
      <Suspense fallback={null}>
        <CanvasScene />
      </Suspense>
      <CanvasOverlays />
    </section>
  )
}
