"use client"

import { useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/imports/shadcn/dialog"
import { workspaceForRepo } from "@/lib/dashboard/demo"
import type { RepoConnection } from "@/lib/dashboard/types"
import { SearchModalDefault } from "./search-modal-default"
import { SearchModalInput } from "./search-modal-input"
import { SearchModalResults } from "./search-modal-results"
import {
  SEARCH_MODAL_MAX_HEIGHT_PX,
  SEARCH_MODAL_MAX_HEIGHT_VH,
  SEARCH_MODAL_MIN_HEIGHT_PX,
  SEARCH_MODAL_WIDTH,
} from "./search-modal.config"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const contentStyle: CSSProperties = {
  width: SEARCH_MODAL_WIDTH,
  boxShadow: "var(--shadow-layered)",
}

const scrollRegionStyle: CSSProperties = {
  overflowY: "auto",
  maxHeight: `min(${SEARCH_MODAL_MAX_HEIGHT_VH}vh, ${SEARCH_MODAL_MAX_HEIGHT_PX}px)`,
  minHeight: SEARCH_MODAL_MIN_HEIGHT_PX,
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  // Controlled cmdk selection: kept at "" until the user actually arrow-keys.
  // Without this, cmdk auto-selects the first row on mount AND any mouse hover
  // sticks as data-selected even after the cursor leaves — both read as
  // "one row is always highlighted", which is wrong for this surface.
  const [selected, setSelected] = useState("")
  const trimmed = query.trim()

  const handleSelect = (repo: RepoConnection) => {
    onOpenChange(false)
    setQuery("")
    setSelected("")
    const workspace = workspaceForRepo(repo.id)
    const primaryBranch =
      repo.branches.find((b) => b.primary)?.name ??
      repo.branches[0]?.name ??
      "main"
    const repoName = repo.orgRepo.split("/")[1]
    router.push(
      `/${workspace.name.toLowerCase()}/${repoName}/${primaryBranch}`,
    )
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery("")
      setSelected("")
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="max-w-[calc(100vw-32px)] gap-0 p-0 overflow-hidden rounded-[var(--radius-4)] border-[var(--color-border-primary)] bg-[var(--color-bg-elevated)] sm:max-w-none"
        style={contentStyle}
      >
        <DialogTitle className="sr-only">Search repos</DialogTitle>
        <Command
          shouldFilter={false}
          label="Search repos"
          value={selected}
          onValueChange={setSelected}
          disablePointerSelection
        >
          <SearchModalInput value={query} onValueChange={setQuery} />
          <div style={scrollRegionStyle} onMouseLeave={() => setSelected("")}>
            {trimmed.length === 0 ? (
              <SearchModalDefault onSelect={handleSelect} />
            ) : (
              <SearchModalResults query={query} onSelect={handleSelect} />
            )}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
