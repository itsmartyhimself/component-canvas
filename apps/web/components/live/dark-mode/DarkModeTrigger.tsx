"use client"

import type { CSSProperties } from "react"
import { Asleep, Light } from "@carbon/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  TRIGGER_ICON,
  TRIGGER_SIZE,
} from "@/components/live/canvas-controls/canvas-controls.config"
import { useDarkMode } from "./DarkModeProvider"

const buttonStyle: CSSProperties = {
  width: TRIGGER_SIZE,
  height: TRIGGER_SIZE,
  borderRadius: "var(--radius-full)",
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border-primary)",
  color: "var(--color-text-tertiary)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  pointerEvents: "auto",
  boxShadow: "var(--shadow-small)",
  transition:
    "background-color var(--duration-micro) ease, color var(--duration-micro) ease, border-color var(--duration-micro) ease",
}

const iconSlotStyle: CSSProperties = {
  position: "relative",
  width: TRIGGER_ICON,
  height: TRIGGER_ICON,
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

const iconLayerVariants = {
  initial: { opacity: 0, filter: "blur(0.5px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(0.5px)" },
}

const iconLayerTransition = {
  duration: 0.15,
  ease: [0.32, 0.72, 0, 1] as const,
}

export function DarkModeTrigger() {
  const { isDark, toggle } = useDarkMode()
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <button type="button" aria-label={label} style={buttonStyle} onClick={toggle}>
      <span style={iconSlotStyle}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={isDark ? "asleep" : "light"}
            style={iconLayerStyle}
            variants={iconLayerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={iconLayerTransition}
          >
            {isDark ? <Asleep size={TRIGGER_ICON} /> : <Light size={TRIGGER_ICON} />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}
