"use client"

import {
  forwardRef,
  useCallback,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CARBON_ICONS } from "@/lib/icons/registry"
import { cn } from "@/lib/utils"
import {
  DEFAULT_SIZE_FOR_VARIANT,
  ROW_DIMENSIONS,
  ROW_ICON_SIZE,
  ROW_SPRING,
  ROW_STATE,
  type RowLeading,
  type RowProps,
  type RowStateStyle,
  type RowTrailing,
} from "./row.config"

function resolveState({
  hovered,
  active,
  expanded,
  disabled,
  loading,
}: {
  hovered: boolean
  active: boolean
  expanded: boolean
  disabled: boolean
  loading: boolean
}): RowStateStyle {
  if (loading) return ROW_STATE.loading
  if (disabled) return ROW_STATE.disabled
  if (active) return ROW_STATE.active
  if (hovered) return ROW_STATE.hover
  if (expanded) return ROW_STATE.expanded
  return ROW_STATE.default
}

function leadingIdentity(leading: RowLeading): string {
  switch (leading.kind) {
    case "icon":
      return `icon:${leading.icon}`
    case "folder":
      return `folder:${leading.expanded ? "open" : "closed"}`
    case "dot":
      return "dot"
    case "initial":
      return `initial:${leading.letter}`
    default:
      return "none"
  }
}

function renderLeadingNode(
  leading: RowLeading,
  iconColor: string,
  foreground: string,
): ReactNode {
  if (leading.kind === "none") return null
  switch (leading.kind) {
    case "icon": {
      const IconComp = CARBON_ICONS[leading.icon]
      return <IconComp size={16} />
    }
    case "folder": {
      const IconComp = leading.expanded
        ? CARBON_ICONS["folder-open"]
        : CARBON_ICONS.folder
      return <IconComp size={16} />
    }
    case "dot":
      return (
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: "var(--radius-full)",
            background: iconColor,
          }}
        />
      )
    case "initial":
      return (
        <span
          className="type-2"
          style={{
            width: "100%",
            height: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: foreground,
            borderRadius: "var(--radius-full)",
            background: "var(--color-bg-tertiary)",
          }}
        >
          {leading.letter}
        </span>
      )
    default:
      return null
  }
}

const iconLayerVariants = {
  initial: { opacity: 0, filter: "blur(0.5px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(0.5px)" },
}

const iconLayerTransition = { duration: 0.15, ease: [0.32, 0.72, 0, 1] as const }

