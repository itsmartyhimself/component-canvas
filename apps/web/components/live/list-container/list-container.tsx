import type { CSSProperties, ReactNode } from "react"

interface ListContainerProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function ListContainer({ children, className, style }: ListContainerProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-1)",
        padding: "var(--spacing-1)",
        background: "var(--color-bg-tertiary)",
        borderRadius: "var(--radius-4-5)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
