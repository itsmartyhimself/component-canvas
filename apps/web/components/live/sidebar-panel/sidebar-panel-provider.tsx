"use client"

import { createContext, useContext, type ReactNode } from "react"

type SidebarPanelContextValue = {
  // Filled in by step 4 — scaffolded here so SidebarPanel can host the provider.
  _placeholder: true
}

const SidebarPanelContext = createContext<SidebarPanelContextValue | null>(null)

export function SidebarPanelProvider({ children }: { children: ReactNode }) {
  return (
    <SidebarPanelContext.Provider value={{ _placeholder: true }}>
      {children}
    </SidebarPanelContext.Provider>
  )
}

export function useSidebarPanelContext(): SidebarPanelContextValue {
  const ctx = useContext(SidebarPanelContext)
  if (!ctx) {
    throw new Error("useSidebarPanelContext must be used inside <SidebarPanelProvider>.")
  }
  return ctx
}
