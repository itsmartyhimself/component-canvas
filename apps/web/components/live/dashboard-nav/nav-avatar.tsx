"use client"

// TODO: ROADMAP §Dashboard — wire to Supabase Auth session user.
export function NavAvatar() {
  return (
    <span
      aria-label="Account"
      style={{
        display: "inline-block",
        width: 36,
        height: 36,
        borderRadius: "var(--radius-full)",
        background: "var(--gradient-dusk)",
        flexShrink: 0,
      }}
    />
  )
}
