import type { ReactNode } from "react"
import { DashboardNav } from "@/components/live/dashboard-nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      style={{
        background: "var(--color-bg-primary)",
        position: "relative",
      }}
    >
      <DashboardNav />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          height: 24,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, var(--color-bg-primary), transparent)",
        }}
      />
      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingInline: 280 }}
      >
        {children}
      </main>
    </div>
  )
}
