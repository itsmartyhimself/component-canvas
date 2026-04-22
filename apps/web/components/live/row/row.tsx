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
import { CARBON_ICONS } from "@/lib/icons/registry"
import { cn } from "@/lib/utils"
import {
  DEFAULT_SIZE_FOR_VARIANT,
  ROW_DIMENSIONS,
  ROW_ICON_SIZE,
  ROW_STATE,
  ROW_TRANSITION,
  type RowLeading,
  type RowProps,
  type RowStateStyle,
  type RowTrailing,
} from "./row.config"

function resolveState(
  { hovered, active, expanded, disabled, loading }: {
    hovered: boolean
    active: boolean
    expanded: boolean
    disabled: boolean
    loading: boolean
  },
): RowStateStyle {
  if (loading) return ROW_STATE.loading
  if (disabled) return ROW_STATE.disabled
  if (active) return ROW_STATE.active
  if (hovered) return ROW_STATE.hover
  if (expanded) return ROW_STATE.expanded
  return ROW_STATE.default
}

function renderLeading(
  leading: RowLeading,
  iconColor: string,
  foreground: string,
): ReactNode {
  if (leading.kind === "none") return null
  const slotStyle: CSSProperties = {
    width: ROW_ICON_SIZE,
    height: ROW_ICON_SIZE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: iconColor,
  }
  switch (leading.kind) {
    case "icon": {
      const IconComp = CARBON_ICONS[leading.icon]
      return (
        <span style={slotStyle}>
          <IconComp size={16} />
        </span>
      )
    }
    case "folder": {
      const IconComp = leading.expanded
        ? CARBON_ICONS["folder-open"]
        : CARBON_ICONS.folder
      return (
        <span style={slotStyle}>
          <IconComp size={16} />
        </span>
      )
    }
    case "dot":
      return (
        <span style={slotStyle}>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "var(--radius-full)",
              background: iconColor,
            }}
          />
        </span>
      )
    case "initial":
      return (
        <span
          style={{
            ...slotStyle,
            color: foreground,
            borderRadius: "var(--radius-full)",
            background: "var(--color-bg-tertiary)",
          }}
          className="type-2"
        >
          {leading.letter}
        </span>
      )
    default:
      return null
  }
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
        <span
          style={{
            width: ROW_ICON_SIZE,
            height: ROW_ICON_SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: iconColor,
            transform: trailing.expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 120ms ease",
          }}
        >
          <IconComp size={16} />
        </span>
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

function RowBase(props: RowProps, ref: Ref<HTMLButtonElement | HTMLAnchorElement>) {
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
    href,
    ariaLabel,
    className,
    ...rest
  } = props

  const size = sizeProp ?? DEFAULT_SIZE_FOR_VARIANT[variant]
  const dims = ROW_DIMENSIONS[size]
  const [hovered, setHovered] = useState(false)
  const state = resolveState({
    hovered: hovered && !editing,
    active,
    expanded,
    disabled,
    loading,
  })

  const rootStyle: CSSProperties = {
    height: dims.height,
    padding: `${dims.paddingY} ${dims.paddingX}`,
    borderRadius: dims.radius,
    gap: dims.gap,
    background: state.background,
    color: state.foreground,
    fontWeight: state.fontWeight,
    transition: ROW_TRANSITION,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.75 : 1,
    width: "100%",
    textAlign: "left" as const,
  }

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
      }}
    />
  ) : (
    <span
      className={cn(dims.typeClass, "min-w-0 flex-1 truncate")}
      style={{ color: state.foreground, fontWeight: state.fontWeight }}
    >
      {label}
    </span>
  )

  const inner = (
    <>
      {renderLeading(leading, state.iconColor, state.foreground)}
      {labelNode}
      {renderTrailing(trailing, state.iconColor, state.foreground)}
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
