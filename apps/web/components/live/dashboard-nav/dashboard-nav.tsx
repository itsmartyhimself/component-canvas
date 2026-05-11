import Link from "next/link"
import { Button } from "@/components/live/button"
import { DarkModeTrigger } from "@/components/live/dark-mode"
import { NavAvatar } from "./nav-avatar"
import { NavSearch } from "./nav-search"

export function DashboardNav() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--spacing-12)",
        height: 60,
        paddingBlock: "var(--spacing-4)",
        paddingInline: "var(--spacing-10)",
        background: "var(--color-bg-elevated)",
        flexShrink: 0,
      }}
    >
      <Link
        href="/"
        aria-label="Component Canvas home"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--spacing-3)",
          width: 238,
          height: 36,
          color: "var(--color-text-primary)",
          textDecoration: "none",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: "var(--radius-2)",
            background: "var(--gradient-dusk)",
          }}
        />
        <span className="type-4 font-medium">Component Canvas</span>
      </Link>

      <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <NavSearch />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-3)",
        }}
      >
        <Button
          variant="pop"
          size="small"
          form="label"
          label="Connect Repo"
          href="/connect"
        />
        <NavAvatar />
        <DarkModeTrigger />
      </div>
    </header>
  )
}
