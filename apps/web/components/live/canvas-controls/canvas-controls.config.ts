// All metrics below come from the pen file `component-book.pen` — the design
// source of truth. Layer ids cited inline.

// Viewport placement (v1 is viewport-edge; not projected onto the component).
export const EDGE_OFFSET = 32
export const PAIR_GAP = 24

// Outer pill (matches Variant-toggle-final `7TVMN` + Trigger — Closed `6QcVJ`).
export const PILL_RADIUS = 14 // pen cornerRadius
export const PILL_PADDING = 6
export const PILL_HEIGHT = 36
export const PILL_BG = "var(--color-bg-primary)"
export const PILL_BORDER = "1px solid var(--color-border-primary)"
export const PILL_SHADOW = "var(--shadow-small)"

// Variant toggle internals.
export const VARIANT_GAP = 6 // pen gap on 7TVMN
export const CHIP_HEIGHT = 24 // pen chip height
export const CHIP_RADIUS = 8 // pen chip cornerRadius
export const CHIP_PAD_X = 8 // pen chip padding

// Colors (pen: #121111 / #f6f6f9 / #6d6467 / #9b9295).
export const COLOR_ACTIVE_BG = "var(--color-text-primary)"
export const COLOR_ACTIVE_FG = "var(--color-bg-primary)"
export const COLOR_INACTIVE_BG = "var(--color-bg-secondary)"
export const COLOR_INACTIVE_FG = "var(--color-text-secondary)"
export const COLOR_MUTED = "var(--color-text-tertiary)" // #9b9295

// Leading label inside pills (SIZE / VARIANT).
export const LABEL_FONT_SIZE = 12
export const LABEL_FONT_WEIGHT = 500
export const LABEL_PAD_X = 8

// Chip text.
export const CHIP_FONT_SIZE = 14
export const CHIP_FONT_WEIGHT = 400

// Size-selector internals.
export const SIZE_GAP = 4 // pen gap on 6QcVJ / KVtKG
export const SIZE_CHIP_W = 26 // 26x24 size pills
export const SIZE_CHIP_H = 24
export const SIZE_EXPAND_HINT_PAD_X = 6

// Overflow scroll + gradient fades (variant-toggle pill + panel varRow).
export const PILL_MAX_WIDTH = 360
export const PANEL_VAROPTS_WIDTH = 160
export const PANEL_VAROPTS_HEIGHT = 24
export const SCROLL_FADE_WIDTH = 20

// Properties trigger (pen `dhxS8`).
export const TRIGGER_SIZE = 24
export const TRIGGER_ICON = 14
export const TRIGGER_ACTIVE_BG = "#0095ff"

// Properties panel (pen `unkMm`).
export const PANEL_WIDTH = 300
export const PANEL_RADIUS = 16
export const PANEL_DIVIDER_COLOR = "var(--color-border-secondary)" // #dfe0e7 in pen uses #e6e7ef; semantic border-secondary is closest
export const PANEL_SECTION_LABEL_SIZE = 11
export const PANEL_SECTION_LABEL_WEIGHT = 600
export const PANEL_ROW_TEXT_SIZE = 13

// Form chip (pen row items like p1..p5).
export const FORM_CHIP_HEIGHT = 28
export const FORM_CHIP_RADIUS = 6
export const FORM_CHIP_PAD_X = 10
export const FORM_CHIP_GAP = 6
export const FORM_CHIP_FONT = 12

// Options (iOS-style switch). Pen: 36x20 track, cornerRadius 10, pad 2, inner 16x16.
export const SWITCH_W = 36
export const SWITCH_H = 20
export const SWITCH_RADIUS = 10
export const SWITCH_PAD = 2
export const SWITCH_KNOB = 16
export const SWITCH_ON_BG = "#0095ff"
export const SWITCH_OFF_BG = "var(--color-border-secondary)"

