"use client"

// Diverges from pen `7TVMN` on purpose. The original design capped the pill at
// 360px and used horizontal overflow scroll with gradient fades. That pattern
// is unusable on the canvas surface because wheel events belong to the pan/zoom
// layer — you can't actually scroll the chip row without moving the whole
// canvas.
//
// New model:
//   • Pill hugs its children (no fixed max-width).
//   • Each chip hugs its label up to CHIP_MAX_WIDTH; overflowing text truncates
//     via text-overflow: ellipsis (CSS picks the pixel boundary, so the glyph
//     is the single-character U+2026 and we don't hard-cap at N characters).
//   • ≤ 1 variant → don't render the toggle at all.
//   • 2–4 variants → plain inline row.
//   • 5+ variants → only the selected chip is inline, followed by a `…`
//     trigger that opens a Radix popover listing every variant. Selecting in
//     the popover swaps the single inline chip — nothing else rearranges.
//
// Truncation tooltip: native `title` attribute mounted only when the chip is
// actually clipped (measured via scrollWidth vs clientWidth). Desktop-only app
// per apps/web/CLAUDE.md, so native hover is acceptable and costs zero bundle.

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
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
  COLOR_INACTIVE_BG,
  COLOR_INACTIVE_FG,
  COLOR_MUTED,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
  LABEL_PAD_X,
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
    background: active ? COLOR_ACTIVE_BG : COLOR_INACTIVE_BG,
    color: active ? COLOR_ACTIVE_FG : COLOR_INACTIVE_FG,
    fontSize: CHIP_FONT_SIZE,
    fontWeight: CHIP_FONT_WEIGHT,
    lineHeight: 1,
    textTransform: "capitalize",
    userSelect: "none",
    overflow: "hidden",
    border: 0,
  }
}

// Text label renders inside a block span so `text-overflow: ellipsis` has a
// reliable inline flow to act on. Applying ellipsis directly to the flex
// button is inconsistent across engines and was producing center-clipped text
// instead of an `…` on the right.
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
  background: "var(--color-bg-secondary)",
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
  background: "var(--color-bg-primary)",
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
  }
}

function Chip({
  label,
  active,
  onClick,
  ariaPressed,
}: {
  label: string
  active: boolean
  onClick: () => void
  ariaPressed?: boolean
}) {
  const labelRef = useRef<HTMLSpanElement | null>(null)
  const [truncated, setTruncated] = useState(false)

  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    const check = () => setTruncated(el.scrollWidth > el.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [label])

  return (
    <button
      type="button"
      onClick={onClick}
      style={chipStyle(active)}
      aria-pressed={ariaPressed ?? active}
      title={truncated ? label : undefined}
    >
      <span ref={labelRef} style={chipLabelStyle}>
        {label}
      </span>
    </button>
  )
}

export function VariantToggle({
  options,
  value,
  onChange,
  label,
  ariaLabel,
}: VariantToggleProps) {
  if (options.length <= 1) return null

  const usePopover = options.length > VARIANT_INLINE_MAX
  const groupLabel = ariaLabel ?? label ?? "Variant"

  return (
    <div style={containerStyle} role="group" aria-label={groupLabel}>
      {label && <span style={labelFrameStyle}>{label}</span>}
      <div style={rowStyle}>
        {usePopover ? (
          <OverflowVariantRow
            options={options}
            value={value}
            onChange={onChange}
            ariaLabel={groupLabel}
          />
        ) : (
          options.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              active={opt === value}
              onClick={() => {
                if (opt !== value) onChange(opt)
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

function OverflowVariantRow({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: string[]
  value: string
  onChange: (next: string) => void
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <Chip
        label={value}
        active
        onClick={() => setOpen((prev) => !prev)}
        ariaPressed={open}
      />
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          style={dotsButtonStyle}
          aria-label={`Show all ${ariaLabel.toLowerCase()} options`}
          aria-haspopup="listbox"
        >
          <OverflowMenuHorizontal size={14} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="top"
          align="end"
          sideOffset={8}
          style={{
            ...popoverContentStyle,
            transformOrigin: "var(--radix-popover-content-transform-origin)",
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
                    "var(--color-bg-secondary)"
                  event.currentTarget.style.color = "var(--color-text-primary)"
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
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
