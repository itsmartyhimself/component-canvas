"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react"
import { Close } from "@carbon/icons-react"
import { Toaster, toast } from "sonner"
import { StatusDot } from "@/components/live/status-dot"

export type ToastTone = "default" | "success" | "error"

interface ShowToastOptions {
  title: string
  tone?: ToastTone
  action?: {
    label: string
    onClick?: () => void
  }
  duration?: number
}

interface ToastContextValue {
  showToast: (opts: ShowToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_WIDTH = 320

const toastSurface = {
  width: TOAST_WIDTH,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--spacing-4)",
  padding: "var(--spacing-4) var(--spacing-5)",
  borderRadius: "var(--radius-4)",
  background: "var(--color-text-primary)",
  color: "var(--color-bg-primary)",
  boxShadow: "0 8px 24px rgba(18, 17, 17, 0.24)",
} as const

function ToastBody({
  id,
  title,
  tone = "default",
  action,
}: {
  id: string | number
  title: string
  tone?: ToastTone
  action?: ShowToastOptions["action"]
}) {
  const showDot = tone !== "default"
  const showClose = tone !== "default"
  const showAction = !!action

  return (
    <div style={toastSurface} role="status">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-3)",
          flex: 1,
          minWidth: 0,
        }}
      >
        {showDot ? (
          <StatusDot
            tone={tone === "success" ? "success" : "danger"}
            variant="solid"
            size={8}
          />
        ) : null}
        <span
          className="type-4"
          style={{
            color: "var(--color-bg-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-3)",
          flexShrink: 0,
        }}
      >
        {showAction ? (
          <button
            type="button"
            className="type-3 font-medium"
            style={{
              color: "var(--color-bg-primary)",
              cursor: "pointer",
            }}
            onClick={() => {
              action?.onClick?.()
              toast.dismiss(id)
            }}
          >
            {action!.label}
          </button>
        ) : null}
        {showClose ? (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => toast.dismiss(id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-tertiary)",
              cursor: "pointer",
            }}
          >
            <Close size={14} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = useCallback((opts: ShowToastOptions) => {
    toast.custom(
      (id) => (
        <ToastBody
          id={id}
          title={opts.title}
          tone={opts.tone}
          action={opts.action}
        />
      ),
      { duration: opts.duration ?? 5_000 },
    )
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          style: {
            width: TOAST_WIDTH,
            background: "transparent",
            border: 0,
            padding: 0,
            boxShadow: "none",
          },
        }}
      />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>")
  }
  return ctx
}
