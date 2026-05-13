"use client"

import { type CSSProperties } from "react"
import { Command } from "cmdk"

interface SearchModalInputProps {
  value: string
  onValueChange: (value: string) => void
}

const wrapperStyle: CSSProperties = {
  paddingBlock: "var(--spacing-6)",
  paddingInline: "var(--spacing-5)",
  borderBottom: "1px solid var(--color-bg-tertiary)",
  background: "var(--color-bg-elevated)",
}

const inputStyle: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: 0,
  outline: "none",
  color: "var(--color-text-primary)",
}

export function SearchModalInput({ value, onValueChange }: SearchModalInputProps) {
  return (
    <div style={wrapperStyle}>
      <Command.Input
        value={value}
        onValueChange={onValueChange}
        placeholder="Search repos and branches"
        className="type-6 placeholder:text-[var(--color-text-tertiary)]"
        style={inputStyle}
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  )
}
