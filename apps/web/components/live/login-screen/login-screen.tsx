import { AuthButton } from "@/components/live/auth-button"
import { HeroCard } from "@/components/live/hero-card"

export function LoginScreen() {
  return (
    <HeroCard
      brand={<LoginBrandPill />}
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

function LoginBrandPill() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--spacing-3)",
        height: 36,
        paddingInline: "var(--spacing-4)",
        borderRadius: "var(--radius-full)",
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border-secondary)",
        color: "var(--color-text-primary)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 20,
          height: 20,
          borderRadius: "var(--radius-1-5)",
          background: "var(--gradient-dusk)",
        }}
      />
      <span className="type-4 font-medium">Component Canvas</span>
    </span>
  )
}
