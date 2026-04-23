"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { getManifest } from "@/lib/registry/manifests"
import type { AnyComponentManifest } from "@/lib/registry/manifest-types"

type PropMap = Record<string, unknown>

type CanvasControlsContextValue = {
  manifest: AnyComponentManifest | null
  props: PropMap
  setProp: (key: string, value: unknown) => void
  reset: () => void
}

const CanvasControlsContext = createContext<CanvasControlsContextValue | null>(null)

export function useCanvasControls() {
  const ctx = useContext(CanvasControlsContext)
  if (!ctx) {
    throw new Error("useCanvasControls must be used inside CanvasControlsProvider")
  }
  return ctx
}

export function CanvasControlsProvider({
  selectedId,
  children,
}: {
  selectedId: string | null
  children: ReactNode
}) {
  const manifest = useMemo(() => getManifest(selectedId), [selectedId])
  const [props, setProps] = useState<PropMap>(() =>
    manifest ? { ...(manifest.defaultProps as PropMap) } : {},
  )

  // Reset when selection (and therefore manifest) changes. Keying by id keeps
  // each component's prop state isolated and predictable.
  useEffect(() => {
    setProps(manifest ? { ...(manifest.defaultProps as PropMap) } : {})
  }, [manifest])

  const setProp = useCallback((key: string, value: unknown) => {
    setProps((prev) => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setProps(manifest ? { ...(manifest.defaultProps as PropMap) } : {})
  }, [manifest])

  const value = useMemo<CanvasControlsContextValue>(
    () => ({ manifest, props, setProp, reset }),
    [manifest, props, setProp, reset],
  )

  return (
    <CanvasControlsContext.Provider value={value}>
      {children}
    </CanvasControlsContext.Provider>
  )
}
