import type { ReactNode } from "react"

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-full flex-1 items-center justify-center"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      {children}
    </div>
  )
}
