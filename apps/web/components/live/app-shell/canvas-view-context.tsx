"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"

export type CanvasView = { x: number; y: number; zoom: number }
export type ContentBbox = { width: number; height: number }

export const ZOOM_MIN = 0.1
export const ZOOM_MAX = 4
export const FIT_MARGIN = 0.24
// TODO(ROADMAP: Canvas → size-aware fit margin): replace FIT_MARGIN with a
// function of bbox size so tiny components don't scale to fill the viewport.
const MIN_VISIBLE_RATIO = 0.2

const clampZoom = (z: number) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z))

type CanvasViewContextValue = {
  view: CanvasView
  isAnimating: boolean
  viewportRef: RefObject<HTMLDivElement | null>
  contentBboxRef: RefObject<ContentBbox | null>
  setContentBbox: (bbox: ContentBbox) => void
  panBy: (dx: number, dy: number) => void
  zoomAt: (clientX: number, clientY: number, nextZoom: number) => void
  zoomByAt: (factor: number, clientX: number, clientY: number) => void
  zoomByAtCenter: (factor: number) => void
  reset: () => void
  fitToContent: () => void
  endAnimation: () => void
}

const CanvasViewContext = createContext<CanvasViewContextValue | null>(null)

export function useCanvasView() {
  const ctx = useContext(CanvasViewContext)
  if (!ctx) {
    throw new Error("useCanvasView must be used inside CanvasViewProvider")
  }
  return ctx
}

export function CanvasViewProvider({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const contentBboxRef = useRef<ContentBbox | null>(null)
  const [view, setView] = useState<CanvasView>({ x: 0, y: 0, zoom: 1 })
  const [isAnimating, setIsAnimating] = useState(false)

  const getViewportSize = useCallback((): { width: number; height: number } | null => {
    const el = viewportRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    return { width: rect.width, height: rect.height }
  }, [])

  const computeFit = useCallback(
    (bbox: ContentBbox): CanvasView => {
      const size = getViewportSize()
      if (!size) return { x: 0, y: 0, zoom: 1 }
      const zoomX = (size.width * (1 - 2 * FIT_MARGIN)) / Math.max(bbox.width, 1)
      const zoomY = (size.height * (1 - 2 * FIT_MARGIN)) / Math.max(bbox.height, 1)
      const zoom = clampZoom(Math.min(zoomX, zoomY))
      return { x: size.width / 2, y: size.height / 2, zoom }
    },
    [getViewportSize],
  )

  const applyPanBounds = useCallback((next: CanvasView): CanvasView => {
    const size = getViewportSize()
    const bbox = contentBboxRef.current
    if (!size || !bbox) return next
    const halfW = (bbox.width * next.zoom) / 2
    const halfH = (bbox.height * next.zoom) / 2
    const keepW = Math.max(halfW * 2 * MIN_VISIBLE_RATIO, 1)
    const keepH = Math.max(halfH * 2 * MIN_VISIBLE_RATIO, 1)
    const xMin = keepW - halfW
    const xMax = size.width - keepW + halfW
    const yMin = keepH - halfH
    const yMax = size.height - keepH + halfH
    return {
      ...next,
      x: Math.max(xMin, Math.min(xMax, next.x)),
      y: Math.max(yMin, Math.min(yMax, next.y)),
    }
  }, [getViewportSize])

  const setContentBbox = useCallback(
    (bbox: ContentBbox) => {
      contentBboxRef.current = bbox
      setIsAnimating(true)
      setView(computeFit(bbox))
    },
    [computeFit],
  )

  const panBy = useCallback(
    (dx: number, dy: number) => {
      setIsAnimating(false)
      setView((v) => applyPanBounds({ ...v, x: v.x + dx, y: v.y + dy }))
    },
    [applyPanBounds],
  )

  const zoomAt = useCallback(
    (cx: number, cy: number, nextZoom: number) => {
      setIsAnimating(false)
      setView((v) => {
        const z = clampZoom(nextZoom)
        if (z === v.zoom) return v
        const wx = (cx - v.x) / v.zoom
        const wy = (cy - v.y) / v.zoom
        return applyPanBounds({ x: cx - wx * z, y: cy - wy * z, zoom: z })
      })
    },
    [applyPanBounds],
  )

  const zoomByAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      setIsAnimating(false)
      setView((v) => {
        const z = clampZoom(v.zoom * factor)
        if (z === v.zoom) return v
        const wx = (cx - v.x) / v.zoom
        const wy = (cy - v.y) / v.zoom
        return applyPanBounds({ x: cx - wx * z, y: cy - wy * z, zoom: z })
      })
    },
    [applyPanBounds],
  )

  const zoomByAtCenter = useCallback(
    (factor: number) => {
      const size = getViewportSize()
      if (!size) return
      setIsAnimating(true)
      setView((v) => {
        const z = clampZoom(v.zoom * factor)
        if (z === v.zoom) return v
        const cx = size.width / 2
        const cy = size.height / 2
        const wx = (cx - v.x) / v.zoom
        const wy = (cy - v.y) / v.zoom
        return applyPanBounds({ x: cx - wx * z, y: cy - wy * z, zoom: z })
      })
    },
    [getViewportSize, applyPanBounds],
  )

  const reset = useCallback(() => {
    const size = getViewportSize()
    if (!size) return
    setIsAnimating(true)
    setView({ x: size.width / 2, y: size.height / 2, zoom: 1 })
  }, [getViewportSize])

  const fitToContent = useCallback(() => {
    const bbox = contentBboxRef.current
    if (!bbox) return
    setIsAnimating(true)
    setView(computeFit(bbox))
  }, [computeFit])

  const endAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const value = useMemo<CanvasViewContextValue>(
    () => ({
      view,
      isAnimating,
      viewportRef,
      contentBboxRef,
      setContentBbox,
      panBy,
      zoomAt,
      zoomByAt,
      zoomByAtCenter,
      reset,
      fitToContent,
      endAnimation,
    }),
    [
      view,
      isAnimating,
      setContentBbox,
      panBy,
      zoomAt,
      zoomByAt,
      zoomByAtCenter,
      reset,
      fitToContent,
      endAnimation,
    ],
  )

  return <CanvasViewContext.Provider value={value}>{children}</CanvasViewContext.Provider>
}
