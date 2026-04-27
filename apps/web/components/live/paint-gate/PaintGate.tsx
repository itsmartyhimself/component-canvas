"use client"

import { useEffect } from "react"

// Hides the app until React hydrates and lays out one full frame so the
// first visible paint is already in final state — pairs with the inline
// theme script in layout.tsx to avoid a flash of wrong theme. Two RAFs
// ensures React committed and layout ran before we flip data-ready and
// fade in. CSS rule lives in globals.css (html:not([data-ready]) body).
export function PaintGate() {
  useEffect(() => {
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        document.documentElement.dataset.ready = "true"
      })
    })
    return () => {
      cancelAnimationFrame(first)
      if (second) cancelAnimationFrame(second)
    }
  }, [])
  return null
}
