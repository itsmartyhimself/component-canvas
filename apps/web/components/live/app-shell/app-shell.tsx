import { Canvas } from "./canvas"
import { CanvasViewProvider } from "./canvas-view-context"
import { DocModal } from "@/components/live/doc-modal"
import { ImportDialog } from "@/components/live/import-dialog"
import {
  SidebarPanel,
  SidebarPanelProvider,
} from "@/components/live/sidebar-panel"

export function AppShell() {
  return (
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
        <ImportDialog />
        <DocModal />
      </SidebarPanelProvider>
    </CanvasViewProvider>
  )
}
