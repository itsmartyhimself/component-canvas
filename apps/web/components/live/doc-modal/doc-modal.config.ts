export const DOC_TITLES: Record<string, string> = {
  "getting-started": "Getting Started",
  changelog: "Changelog",
  "doc-colors": "Colors",
  "doc-typography": "Typography",
  "doc-spacing": "Spacing",
  "doc-motion": "Motion",
}

export const DOC_BODIES: Record<string, string> = {
  "getting-started":
    "Welcome to Component Canvas. Browse components from the left sidebar and preview them on the canvas.",
  changelog:
    "Changelog placeholder. Release notes will live here once we ship to an audience.",
  "doc-colors":
    "Semantic color tokens: bg-primary, bg-secondary, bg-tertiary, text-primary, text-secondary, text-tertiary, border-primary, border-secondary.",
  "doc-typography":
    "Type scale .type-1 (8px) through .type-13 (48px). Apply .text-trim when the parent isn't height-constrained.",
  "doc-spacing":
    "Spacing scale --spacing-0 through --spacing-16 on a 4px + 8px rhythm. Use var() in inline styles, never raw px.",
  "doc-motion":
    "Motion placeholder. Framer Motion + prefers-reduced-motion rules live here.",
}

export function resolveDocTitle(id: string): string {
  return DOC_TITLES[id] ?? "Document"
}

export function resolveDocBody(id: string): string {
  return DOC_BODIES[id] ?? "Stub doc body."
}
