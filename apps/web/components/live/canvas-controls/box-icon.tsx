"use client"

// Approximation of the pen's `box--small/medium/large/extra-large` glyphs.
// Pen paths are fully custom SVG per size; this renders a "monitor with a size
// letter" silhouette that reads the same at 16x16 but stays trivially
// maintainable. Letter is stylized, not a real type run.

import type { CSSProperties } from "react"

type BoxIconProps = {
  size: string
  pixel?: number
  color?: string
  style?: CSSProperties
}

const LETTER_FOR: Record<string, string> = {
  small: "S",
  medium: "M",
  large: "L",
  "extra-large": "XL",
  xl: "XL",
}

function letterFor(size: string) {
  return LETTER_FOR[size] ?? size.charAt(0).toUpperCase()
}

export function BoxIcon({
  size,
  pixel = 16,
  color = "currentColor",
  style,
}: BoxIconProps) {
  const letter = letterFor(size)
  return (
    <svg
      width={pixel}
      height={pixel}
      viewBox="0 0 16 16"
      fill="none"
      style={style}
      aria-hidden
    >
      {/* monitor top bar */}
      <rect x="2" y="2" width="12" height="1" fill={color} />
      {/* monitor frame */}
      <rect
        x="2.5"
        y="4.5"
        width="11"
        height="9"
        rx="0.75"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      {/* size letter */}
      <text
        x="8"
        y="11.5"
        textAnchor="middle"
        fontSize={letter.length > 1 ? 5 : 6}
        fontWeight={700}
        fontFamily="Geist, system-ui, sans-serif"
        fill={color}
      >
        {letter}
      </text>
    </svg>
  )
}
