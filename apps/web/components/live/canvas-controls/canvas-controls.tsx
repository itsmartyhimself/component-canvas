"use client"

// TODO(canvas-controls anchoring v2): panels are anchored to the viewport edges
// today (32px offsets). A v2 pass should explore stage-projected anchoring so
// controls can hover relative to the rendered component without scaling with
// the canvas zoom.

import type { CSSProperties } from "react"
import { EDGE_OFFSET, PAIR_GAP } from "./canvas-controls.config"
import { useCanvasControls } from "./canvas-controls-context"
import { VariantToggle } from "./variant-toggle"
import { SizeSelector } from "./size-selector"
import { PropertiesPanel } from "./properties-panel"
import { DarkModeTrigger } from "@/components/live/dark-mode"

const TOP_RIGHT_GAP = 8

const bottomLeftClusterStyle: CSSProperties = {
  position: "absolute",
  bottom: EDGE_OFFSET,
  left: EDGE_OFFSET,
  display: "flex",
  alignItems: "center",
  gap: PAIR_GAP,
  pointerEvents: "auto",
}

const topRightClusterStyle: CSSProperties = {
  position: "absolute",
  top: EDGE_OFFSET,
  right: EDGE_OFFSET,
  display: "flex",
  alignItems: "center",
  gap: TOP_RIGHT_GAP,
  pointerEvents: "auto",
}

export function CanvasControls() {
  const { manifest, props, setProp } = useCanvasControls()

  const variants = manifest?.controls.variants ?? null
  const sizes = manifest?.controls.sizes ?? null
  const variantValue = variants ? String(props[variants.prop]) : null
  const sizeValue = sizes ? String(props[sizes.prop]) : null

  return (
    <>
      {manifest && (variants || sizes) && (
        <div style={bottomLeftClusterStyle}>
          {variants && variantValue !== null && (
            <VariantToggle
              options={variants.options}
              value={variantValue}
              onChange={(next) => setProp(variants.prop, next)}
              label={variants.prop.toUpperCase()}
              ariaLabel="Variant"
            />
          )}
          {sizes && sizeValue !== null && (
            <SizeSelector
              options={sizes.options}
              value={sizeValue}
              onChange={(next) => setProp(sizes.prop, next)}
            />
          )}
        </div>
      )}
      <div style={topRightClusterStyle}>
        {manifest && <PropertiesPanel />}
        <DarkModeTrigger />
      </div>
    </>
  )
}
