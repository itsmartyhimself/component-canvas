import { Canvas } from "./canvas"
import { SidebarPanel } from "@/components/live/sidebar-panel"

export function AppShell() {
  return (
    <main
      className="flex flex-1"
      style={{
        padding: "var(--spacing-4)",
        gap: "var(--spacing-4)",
        background: "var(--color-bg-primary)",
      }}
    >
      <SidebarPanel />
      <Canvas />
    </main>
  )
}
