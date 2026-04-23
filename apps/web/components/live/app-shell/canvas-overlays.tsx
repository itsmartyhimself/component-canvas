"use client"

import type { CSSProperties } from "react"
import { ZoomFit, ZoomIn, ZoomOut } from "@carbon/icons-react"
import { IconButton } from "@/components/live/icon-button"
import { useCanvasView } from "./canvas-view-context"

// TODO(ROADMAP: Canvas → "overlay-vs-stage controls"): future variant toolbar
// and properties panel placement is deliberately unresolved. This overlay only
// owns zoom controls for now; revisit when the first variant toolbar ships.

const ZOOM_STEP = 1.2

const pillStyle: CSSProperties = {
  position: "absolute",
  bottom: "var(--spacing-5)",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-1)",
  padding: "var(--spacing-1)",
  borderRadius: "var(--radius-3)",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-small)",
  pointerEvents: "auto",
}

const zoomLabelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 52,
  height: 24,
  padding: "0 var(--spacing-2)",
  borderRadius: "var(--radius-1-5)",
  color: "var(--color-text-secondary)",
  cursor: "pointer",
}

export function CanvasOverlays() {
  const { view, zoomByAtCenter, reset, fitToContent } = useCanvasView()

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div style={pillStyle}>
        <IconButton
          icon={<ZoomOut size={14} />}
          size={24}
          bordered={false}
          ariaLabel="Zoom out"
          onClick={() => zoomByAtCenter(1 / ZOOM_STEP)}
        />
        <button
          type="button"
          className="type-3 text-trim"
          style={zoomLabelStyle}
          onClick={reset}
          aria-label="Reset zoom to 100%"
        >
          {Math.round(view.zoom * 100)}%
        </button>
        <IconButton
          icon={<ZoomIn size={14} />}
          size={24}
          bordered={false}
          ariaLabel="Zoom in"
          onClick={() => zoomByAtCenter(ZOOM_STEP)}
        />
        <IconButton
          icon={<ZoomFit size={14} />}
          size={24}
          bordered={false}
          ariaLabel="Fit to content"
          onClick={fitToContent}
        />
      </div>
    </div>
  )
}
