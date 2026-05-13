"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

interface DarkModeContextValue {
  isDark: boolean
  toggle: () => void
}

const DarkModeContext = createContext<DarkModeContextValue | null>(null)

// State source of truth lives on <html class="dark">. The inline script in
// layout.tsx sets that class before first paint from localStorage / system
// pref, so the cascade is correct on initial render.

// Strip transitions globally for the duration of a theme swap. Without this,
// every element with a color/bg transition animates during the swap and the
// flip looks smeared. requestAnimationFrame isn't reliable here —
// getComputedStyle forces all stylesheets to apply before we restore.
function instantThemeSwap(swap: () => void) {
  if (typeof document === "undefined") {
    swap()
    return
  }
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none !important;}",
    ),
  )
  document.head.appendChild(style)
  swap()
  void window.getComputedStyle(style).opacity
  document.head.removeChild(style)
}

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    function onSystemChange(e: MediaQueryListEvent) {
      if (localStorage.getItem("theme")) return
      const dark = e.matches
      instantThemeSwap(() => {
        setIsDark(dark)
        document.documentElement.classList.toggle("dark", dark)
      })
    }
    mq.addEventListener("change", onSystemChange)
    return () => mq.removeEventListener("change", onSystemChange)
  }, [])

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      instantThemeSwap(() => {
        document.documentElement.classList.toggle("dark", next)
        localStorage.setItem("theme", next ? "dark" : "light")
      })
      return next
    })
  }, [])

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext)
  if (!ctx) throw new Error("useDarkMode must be used inside DarkModeProvider")
  return ctx
}
