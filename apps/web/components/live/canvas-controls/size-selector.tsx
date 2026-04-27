"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { Maximize } from "@carbon/icons-react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { BoxIcon } from "./box-icon"
import {
  COLOR_ACTIVE_BG,
  COLOR_ACTIVE_FG,
  COLOR_INACTIVE_FG,
  COLOR_MUTED,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
  LABEL_PAD_X,
  MOTION_ENTER,
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

const WIDTH_TRANSITION = "width 220ms var(--ease-standard)"

const PILL_OVERHEAD = PILL_PADDING * 2 + 2

const COLOR_TRANSITION =
  "background-color var(--duration-micro) var(--ease-standard), color var(--duration-micro) var(--ease-standard), opacity var(--duration-micro) var(--ease-standard)"

const pillOuterStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: PILL_HEIGHT,
  padding: PILL_PADDING,
  borderRadius: PILL_RADIUS,
  background: PILL_BG,
  border: PILL_BORDER,
  boxShadow: PILL_SHADOW,
  pointerEvents: "auto",
  overflow: "hidden",
  transition: WIDTH_TRANSITION,
}

const pillInnerStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: SIZE_GAP,
  width: "max-content",
  flexShrink: 0,
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
  background: "var(--color-bg-hover)",
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
      ? "var(--color-bg-hover)"
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
    transition: COLOR_TRANSITION,
  }
}

const groupRowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: SIZE_GAP,
}

export function SizeSelector({ options, value, onChange }: SizeSelectorProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [hoverLocked, setHoverLocked] = useState(false)
  const [hoveredOpt, setHoveredOpt] = useState<string | null>(null)
  const pillRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const enterTransition = reduce ? { duration: 0 } : MOTION_ENTER
  const exitTransition = reduce
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const }

  useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    const measure = () => setWidth(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const root = pillRef.current
      if (!root) return
      if (event.target instanceof Node && root.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  const outerStyle: CSSProperties = {
    ...pillOuterStyle,
    width: width != null ? width + PILL_OVERHEAD : "auto",
  }

  return (
    <div
      ref={pillRef}
      style={outerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setHoverLocked(false)
      }}
      role="group"
      aria-label="Size"
    >
      <div ref={innerRef} style={pillInnerStyle}>
        <span style={labelStyle}>SIZE</span>

        {open ? (
          <div style={groupRowStyle}>
            <ToggleGroupPrimitive.Root
              type="single"
              value={value}
              onValueChange={(next) => {
                if (!next) return
                onChange(next)
                setOpen(false)
                setHoverLocked(true)
              }}
              aria-label="Size options"
              asChild
            >
              <div style={groupRowStyle}>
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
          </div>
        ) : (
          <div style={groupRowStyle}>
            <button
              type="button"
              style={activeChipClosedStyle}
              aria-label={`Selected size ${value}`}
              onClick={() => setOpen(true)}
            >
              <BoxIcon size={value} color={COLOR_ACTIVE_FG} />
            </button>
            <AnimatePresence initial={false} mode="popLayout">
              {hovered && !hoverLocked && (
                <motion.button
                  key="hint"
                  type="button"
                  style={expandHintStyle}
                  aria-label="Show size options"
                  onClick={() => setOpen(true)}
                  initial={{ opacity: 0, x: -6, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: -6,
                    scale: 0.95,
                    transition: exitTransition,
                  }}
                  transition={enterTransition}
                >
                  <Maximize size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
