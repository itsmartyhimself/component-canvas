"use client"

// TODO(ROADMAP: Component rendering / import pipeline → Sandboxed iframe host):
// today this renders a mocked preview surface with deterministic dimensions per
// component id. Replace with the real iframe preview once the import pipeline
// ships; bbox should come from the iframe's reported size, not a local table.

import { useLayoutEffect } from "react"
import type { LeafRecord } from "@/lib/registry/types"
import { useCanvasView } from "./canvas-view-context"

type StageContentProps = {
  selected: LeafRecord | null
}

// Seeded mock sizes so fit-to-content behaves visibly different per component
// kind. Small buttons, medium sections, large flows. Component-id-keyed so
// flipping between selections animates to distinct targets.
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

export function StageContent({ selected }: StageContentProps) {
  const { setContentBbox } = useCanvasView()
  const bbox = selected ? (MOCK_SIZES[selected.id] ?? DEFAULT_SIZE) : EMPTY_SIZE

  useLayoutEffect(() => {
    setContentBbox(bbox)
  }, [bbox, setContentBbox])

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: 0,
        top: 0,
        width: bbox.width,
        height: bbox.height,
        transform: "translate(-50%, -50%)",
        borderRadius: "var(--radius-4)",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border-primary)",
        boxShadow: "var(--shadow-small)",
      }}
    >
      {selected ? (
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
      ) : (
        <p
          className="type-4 text-trim"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Select a component to preview
        </p>
      )}
    </div>
  )
}
