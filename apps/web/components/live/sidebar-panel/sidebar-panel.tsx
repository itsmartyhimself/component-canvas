"use client"

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { DocModal } from "@/components/live/doc-modal"
import { ImportDialog } from "@/components/live/import-dialog"
import { SidebarFooterZone } from "./sidebar-footer-zone"
import { SidebarHeaderZone } from "./sidebar-header-zone"
import { SidebarHighlightLayer } from "./sidebar-highlight-layer"
import { SidebarPanelProvider } from "./sidebar-panel-provider"
import { SidebarTree } from "./sidebar-tree"
import { SIDEBAR_FADE_HEIGHT, SIDEBAR_WIDTH } from "./sidebar-panel.config"
import { useSidebarPanel } from "./use-sidebar-panel"

const asideStyle: CSSProperties = {
  width: SIDEBAR_WIDTH,
  height: "100%",
  background: "var(--color-bg-primary)",
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

export function SidebarPanel() {
  return (
    <SidebarPanelProvider>
      <SidebarPanelInner />
      <ImportDialog />
      <DocModal />
    </SidebarPanelProvider>
  )
}

function SidebarPanelInner() {
  const { setHoverId, wrapperRef } = useSidebarPanel()
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

  return (
    <aside
      aria-label="Component browser"
      className="flex flex-col shrink-0"
      style={asideStyle}
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
