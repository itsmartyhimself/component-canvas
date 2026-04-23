"use client"

// TODO(ROADMAP: Component rendering / import pipeline → Sandboxed iframe host):
// manifest-backed components render inline in the host bundle today. The
// sandboxed iframe pipeline will eventually replace this; bbox already comes
// from a real ResizeObserver for manifest-backed leaves, so the swap is local.

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react"
import type { LeafRecord } from "@/lib/registry/types"
import { useCanvasView } from "./canvas-view-context"
import { useCanvasControls } from "@/components/live/canvas-controls"

type StageContentProps = {
  selected: LeafRecord | null
}

// Mock sizes used for leaves without a manifest. Manifest-backed components
// measure themselves via ResizeObserver below.
const MOCK_SIZES: Record<string, { width: number; height: number }> = {
  "cmp-button": { width: 160, height: 48 },
  "cmp-input": { width: 280, height: 48 },
  "cmp-checkbox": { width: 200, height: 24 },
  "cmp-toggle": { width: 72, height: 32 },
  "cmp-select": { width: 280, height: 48 },
  "cmp-slider": { width: 320, height: 32 },
  "cmp-nav-bar": { width: 1200, height: 64 },
  "cmp-breadcrumbs": { width: 480, height: 28 },
  "cmp-pagination": { width: 360, height: 40 },
  "cmp-tabs": { width: 520, height: 48 },
  "cmp-stepper": { width: 640, height: 64 },
  "cmp-toast": { width: 360, height: 72 },
  "cmp-dialog": { width: 480, height: 320 },
  "cmp-banner": { width: 960, height: 56 },
  "cmp-badge": { width: 80, height: 24 },
  "pg-hero": { width: 1440, height: 720 },
  "pg-feature-grid": { width: 1200, height: 680 },
  "pg-testimonials": { width: 1200, height: 520 },
  "pg-pricing": { width: 1200, height: 720 },
  "pg-cta-footer": { width: 1200, height: 320 },
  "pg-stats-row": { width: 1200, height: 140 },
  "pg-activity-feed": { width: 560, height: 720 },
  "pg-usage-chart": { width: 720, height: 360 },
  "pg-project-card": { width: 360, height: 240 },
  "pg-filter-bar": { width: 960, height: 56 },
  "pg-empty-state": { width: 560, height: 320 },
  "pg-notifications": { width: 420, height: 560 },
  "pg-cart-summary": { width: 480, height: 480 },
  "pg-address-form": { width: 560, height: 640 },
  "pg-payment-selector": { width: 560, height: 280 },
  "pg-order-confirmation": { width: 640, height: 400 },
}

const DEFAULT_SIZE = { width: 520, height: 320 }
const EMPTY_SIZE = { width: 520, height: 260 }

const centerAnchorStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  transform: "translate(-50%, -50%)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
}

const mockCardStyle = (
  width: number,
  height: number,
): CSSProperties => ({
  ...centerAnchorStyle,
  width,
  height,
  borderRadius: "var(--radius-4)",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-small)",
})

export function StageContent({ selected }: StageContentProps) {
  const { setContentBbox, updateContentBboxBounds } = useCanvasView()
  const { manifest, props } = useCanvasControls()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const fittedForIdRef = useRef<string | null>(null)

  const hasManifest = !!manifest

  // Mock path: deterministic bbox from the table; refit on selection change.
  useLayoutEffect(() => {
    if (hasManifest) return
    const bbox = selected
      ? (MOCK_SIZES[selected.id] ?? DEFAULT_SIZE)
      : EMPTY_SIZE
    setContentBbox(bbox)
  }, [selected, hasManifest, setContentBbox])

  // Manifest path: first measurement for a given selection refits the canvas;
  // later measurements (driven by prop tweaks) update bounds silently so the
  // user's manual zoom/pan isn't snapped back to fit on every prop change.
  useEffect(() => {
    if (!hasManifest) return
    const el = wrapperRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const id = selected?.id ?? null
    fittedForIdRef.current = null
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect
      if (rect.width === 0 && rect.height === 0) return
      const bbox = { width: rect.width, height: rect.height }
      if (fittedForIdRef.current !== id) {
        fittedForIdRef.current = id
        setContentBbox(bbox)
      } else {
        updateContentBboxBounds(bbox)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [hasManifest, selected, setContentBbox, updateContentBboxBounds])

  if (hasManifest && manifest) {
    return (
      <div style={centerAnchorStyle}>
        <div
          ref={wrapperRef}
          style={{ width: "fit-content", height: "fit-content" }}
        >
          {manifest.render(props)}
        </div>
      </div>
    )
  }

  if (!selected) {
    return (
      <div style={mockCardStyle(EMPTY_SIZE.width, EMPTY_SIZE.height)}>
        <p
          className="type-4 text-trim"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Select a component to preview
        </p>
      </div>
    )
  }

  const bbox = MOCK_SIZES[selected.id] ?? DEFAULT_SIZE
  return (
    <div style={mockCardStyle(bbox.width, bbox.height)}>
      <div
        className="flex flex-col items-center"
        style={{ gap: "var(--spacing-3)" }}
      >
        <p
          className="type-5 text-trim"
          style={{ color: "var(--color-text-primary)" }}
        >
          {selected.name}
        </p>
        <p
          className="type-3 text-trim"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {selected.id}
        </p>
      </div>
    </div>
  )
}
