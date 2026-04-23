"use client"

// Matches pen `7TVMN` — Variant-toggle-final.
// Pill caps at PILL_MAX_WIDTH. VARIANT label stays fixed; chips sit in a
// horizontal scroll region with gradient fades that only appear when the chips
// actually overflow. Pattern mirrors the sidebar scroll fades in
// sidebar-panel.tsx.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import {
  CHIP_FONT_SIZE,
  CHIP_FONT_WEIGHT,
  CHIP_HEIGHT,
  CHIP_PAD_X,
  CHIP_RADIUS,
  COLOR_ACTIVE_BG,
  COLOR_ACTIVE_FG,
  COLOR_INACTIVE_BG,
  COLOR_INACTIVE_FG,
  COLOR_MUTED,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
  LABEL_PAD_X,
  PILL_BG,
  PILL_BORDER,
  PILL_HEIGHT,
  PILL_MAX_WIDTH,
  PILL_PADDING,
  PILL_RADIUS,
  PILL_SHADOW,
  SCROLL_FADE_WIDTH,
  VARIANT_GAP,
} from "./canvas-controls.config"

type VariantToggleProps = {
  options: string[]
  value: string
  onChange: (next: string) => void
  label?: string
  ariaLabel?: string
}

const containerStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: PILL_HEIGHT,
  maxWidth: PILL_MAX_WIDTH,
  padding: PILL_PADDING,
  gap: VARIANT_GAP,
  borderRadius: PILL_RADIUS,
  background: PILL_BG,
  border: PILL_BORDER,
  boxShadow: PILL_SHADOW,
  pointerEvents: "auto",
}

const labelFrameStyle: CSSProperties = {
  flexShrink: 0,
  height: CHIP_HEIGHT,
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

const scrollWrapStyle: CSSProperties = {
  position: "relative",
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  alignSelf: "stretch",
}

const scrollAreaStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  overflowX: "auto",
  overflowY: "hidden",
  overscrollBehaviorX: "contain",
  height: "100%",
}

const rowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: VARIANT_GAP,
}

function chipStyle(active: boolean): CSSProperties {
  return {
    flexShrink: 0,
    height: CHIP_HEIGHT,
    padding: `0 ${CHIP_PAD_X}px`,
    borderRadius: CHIP_RADIUS,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: active ? COLOR_ACTIVE_BG : COLOR_INACTIVE_BG,
    color: active ? COLOR_ACTIVE_FG : COLOR_INACTIVE_FG,
    fontSize: CHIP_FONT_SIZE,
    fontWeight: CHIP_FONT_WEIGHT,
    lineHeight: 1,
    textTransform: "capitalize",
    userSelect: "none",
  }
}

const fadeBase: CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: SCROLL_FADE_WIDTH,
  pointerEvents: "none",
  transition: "opacity var(--duration-micro) var(--ease-swift)",
}

export function VariantToggle({
  options,
  value,
  onChange,
  label,
  ariaLabel,
}: VariantToggleProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  const recalc = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 0)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [recalc])

  return (
    <div style={containerStyle}>
      {label && <span style={labelFrameStyle}>{label}</span>}
      <div style={scrollWrapStyle}>
        <div
          ref={scrollRef}
          onScroll={recalc}
          className="scrollbar-hidden"
          style={scrollAreaStyle}
        >
          <ToggleGroupPrimitive.Root
            type="single"
            value={value}
            onValueChange={(next) => {
              if (next) onChange(next)
            }}
            aria-label={ariaLabel ?? label}
            asChild
          >
            <div style={rowStyle}>
              {options.map((opt) => (
                <ToggleGroupPrimitive.Item
                  key={opt}
                  value={opt}
                  style={chipStyle(opt === value)}
                >
                  {opt}
                </ToggleGroupPrimitive.Item>
              ))}
            </div>
          </ToggleGroupPrimitive.Root>
        </div>
        <div
          aria-hidden
          style={{
            ...fadeBase,
            left: 0,
            background: `linear-gradient(to right, ${PILL_BG}, transparent)`,
            opacity: atStart ? 0 : 1,
          }}
        />
        <div
          aria-hidden
          style={{
            ...fadeBase,
            right: 0,
            background: `linear-gradient(to left, ${PILL_BG}, transparent)`,
            opacity: atEnd ? 0 : 1,
          }}
        />
      </div>
    </div>
  )
}
