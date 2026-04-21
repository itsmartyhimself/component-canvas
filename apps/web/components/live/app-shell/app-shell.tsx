import { Canvas } from "./canvas"
import { Sidebar } from "./sidebar"

export function AppShell() {
  return (
    <main
      className="flex flex-1"
      style={{
        padding: "var(--spacing-4)",
        gap: "var(--spacing-4)",
        background: "var(--color-bg-tertiary)",
      }}
    >
      <Sidebar />
      <Canvas />
    </main>
  )
}