function LeadingIconSlot({
  leading,
  iconColor,
  foreground,
}: {
  leading: RowLeading
  iconColor: string
  foreground: string
}) {
  if (leading.kind === "none") return null

  const identity = leadingIdentity(leading)
  const node = renderLeadingNode(leading, iconColor, foreground)

  const slotStyle: CSSProperties = {
    position: "relative",
    width: ROW_ICON_SIZE,
    height: ROW_ICON_SIZE,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: iconColor,
    transform: "translateY(2px)",
  }

  const layerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }

  return (
    <span style={slotStyle}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={identity}
          style={layerStyle}
          variants={iconLayerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={iconLayerTransition}
        >
          {node}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function renderTrailing(
  trailing: RowTrailing,
  iconColor: string,
  foreground: string,
): ReactNode {
  if (trailing.kind === "none") return null
  switch (trailing.kind) {
    case "chevron": {
      const IconComp = CARBON_ICONS["chevron-right"]
      return (
        <motion.span
          animate={{ rotate: trailing.expanded ? 90 : 0 }}
          transition={ROW_SPRING}
          style={{
            width: ROW_ICON_SIZE,
            height: ROW_ICON_SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: iconColor,
          }}
        >
          <IconComp size={16} />
        </motion.span>
      )
    }
    case "action":
      return <span className="flex items-center">{trailing.action}</span>
    case "badge":
      return (
        <span
          className="type-2 inline-flex items-center"
          style={{
            color: foreground,
            padding: "0 var(--spacing-2)",
            height: 16,
            borderRadius: "var(--radius-1-5)",
            background: "var(--color-bg-secondary)",
          }}
        >
          {trailing.content}
        </span>
      )
    case "kbd":
      return (
        <span
          className="type-2 inline-flex items-center justify-center"
          style={{
            color: foreground,
            width: 20,
            height: 20,
            borderRadius: "var(--radius-1-5)",
            border: "1px solid var(--color-border-primary)",
            background: "var(--color-bg-primary)",
          }}
        >
          {trailing.label}
        </span>
      )
    default:
      return null
  }
}

function RowBase(
  props: RowProps,
  ref: Ref<HTMLButtonElement | HTMLAnchorElement>,
) {
  const {
    label,
    size: sizeProp,
    variant = "menu-button",
    leading = { kind: "none" },
    trailing = { kind: "none" },
    active = false,
    expanded = false,
    editing = false,
    editDefaultValue,
    onCommitEdit,
    onCancelEdit,
    loading = false,
    disabled = false,
    onClick,
    onHoverChange,
    href,
    ariaLabel,
    className,
    ...rest
  } = props

  const size = sizeProp ?? DEFAULT_SIZE_FOR_VARIANT[variant]
  const dims = ROW_DIMENSIONS[size]
  const [internalHovered, setInternalHovered] = useState(false)
  const isHovered = internalHovered && !editing

  const state = resolveState({
    hovered: isHovered,
    active,
    expanded,
    disabled,
    loading,
  })

  const rootStyle: CSSProperties = {
    position: "relative",
    height: dims.height,
    padding: `${dims.paddingY} ${dims.paddingX}`,
    borderRadius: dims.radius,
    gap: dims.gap,
    background: state.background,
    color: state.foreground,
    transition:
      "color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard)",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.75 : 1,
    width: "100%",
    textAlign: "left" as const,
  }

  const handleMouseEnter = useCallback(() => {
    setInternalHovered(true)
    onHoverChange?.(true)
  }, [onHoverChange])

  const handleMouseLeave = useCallback(() => {
    setInternalHovered(false)
    onHoverChange?.(false)
  }, [onHoverChange])

  const handleCommit = useCallback(
    (value: string) => {
      if (onCommitEdit) onCommitEdit(value)
    },
    [onCommitEdit],
  )

  const handleEditKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault()
        handleCommit(event.currentTarget.value)
      } else if (event.key === "Escape") {
        event.preventDefault()
        if (onCancelEdit) onCancelEdit()
      }
    },
    [handleCommit, onCancelEdit],
  )


  const labelNode = editing ? (
    <input
      autoFocus
      defaultValue={editDefaultValue ?? label}
      placeholder="Folder name"
      onKeyDown={handleEditKeyDown}
      onBlur={(event) => handleCommit(event.currentTarget.value)}
      onClick={(event) => event.stopPropagation()}
      className={cn(dims.typeClass, "min-w-0 flex-1")}
      style={{
        color: state.foreground,
        background: "transparent",
        outline: "none",
        border: "0",
        padding: 0,
        position: "relative",
        zIndex: 1,
      }}
    />
  ) : (
    <span
      className={cn(dims.typeClass, "min-w-0 flex-1 truncate")}
      style={{
        color: state.foreground,
        position: "relative",
        zIndex: 1,
      }}
    >
      {label}
    </span>
  )

  const leadingNode = (
    <span style={{ position: "relative", zIndex: 1 }}>
      <LeadingIconSlot
        leading={leading}
        iconColor={state.iconColor}
        foreground={state.foreground}
      />
    </span>
  )

  const trailingNode = (
    <span style={{ position: "relative", zIndex: 1 }}>
      {renderTrailing(trailing, state.iconColor, state.foreground)}
    </span>
  )

  const inner = (
    <>
      {leadingNode}
      {labelNode}
      {trailingNode}
    </>
  )

  if (href) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
          className,
        )}
        style={rootStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(event) => {
          if (disabled || loading) {
            event.preventDefault()
            return
          }
          onClick?.(event)
        }}
        data-active={active || undefined}
        data-state={expanded ? "open" : "closed"}
        {...(rest as Record<string, unknown>)}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      aria-expanded={
        trailing.kind === "chevron" ? Boolean(trailing.expanded) : undefined
      }
      aria-disabled={disabled || loading || undefined}
      disabled={disabled || loading}
      className={cn(
        "flex items-center w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      style={rootStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(event) => {
        if (disabled || loading) return
        onClick?.(event)
      }}
      data-active={active || undefined}
      data-state={expanded ? "open" : "closed"}
      {...(rest as Record<string, unknown>)}
    >
      {inner}
    </button>
  )
}

export const Row = forwardRef(RowBase)
Row.displayName = "Row"
