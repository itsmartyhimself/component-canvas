"use client"

import { useSearchParams } from "next/navigation"
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ROW_HOVER_PILL,
  ROW_SPRING,
} from "@/components/live/row/row.config"
import { useSidebarPanel } from "./use-sidebar-panel"

interface Bounds {
  top: number
  left: number
  width: number
  height: number
  radius: string
}

function readBounds(el: HTMLElement, container: HTMLElement): Bounds | null {
  const er = el.getBoundingClientRect()
  if (er.width === 0 || er.height === 0) return null
  const cr = container.getBoundingClientRect()
  const cs = getComputedStyle(el)
  return {
    top: er.top - cr.top,
    left: er.left - cr.left,
    width: er.width,
    height: er.height,
    radius: cs.borderTopLeftRadius || "var(--radius-1-5)",
  }
}

const layerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
}

export function SidebarHighlightLayer() {
  const searchParams = useSearchParams()
  const activeId = searchParams.get("component")
  const { hoverId, rowRegistry, registryVersion, wrapperRef } =
    useSidebarPanel()

  const [bounds, setBounds] = useState<Bounds | null>(null)

  const measure = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const targetId = hoverId && hoverId !== activeId ? hoverId : null
    const el = targetId ? rowRegistry.current.get(targetId) : null
    setBounds(el ? readBounds(el, wrapper) : null)
  }, [hoverId, activeId, wrapperRef, rowRegistry])

  useLayoutEffect(() => {
    measure()
  }, [measure, registryVersion])

  const measureRef = useRef(measure)
  measureRef.current = measure
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const observer = new ResizeObserver(() => measureRef.current())
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [wrapperRef])

  return (
    <div aria-hidden style={layerStyle}>
      <AnimatePresence initial={false}>
        {bounds ? (
          <motion.div
            key="sidebar-hover-pill"
            initial={{
              top: bounds.top,
              left: bounds.left,
              width: bounds.width,
              height: bounds.height,
              opacity: 0,
            }}
            animate={{
              top: bounds.top,
              left: bounds.left,
              width: bounds.width,
              height: bounds.height,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
            transition={ROW_SPRING}
            style={{
              position: "absolute",
              background: ROW_HOVER_PILL.background,
              borderRadius: bounds.radius,
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
