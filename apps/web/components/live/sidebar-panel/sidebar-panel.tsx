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
import { SidebarPanelProvider } from "./sidebar-panel-provider"
import { SidebarTree } from "./sidebar-tree"
import { SIDEBAR_FADE_HEIGHT, SIDEBAR_WIDTH } from "./sidebar-panel.config"

const asideStyle: CSSProperties = {
  width: SIDEBAR_WIDTH,
  height: "100%",
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

const fadeBase: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  height: SIDEBAR_FADE_HEIGHT,
  pointerEvents: "none",
  transition: "opacity 120ms ease",
}

export function SidebarPanel() {
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
    const inner = el.firstElementChild
    if (inner instanceof Element) observer.observe(inner)
    return () => observer.disconnect()
  }, [recalc])

  return (
    <SidebarPanelProvider>
      <aside
        aria-label="Component browser"
        className="flex flex-col shrink-0"
        style={asideStyle}
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
            <Suspense fallback={null}>
              <SidebarTree />
            </Suspense>
          </div>
          <div
            aria-hidden
            style={{
              ...fadeBase,
              top: 0,
              background:
                "linear-gradient(to bottom, var(--color-bg-primary), transparent)",
              opacity: atTop ? 0 : 1,
            }}
          />
          <div
            aria-hidden
            style={{
              ...fadeBase,
              bottom: 0,
              background:
                "linear-gradient(to top, var(--color-bg-primary), transparent)",
              opacity: atBottom ? 0 : 1,
            }}
          />
        </div>
        <div className="shrink-0" data-slot="sidebar-panel-footer">
          <SidebarFooterZone />
        </div>
      </aside>
      <ImportDialog />
      <DocModal />
    </SidebarPanelProvider>
  )
}
