"use client"

import { Suspense, type CSSProperties } from "react"
import { ScrollArea } from "radix-ui"
import { SidebarProvider } from "@/components/imports/shadcn/sidebar"
import { DocModal } from "@/components/live/doc-modal"
import { ImportDialog } from "@/components/live/import-dialog"
import { SidebarFooterZone } from "./sidebar-footer-zone"
import { SidebarHeaderZone } from "./sidebar-header-zone"
import { SidebarPanelProvider } from "./sidebar-panel-provider"
import { SidebarTree } from "./sidebar-tree"
import { SIDEBAR_WIDTH } from "./sidebar-panel.config"

const asideStyle: CSSProperties = {
  width: SIDEBAR_WIDTH,
}

const scrollRootStyle: CSSProperties = {
  overscrollBehavior: "contain",
}

const thumbStyle: CSSProperties = {
  borderRadius: "var(--radius-full)",
  background: "var(--color-border-secondary)",
}

const scrollbarStyle: CSSProperties = {
  width: 8,
  padding: 2,
  background: "transparent",
}

export function SidebarPanel() {
  return (
    <SidebarPanelProvider>
      <aside
        aria-label="Component browser"
        className="flex flex-col shrink-0 h-full"
        style={asideStyle}
      >
        <div className="shrink-0" data-slot="sidebar-panel-header">
          <SidebarHeaderZone />
        </div>
        <ScrollArea.Root
          type="scroll"
          className="flex-1 min-h-0 overflow-hidden"
          style={scrollRootStyle}
        >
          <ScrollArea.Viewport
            className="h-full w-full"
            data-slot="sidebar-panel-scroll"
          >
            <SidebarProvider className="contents">
              <Suspense fallback={null}>
                <SidebarTree />
              </Suspense>
            </SidebarProvider>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex touch-none select-none"
            style={scrollbarStyle}
          >
            <ScrollArea.Thumb className="flex-1" style={thumbStyle} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <div className="shrink-0" data-slot="sidebar-panel-footer">
          <SidebarFooterZone />
        </div>
      </aside>
      <ImportDialog />
      <DocModal />
    </SidebarPanelProvider>
  )
}
