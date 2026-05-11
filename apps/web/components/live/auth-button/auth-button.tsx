"use client"

import { Button } from "@/components/live/button"
import { GithubMark } from "./github-mark"
import { GoogleMark } from "./google-mark"

export type AuthProvider = "github" | "google"

interface AuthButtonProps {
  provider: AuthProvider
  onClick?: () => void
  href?: string
  fill?: boolean
}

export function AuthButton({
  provider,
  onClick,
  href,
  fill = true,
}: AuthButtonProps) {
  if (provider === "github") {
    return (
      <Button
        variant="pop"
        size="medium"
        form="label"
        label="Continue with GitHub"
        icon={<GithubMark size={16} />}
        onClick={onClick}
        href={href}
        fill={fill}
      />
    )
  }
  return (
    <Button
      variant="primary"
      size="medium"
      form="label"
      label="Continue with Google"
      icon={<GoogleMark size={18} />}
      onClick={onClick}
      href={href}
      fill={fill}
    />
  )
}
