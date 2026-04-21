export function Canvas() {
  return (
    <section
      className="relative flex-1 overflow-hidden"
      style={{
        borderRadius: "var(--radius-6)",
        background: "var(--color-bg-primary)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="type-4 text-trim"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Select a component to preview
          </p>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none" />
    </section>
  )
}
