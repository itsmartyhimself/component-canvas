"use client"

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TransitionEvent,
} from "react"
import { TooltipProvider } from "@/components/imports/shadcn/tooltip"
import { SidebarFooterZone } from "./sidebar-footer-zone"
import { SidebarHeaderZone } from "./sidebar-header-zone"
import { SidebarHighlightLayer } from "./sidebar-highlight-layer"
import { SidebarTree } from "./sidebar-tree"
import {
  SIDEBAR_EASE_OUT_SOFT,
  SIDEBAR_FADE_HEIGHT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_DURATION_MS,
} from "./sidebar-panel.config"
import { useSidebarPanel } from "./use-sidebar-panel"

const asideBaseStyle: CSSProperties = {
  height: "100%",
  background: "var(--color-bg-primary)",
  // Isolates layout work from the canvas sibling during the width transition.
  contain: "layout",
  // Clips labels/trailing/section-headers so they don't overflow the narrow
  // rail during collapse.
  overflow: "hidden",
}

const scrollWrapperStyle: CSSProperties = {
  position: "relative",
  flex: 1,
  minHeight: 0,
}

const scrollAreaStyle: CSSProperties = {
  height: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  overscrollBehavior: "contain",
  scrollbarWidth: "thin",
  scrollbarColor: "var(--color-border-secondary) transparent",
}

const stickyFadeBase: CSSProperties = {
  position: "sticky",
  height: SIDEBAR_FADE_HEIGHT,
  zIndex: 2,
  pointerEvents: "none",
  transition: "opacity var(--duration-micro) var(--ease-swift)",
}

// CSS transition on width — off the main thread, interruptible, honors
// prefers-reduced-motion via the @media rule in globals.css.
const asideTransition = `width ${SIDEBAR_WIDTH_DURATION_MS}ms ${SIDEBAR_EASE_OUT_SOFT}`

export function SidebarPanel() {
  return (
    <TooltipProvider delayDuration={500} skipDelayDuration={150}>
      <SidebarPanelInner />
    </TooltipProvider>
  )
}

function SidebarPanelInner() {
  const {
    collapsed,
    setHoverId,
    wrapperRef,
    pendingAddFocus,
    clearPendingAddFocus,
    addButtonRef,
  } = useSidebarPanel()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [atTop, setAtTop] = useState(true)
  const [atBottom, setAtBottom] = useState(true)

  const recalc = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setAtTop(el.scrollTop <= 0)
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    recalc()
    const observer = new ResizeObserver(recalc)
    observer.observe(el)
    if (wrapperRef.current) observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [recalc, wrapperRef])

  // Focus-after-expand: after the width transition completes on the aside,
  // if a pending add-focus request exists, focus the in-sidebar + button so
  // the user sees where the action lives.
  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return
      if (event.propertyName !== "width") return
      if (!collapsed && pendingAddFocus) {
        addButtonRef.current?.focus()
        clearPendingAddFocus()
      }
    },
    [collapsed, pendingAddFocus, addButtonRef, clearPendingAddFocus],
  )

  return (
    <aside
      aria-label="Component browser"
      className="flex flex-col shrink-0"
      data-collapsed={collapsed || undefined}
      style={{
        ...asideBaseStyle,
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
        transition: asideTransition,
      }}
      onTransitionEnd={handleTransitionEnd}
      onMouseLeave={() => setHoverId(null)}
    >
      <div className="shrink-0" data-slot="sidebar-panel-header">
        <SidebarHeaderZone />
      </div>
      <div style={scrollWrapperStyle}>
        <div
          ref={scrollRef}
          onScroll={recalc}
          data-slot="sidebar-panel-scroll"
          style={scrollAreaStyle}
        >
          <div
            aria-hidden
            style={{
              ...stickyFadeBase,
              top: 0,
              marginBottom: -SIDEBAR_FADE_HEIGHT,
              background:
                "linear-gradient(to bottom, var(--color-bg-primary), transparent)",
              opacity: atTop ? 0 : 1,
            }}
          />
          <div ref={wrapperRef} style={{ position: "relative" }}>
            <SidebarHighlightLayer />
            <Suspense fallback={null}>
              <SidebarTree />
            </Suspense>
          </div>
          <div
            aria-hidden
            style={{
              ...stickyFadeBase,
              bottom: 0,
              marginTop: -SIDEBAR_FADE_HEIGHT,
              background:
                "linear-gradient(to top, var(--color-bg-primary), transparent)",
              opacity: atBottom ? 0 : 1,
            }}
          />
        </div>
      </div>
      <div className="shrink-0" data-slot="sidebar-panel-footer">
        <SidebarFooterZone />
      </div>
    </aside>
  )
}
