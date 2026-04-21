"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { DEMO_REGISTRY } from "@/lib/registry/data"

export function CanvasStage() {
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("component")

  const selected = useMemo(() => {
    if (!selectedId) return null
    return DEMO_REGISTRY.leaves.find((leaf) => leaf.id === selectedId) ?? null
  }, [selectedId])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {selected ? (
          <div className="flex flex-col items-center" style={{ gap: "var(--spacing-3)" }}>
            <p className="type-5 text-trim" style={{ color: "var(--color-text-primary)" }}>
              {selected.name}
            </p>
            <p
              className="type-3 text-trim"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {selected.id}
            </p>
          </div>
        ) : (
          <p
            className="type-4 text-trim"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Select a component to preview
          </p>
        )}
      </div>
    </div>
  )
}
