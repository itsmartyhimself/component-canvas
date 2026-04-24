"use client"

import type { CSSProperties } from "react"
import { SidePanelClose, SidePanelOpen } from "@carbon/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/live/button"
import { useSidebarPanel } from "@/components/live/sidebar-panel"

// Matches the Row LeadingIconSlot crossfade — opacity + tiny blur over 150ms
// so the icon swap feels instant-but-polished. Kowalski: "Something still
// feels off → Add subtle blur (under 20px) to mask it."
const iconLayerVariants = {
  initial: { opacity: 0, filter: "blur(0.5px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(0.5px)" },
}

const iconLayerTransition = {
  duration: 0.15,
  ease: [0.32, 0.72, 0, 1] as const,
}

const iconSlotStyle: CSSProperties = {
  position: "relative",
  width: 16,
  height: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
}

const iconLayerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
}

function ToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <span style={iconSlotStyle}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={collapsed ? "open" : "close"}
          style={iconLayerStyle}
          variants={iconLayerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={iconLayerTransition}
        >
          {collapsed ? <SidePanelOpen size={16} /> : <SidePanelClose size={16} />}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function SidebarToggle() {
  const { collapsed, actions } = useSidebarPanel()

  return (
    <Button
      variant="ghost"
      size="small"
      form="icon-only"
      icon={<ToggleIcon collapsed={collapsed} />}
      ariaLabel={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={actions.toggleCollapsed}
    />
  )
}
