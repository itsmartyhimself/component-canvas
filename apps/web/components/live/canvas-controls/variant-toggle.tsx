"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { OverflowMenuHorizontal } from "@carbon/icons-react"
import {
  CHIP_FONT_SIZE,
  CHIP_FONT_WEIGHT,
  CHIP_HEIGHT,
  CHIP_MAX_WIDTH,
  CHIP_PAD_X,
  CHIP_RADIUS,
  COLOR_ACTIVE_BG,
  COLOR_ACTIVE_FG,
  COLOR_INACTIVE_FG,
  COLOR_MUTED,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
  LABEL_PAD_X,
  MOTION_ENTER,
  PANEL_ROW_TEXT_SIZE,
  PILL_BG,
  PILL_BORDER,
  PILL_HEIGHT,
  PILL_PADDING,
  PILL_RADIUS,
  PILL_SHADOW,
  SIZE_EXPAND_HINT_PAD_X,
  VARIANT_GAP,
  VARIANT_INLINE_MAX,
} from "./canvas-controls.config"

const COLOR_TRANSITION =
  "background-color var(--duration-micro) var(--ease-standard), color var(--duration-micro) var(--ease-standard)"

const WIDTH_TRANSITION = "width 220ms var(--ease-standard)"

const PILL_OVERHEAD = PILL_PADDING * 2 + 2

type VariantToggleProps = {
  options: string[]
  value: string
  onChange: (next: string) => void
  label?: string
  ariaLabel?: string
}

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
  gap: VARIANT_GAP,
  width: "max-content",
  flexShrink: 0,
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

const rowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: VARIANT_GAP,
}

function chipStyle(active: boolean): CSSProperties {
  return {
    flexShrink: 0,
    height: CHIP_HEIGHT,
    maxWidth: CHIP_MAX_WIDTH,
    minWidth: 0,
    padding: `0 ${CHIP_PAD_X}px`,
    borderRadius: CHIP_RADIUS,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    cursor: "pointer",
    // Pill bg is bg-primary, so the inactive chip uses bg-hover directly —
    // not COLOR_INACTIVE_BG, which is for the elevated panel context.
    background: active ? COLOR_ACTIVE_BG : "var(--color-bg-hover)",
    color: active ? COLOR_ACTIVE_FG : COLOR_INACTIVE_FG,
    fontSize: CHIP_FONT_SIZE,
    fontWeight: CHIP_FONT_WEIGHT,
    lineHeight: 1,
    textTransform: "capitalize",
    userSelect: "none",
    overflow: "hidden",
    border: 0,
    transition: COLOR_TRANSITION,
  }
}

const chipLabelStyle: CSSProperties = {
  display: "block",
  minWidth: 0,
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}

const dotsButtonStyle: CSSProperties = {
  flexShrink: 0,
  height: CHIP_HEIGHT,
  padding: `0 ${SIZE_EXPAND_HINT_PAD_X}px`,
  borderRadius: CHIP_RADIUS,
  background: "var(--color-bg-hover)",
  color: COLOR_MUTED,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  userSelect: "none",
  border: 0,
}

const popoverContentStyle: CSSProperties = {
  minWidth: 160,
  maxHeight: 280,
  overflowY: "auto",
  padding: 4,
  borderRadius: 12,
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border-primary)",
  boxShadow: "var(--shadow-medium)",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  gap: 2,
  pointerEvents: "auto",
}

function popoverRowStyle(active: boolean): CSSProperties {
  return {
    height: 32,
    padding: "0 10px",
    borderRadius: CHIP_RADIUS,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    background: active ? COLOR_ACTIVE_BG : "transparent",
    color: active ? COLOR_ACTIVE_FG : COLOR_INACTIVE_FG,
    fontSize: PANEL_ROW_TEXT_SIZE,
    fontWeight: 400,
    lineHeight: 1,
    textTransform: "capitalize",
    cursor: "pointer",
    border: 0,
    width: "100%",
    textAlign: "left",
    whiteSpace: "nowrap",
    transition: COLOR_TRANSITION,
  }
}

function useMeasuredWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [width, setWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, width }
}

function useTruncationRef() {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [truncated, setTruncated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setTruncated(el.scrollWidth > el.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, truncated }
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const { ref, truncated } = useTruncationRef()

  return (
    <button
      type="button"
      onClick={onClick}
      style={chipStyle(active)}
      aria-pressed={active}
      title={truncated ? label : undefined}
    >
      <span ref={ref} style={chipLabelStyle}>
        {label}
      </span>
    </button>
  )
}

function StaticChip({ label }: { label: string }) {
  const { ref, truncated } = useTruncationRef()

  return (
    <span
      style={{ ...chipStyle(true), cursor: "default" }}
      title={truncated ? label : undefined}
    >
      <span ref={ref} style={chipLabelStyle}>
        {label}
      </span>
    </span>
  )
}

export function VariantToggle({
  options,
  value,
  onChange,
  label,
  ariaLabel,
}: VariantToggleProps) {
  const { ref: innerRef, width } = useMeasuredWidth<HTMLDivElement>()

  if (options.length <= 1) return null

  const usePopover = options.length > VARIANT_INLINE_MAX
  const groupLabel = ariaLabel ?? label ?? "Variant"
  const outerStyle: CSSProperties = {
    ...pillOuterStyle,
    width: width != null ? width + PILL_OVERHEAD : "auto",
  }

  if (!usePopover) {
    return (
      <div style={outerStyle} role="group" aria-label={groupLabel}>
        <div ref={innerRef} style={pillInnerStyle}>
          {label && <span style={labelFrameStyle}>{label}</span>}
          <div style={rowStyle}>
            {options.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                active={opt === value}
                onClick={() => {
                  if (opt !== value) onChange(opt)
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <OverflowPopover
      options={options}
      value={value}
      onChange={onChange}
      ariaLabel={groupLabel}
    >
      <PopoverPrimitive.Anchor asChild>
        <div style={outerStyle} role="group" aria-label={groupLabel}>
          <div ref={innerRef} style={pillInnerStyle}>
            {label && <span style={labelFrameStyle}>{label}</span>}
            <div style={rowStyle}>
              <StaticChip label={value} />
              <PopoverPrimitive.Trigger asChild>
                <button
                  type="button"
                  style={dotsButtonStyle}
                  aria-label={`Show all ${groupLabel.toLowerCase()} options`}
                  aria-haspopup="listbox"
                >
                  <OverflowMenuHorizontal size={14} />
                </button>
              </PopoverPrimitive.Trigger>
            </div>
          </div>
        </div>
      </PopoverPrimitive.Anchor>
    </OverflowPopover>
  )
}

function OverflowPopover({
  options,
  value,
  onChange,
  ariaLabel,
  children,
}: {
  options: string[]
  value: string
  onChange: (next: string) => void
  ariaLabel: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      {children}
      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              forceMount
              side="top"
              align="end"
              sideOffset={8}
              asChild
            >
              <motion.div
                key="popover-content"
                initial={{ opacity: 0, scale: 0.96, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 4 }}
                transition={reduce ? { duration: 0 } : MOTION_ENTER}
                style={{
                  ...popoverContentStyle,
                  transformOrigin:
                    "var(--radix-popover-content-transform-origin)",
                }}
                role="listbox"
                aria-label={ariaLabel}
              >
                {options.map((opt) => {
                  const active = opt === value
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        if (opt !== value) onChange(opt)
                        setOpen(false)
                      }}
                      style={popoverRowStyle(active)}
                      onMouseEnter={(event) => {
                        if (active) return
                        event.currentTarget.style.background =
                          "var(--color-bg-hover-elevated)"
                        event.currentTarget.style.color =
                          "var(--color-text-primary)"
                      }}
                      onMouseLeave={(event) => {
                        if (active) return
                        event.currentTarget.style.background = "transparent"
                        event.currentTarget.style.color = COLOR_INACTIVE_FG
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  )
}
