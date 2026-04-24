"use client"

import {
  forwardRef,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react"
import { SlidersHorizontal } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/imports/shadcn/tooltip"
import {
  TRIGGER_ACTIVE_BG,
  TRIGGER_ICON,
  TRIGGER_SIZE,
} from "./canvas-controls.config"

type PropertiesTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  open: boolean
}

const tooltipStyle: CSSProperties = {
  background: "var(--color-text-primary)",
  color: "var(--color-bg-primary)",
  padding: "6px 10px",
  borderRadius: "var(--radius-2)",
  border: "none",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1,
}

export const PropertiesTrigger = forwardRef<HTMLButtonElement, PropertiesTriggerProps>(
  function PropertiesTrigger({ open, ...rest }, ref) {
    const [hovered, setHovered] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
      if (open || !hovered) {
        setShowTooltip(false)
        return
      }
      const id = setTimeout(() => setShowTooltip(true), 120)
      return () => clearTimeout(id)
    }, [open, hovered])

    const background = open ? TRIGGER_ACTIVE_BG : "var(--color-bg-primary)"
    const iconColor = open
      ? "var(--color-bg-primary)"
      : "var(--color-text-tertiary)"
    const borderColor = open ? TRIGGER_ACTIVE_BG : "var(--color-border-primary)"

    const style: CSSProperties = {
      width: TRIGGER_SIZE,
      height: TRIGGER_SIZE,
      borderRadius: "var(--radius-full)",
      background,
      border: `1px solid ${borderColor}`,
      color: iconColor,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      pointerEvents: "auto",
      boxShadow: "var(--shadow-small)",
      transition:
        "background-color var(--duration-micro) ease, color var(--duration-micro) ease, border-color var(--duration-micro) ease",
    }

    return (
      <TooltipProvider delayDuration={120}>
        <Tooltip open={showTooltip}>
          <TooltipTrigger asChild>
            <button
              {...rest}
              ref={ref}
              type="button"
              aria-label="Properties"
              style={style}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <SlidersHorizontal size={TRIGGER_ICON} />
            </button>
          </TooltipTrigger>
          {!open && (
            <TooltipContent side="left" sideOffset={8} style={tooltipStyle}>
              Properties
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  },
)
