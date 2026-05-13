import { Canvas } from "./canvas"
import { CanvasViewProvider } from "./canvas-view-context"
import { StaleViewerTrigger } from "./stale-viewer-trigger"
import { DocModal } from "@/components/live/doc-modal"
import {
  SidebarPanel,
  SidebarPanelProvider,
} from "@/components/live/sidebar-panel"
import { ToastProvider } from "@/components/live/toast"

export function AppShell() {
  return (
    <ToastProvider>
      <CanvasViewProvider>
        <SidebarPanelProvider>
          <main
            className="flex"
            style={{
              height: "100dvh",
              padding: "var(--spacing-4)",
              gap: "var(--spacing-4)",
              background: "var(--color-bg-primary)",
            }}
          >
            <SidebarPanel />
            <Canvas />
          </main>
          <DocModal />
          <StaleViewerTrigger />
        </SidebarPanelProvider>
      </CanvasViewProvider>
    </ToastProvider>
  )
}
