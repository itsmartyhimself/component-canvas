"use client"

import { useState, type CSSProperties } from "react"

import { GithubMark } from "./github-mark"
import { GoogleMark } from "./google-mark"

export type AuthProvider = "github" | "google"

interface AuthButtonProps {
  provider: AuthProvider
  onClick?: () => void
  href?: string
}

export function AuthButton({ provider, onClick, href }: AuthButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const icon =
    provider === "github" ? <GithubMark size={16} /> : <GoogleMark size={18} />
  const label =
    provider === "github" ? "Continue with GitHub" : "Continue with Google"

  const rootStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 44,
    gap: "var(--spacing-3)",
    paddingInline: "var(--spacing-5)",
    borderRadius: "var(--radius-4)",
    background: isHovered
      ? "var(--color-bg-hover-elevated)"
      : "var(--color-bg-primary)",
    color: "var(--color-text-secondary)",
    textDecoration: "none",
    cursor: "pointer",
  }

  const hoverHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  const content = (
    <>
      {icon}
      <span className="type-4 font-medium">{label}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} onClick={onClick} style={rootStyle} {...hoverHandlers}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} style={rootStyle} {...hoverHandlers}>
      {content}
    </button>
  )
}
