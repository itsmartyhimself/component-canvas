export default function Home() {
  return (
    <main
      className="flex flex-col"
      style={{ padding: "var(--spacing-10)", gap: "var(--spacing-6)" }}
    >
      <h1 className="type-13 text-trim">Component Canvas</h1>
      <p className="type-5 text-trim" style={{ maxWidth: "64ch" }}>
        An advanced component explorer. Scaffold online — typography, token plumbing, and
        cap-to-baseline trim wired up. Color system lands next.
      </p>
    </main>
  )
}
