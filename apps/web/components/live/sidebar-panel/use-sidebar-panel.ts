"use client"

import { useSidebarPanelContext } from "./sidebar-panel-provider"

export function useSidebarPanel() {
  return useSidebarPanelContext()
}
