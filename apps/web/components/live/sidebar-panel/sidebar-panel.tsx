"use client"

import type { CSSProperties } from "react"
import { ScrollArea } from "radix-ui"
import { SidebarProvider } from "@/components/imports/shadcn/sidebar"
import { SidebarPanelProvider } from "./sidebar-panel-provider"
import { SIDEBAR_WIDTH } from "./sidebar-panel.config"

const asideStyle: CSSProperties = {
  width: SIDEBAR_WIDTH,
}

export function SidebarPanel() {
  return (
    <SidebarProvider className="contents">
      <SidebarPanelProvider>
        <aside
          aria-label="Component browser"
          className="flex flex-col shrink-0 h-full"
          style={asideStyle}
        >
          <div className="shrink-0" data-slot="sidebar-panel-header" />
          <ScrollArea.Root
            type="scroll"
            className="flex-1 min-h-0 overflow-hidden"
            style={{ overscrollBehavior: "contain" }}
          >
            <ScrollArea.Viewport className="h-full w-full" data-slot="sidebar-panel-scroll" />
            <ScrollArea.Scrollbar
              orientation="vertical"
              className="flex touch-none select-none"
              style={{
                width: 8,
                padding: 2,
                background: "transparent",
              }}
            >
              <ScrollArea.Thumb
                className="flex-1"
                style={{
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-border-secondary)",
                }}
              />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
          <div className="shrink-0" data-slot="sidebar-panel-footer" />
        </aside>
      </SidebarPanelProvider>
    </SidebarProvider>
  )
}
