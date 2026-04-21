"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type Ref,
} from "react"
import { Search } from "@carbon/icons-react"
import { cn } from "@/lib/utils"
import {
  SEARCH_INPUT_HEIGHT,
  SEARCH_INPUT_ICON_SIZE,
  SEARCH_INPUT_RADIUS,
  SEARCH_KBD_SIZE,
} from "./search-input.config"

export interface SearchInputProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  focusHotkey?: string | false
  className?: string
  showKbd?: boolean
  ariaLabel?: string
}

const wrapperStyle: CSSProperties = {
  position: "relative",
  height: SEARCH_INPUT_HEIGHT,
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-3)",
  padding: "0 var(--spacing-3)",
  borderRadius: SEARCH_INPUT_RADIUS,
  border: "1px solid var(--color-border-primary)",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  transition: "border-color 120ms ease, background-color 120ms ease",
}

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  background: "transparent",
  color: "inherit",
  outline: "none",
  border: "none",
  padding: 0,
}

const kbdStyle: CSSProperties = {
  width: SEARCH_KBD_SIZE,
  height: SEARCH_KBD_SIZE,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius-1-5)",
  border: "1px solid var(--color-border-primary)",
  color: "var(--color-text-tertiary)",
  background: "var(--color-bg-primary)",
  flexShrink: 0,
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
  if (target.isContentEditable) return true
  return false
}

export const SearchInput = forwardRef(function SearchInput(
  props: SearchInputProps,
  ref: Ref<HTMLInputElement>,
) {
  const {
    value,
    onValueChange,
    placeholder = "Search",
    disabled = false,
    autoFocus = false,
    focusHotkey = "/",
    className,
    showKbd = true,
    ariaLabel,
  } = props

  const inputRef = useRef<HTMLInputElement | null>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!focusHotkey || disabled) return
    const handler = (event: KeyboardEvent) => {
      if (event.key !== focusHotkey) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      event.preventDefault()
      focusInput()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [focusHotkey, focusInput, disabled])

  return (
    <div
      className={cn(className)}
      style={{
        ...wrapperStyle,
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "not-allowed" : "text",
      }}
      onClick={() => {
        if (!disabled) focusInput()
      }}
    >
      <span
        style={{
          width: SEARCH_INPUT_ICON_SIZE,
          height: SEARCH_INPUT_ICON_SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-secondary)",
          flexShrink: 0,
        }}
      >
        <Search size={16} />
      </span>
      <input
        ref={inputRef}
        className="type-3"
        style={inputStyle}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel ?? placeholder}
      />
      {showKbd && focusHotkey && !disabled ? (
        <span className="type-2" style={kbdStyle} aria-hidden>
          {focusHotkey}
        </span>
      ) : null}
    </div>
  )
})

SearchInput.displayName = "SearchInput"
