import { Canvas } from "./canvas"
import { CanvasViewProvider } from "./canvas-view-context"
import { SidebarPanel } from "@/components/live/sidebar-panel"

export function AppShell() {
  return (
    <CanvasViewProvider>
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
    </CanvasViewProvider>
  )
}
