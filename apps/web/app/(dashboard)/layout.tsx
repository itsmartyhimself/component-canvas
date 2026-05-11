import type { ReactNode } from "react"
import { DashboardNav } from "@/components/live/dashboard-nav"
import { StaleViewerBanner } from "@/components/live/stale-viewer-banner"
import { ToastProvider } from "@/components/live/toast"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div
        className="flex min-h-full flex-1 flex-col"
        style={{
          background: "var(--color-bg-primary)",
          position: "relative",
        }}
      >
        <DashboardNav />
        {/* Soft gradient fade below the nav so scrolled content dissolves under it
            instead of slamming into a hard edge. Same pattern as the sidebar's scroll
            fades. Sits below StaleViewerBanner (z-index 10) and above main content. */}
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
              "linear-gradient(to bottom, var(--color-bg-elevated), transparent)",
          }}
        />
        <StaleViewerBanner />
        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingInline: 280 }}
        >
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
