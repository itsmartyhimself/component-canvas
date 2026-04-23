"use client"

// Closed → pen `6QcVJ` (Trigger — Closed inside Size-selector-closed-final).
// Hover  → pen `iuOgz` (Trigger — Hover inside Size-selector-hover-final).
// Open   → pen `KVtKG` (Segment — Open inside Size-selector-open-final).
//
// One pill that swaps its children inline as state advances:
//   closed  : [SIZE label, active size chip]
//   hovered : [SIZE label, active size chip, expand hint chip]
//   open    : [SIZE label, ...all size chips]
// Flexbox grows horizontally to fit each state. Click outside the pill while
// open → collapses without committing (per pen context on KVtKG).

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Maximize } from "@carbon/icons-react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { BoxIcon } from "./box-icon"
import {
  COLOR_ACTIVE_BG,
  COLOR_ACTIVE_FG,
  COLOR_INACTIVE_FG,
  COLOR_MUTED,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
  LABEL_PAD_X,
  PILL_BG,
  PILL_BORDER,
  PILL_HEIGHT,
  PILL_PADDING,
  PILL_RADIUS,
  PILL_SHADOW,
  SIZE_CHIP_H,
  SIZE_CHIP_W,
  SIZE_EXPAND_HINT_PAD_X,
  SIZE_GAP,
  CHIP_RADIUS,
} from "./canvas-controls.config"

type SizeSelectorProps = {
  options: string[]
  value: string
  onChange: (next: string) => void
}

const pillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: PILL_HEIGHT,
  padding: PILL_PADDING,
  gap: SIZE_GAP,
  borderRadius: PILL_RADIUS,
  background: PILL_BG,
  border: PILL_BORDER,
  boxShadow: PILL_SHADOW,
  pointerEvents: "auto",
}

const labelStyle: CSSProperties = {
  height: SIZE_CHIP_H,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `0 ${LABEL_PAD_X}px`,
  color: COLOR_MUTED,
  fontSize: LABEL_FONT_SIZE,
  fontWeight: LABEL_FONT_WEIGHT,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  lineHeight: 1,
  userSelect: "none",
}

const activeChipClosedStyle: CSSProperties = {
  width: SIZE_CHIP_W,
  height: SIZE_CHIP_H,
  borderRadius: CHIP_RADIUS,
  background: COLOR_ACTIVE_BG,
  color: COLOR_ACTIVE_FG,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  border: 0,
  cursor: "pointer",
}

const expandHintStyle: CSSProperties = {
  height: SIZE_CHIP_H,
  padding: `0 ${SIZE_EXPAND_HINT_PAD_X}px`,
  borderRadius: CHIP_RADIUS,
  background: "var(--color-bg-secondary)",
  color: COLOR_MUTED,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  cursor: "pointer",
  border: 0,
}

function openChipStyle(active: boolean, hovered: boolean): CSSProperties {
  const background = active
    ? COLOR_ACTIVE_BG
    : hovered
      ? "var(--color-bg-secondary)"
      : "transparent"
  return {
    width: SIZE_CHIP_W,
    height: SIZE_CHIP_H,
    borderRadius: CHIP_RADIUS,
    background,
    color: active ? COLOR_ACTIVE_FG : COLOR_INACTIVE_FG,
    opacity: active ? 1 : 0.5,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    border: 0,
  }
}

export function SizeSelector({ options, value, onChange }: SizeSelectorProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [hoveredOpt, setHoveredOpt] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  // Click outside collapses without committing.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const root = ref.current
      if (!root) return
      if (event.target instanceof Node && root.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  return (
    <div
      ref={ref}
      style={pillStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="group"
      aria-label="Size"
    >
      <span style={labelStyle}>SIZE</span>

      {open ? (
        <ToggleGroupPrimitive.Root
          type="single"
          value={value}
          onValueChange={(next) => {
            if (!next) return
            onChange(next)
            setOpen(false)
          }}
          aria-label="Size options"
          asChild
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: SIZE_GAP,
            }}
          >
            {options.map((opt) => {
              const active = opt === value
              const chipHovered = hoveredOpt === opt
              return (
                <ToggleGroupPrimitive.Item
                  key={opt}
                  value={opt}
                  style={openChipStyle(active, chipHovered)}
                  onMouseEnter={() => setHoveredOpt(opt)}
                  onMouseLeave={() =>
                    setHoveredOpt((cur) => (cur === opt ? null : cur))
                  }
                >
                  <BoxIcon
                    size={opt}
                    color={active ? COLOR_ACTIVE_FG : COLOR_INACTIVE_FG}
                  />
                </ToggleGroupPrimitive.Item>
              )
            })}
          </div>
        </ToggleGroupPrimitive.Root>
      ) : (
        <>
          <button
            type="button"
            style={activeChipClosedStyle}
            aria-label={`Selected size ${value}`}
            onClick={() => setOpen(true)}
          >
            <BoxIcon size={value} color={COLOR_ACTIVE_FG} />
          </button>
          {hovered && (
            <button
              type="button"
              style={expandHintStyle}
              aria-label="Show size options"
              onClick={() => setOpen(true)}
            >
              <Maximize size={14} />
            </button>
          )}
        </>
      )}
    </div>
  )
}
