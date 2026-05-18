import { AuthButton } from "@/components/live/auth-button"
import { HeroCard } from "@/components/live/hero-card"

export function LoginScreen() {
  return (
    <HeroCard
      brand={
        <span
          role="img"
          aria-label="Mount"
          style={{
            display: "inline-block",
            height: 20,
            width: "calc(20px * 119 / 24)",
            backgroundColor: "var(--color-text-primary)",
            WebkitMaskImage: "url(/SVGs/mount-wordmark.svg)",
            maskImage: "url(/SVGs/mount-wordmark.svg)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />
      }
      title="Sign in and connect your repo"
      subtitle="Browse, preview and share live components from your GitHub repo."
      legal={
        <>
          By signing in you agree to the Terms of Service and Privacy Policy.
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-2)",
          padding: "var(--spacing-2)",
          background: "var(--color-bg-tertiary)",
          borderRadius: "var(--radius-5)",
        }}
      >
        <AuthButton provider="github" href="/" />
        <AuthButton provider="google" href="/" />
      </div>
    </HeroCard>
  )
}
