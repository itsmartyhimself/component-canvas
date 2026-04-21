"use client"

import { Suspense, type CSSProperties } from "react"
import { DocModal } from "@/components/live/doc-modal"
import { ImportDialog } from "@/components/live/import-dialog"
import { SidebarFooterZone } from "./sidebar-footer-zone"
import { SidebarHeaderZone } from "./sidebar-header-zone"
import { SidebarPanelProvider } from "./sidebar-panel-provider"
import { SidebarTree } from "./sidebar-tree"
import { SIDEBAR_WIDTH } from "./sidebar-panel.config"

const asideStyle: CSSProperties = {
  width: SIDEBAR_WIDTH,
  height: "100%",
}

const scrollAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  overscrollBehavior: "contain",
  scrollbarWidth: "thin",
  scrollbarColor:
    "var(--color-border-secondary) transparent",
}

export function SidebarPanel() {
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
        <div
          data-slot="sidebar-panel-scroll"
          style={scrollAreaStyle}
        >
          <Suspense fallback={null}>
            <SidebarTree />
          </Suspense>
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
