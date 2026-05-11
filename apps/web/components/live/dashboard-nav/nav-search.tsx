"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { Search } from "@carbon/icons-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/imports/shadcn/command"
import { CmndMark } from "./cmnd-mark"
import { KMark } from "./k-mark"

const containerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-3)",
  width: 480,
  maxWidth: "100%",
  height: 36,
  paddingInline: "var(--spacing-4)",
  borderRadius: "var(--radius-3)",
  border: "1px solid var(--color-border-primary)",
  background: "var(--color-bg-elevated)",
  color: "var(--color-text-tertiary)",
  cursor: "pointer",
  transition: "border-color 120ms ease",
}

const kbdStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  height: 16,
  paddingInline: "var(--spacing-2)",
  borderRadius: "var(--radius-1)",
  background: "var(--color-bg-tertiary)",
  border: "1px solid var(--color-border-primary)",
  color: "var(--color-text-tertiary)",
}

const KBD_GLYPH_HEIGHT = 8

export function NavSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={containerStyle}
        aria-label="Open command palette"
      >
        <Search size={16} style={{ flexShrink: 0 }} />
        <span className="type-4" style={{ flex: 1, textAlign: "left" }}>
          Search repos, branches, components…
        </span>
        <span style={kbdStyle} aria-hidden>
          <CmndMark height={KBD_GLYPH_HEIGHT} />
          <KMark height={KBD_GLYPH_HEIGHT} />
        </span>
      </button>
      {/* TODO: ROADMAP §Dashboard — populate command palette with real repo/branch/component search. */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search repos, branches, components…" />
        <CommandList>
          <CommandEmpty>No results. The palette ships in v2.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => {
                setOpen(false)
                window.location.href = "/connect"
              }}
            >
              Connect a new repo
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                window.location.href = "/playground"
              }}
            >
              Open component specimens
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
