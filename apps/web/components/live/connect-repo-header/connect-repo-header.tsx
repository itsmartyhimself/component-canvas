export function ConnectRepoHeader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--spacing-4)",
        padding: "var(--spacing-10) var(--spacing-16)",
        borderRadius: "var(--radius-4)",
        background: "var(--gradient-daylight)",
        border: "1px solid var(--color-bg-secondary)",
      }}
    >
      <h1
        className="type-8 font-medium"
        style={{
          margin: 0,
          color: "var(--color-text-primary)",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        Connect a repo
      </h1>
      <p
        className="type-4"
        style={{
          margin: 0,
          color: "var(--color-text-secondary)",
          textAlign: "center",
          lineHeight: 1.5,
          width: "100%",
        }}
      >
        Component Canvas reads your repo through the GitHub App, builds each
        component, and streams the live result to the dashboard.
      </p>
    </div>
  )
}
