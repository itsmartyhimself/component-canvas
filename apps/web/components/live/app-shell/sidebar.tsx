"use client"

import { useState } from "react"
import { SidePanelClose, SidePanelOpen } from "@carbon/icons-react"

const EXPANDED_WIDTH = 280
const COLLAPSED_WIDTH = 64

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const Icon = collapsed ? SidePanelOpen : SidePanelClose

  return (
    <aside
      className="flex flex-col shrink-0"
      style={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        paddingBlock: "var(--spacing-4)",
        paddingInline: "var(--spacing-3)",
        transition: "width 200ms ease-out",
      }}
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="inline-flex items-center justify-center"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Icon size={20} />
        </button>
      </div>
    </aside>
  )
}
