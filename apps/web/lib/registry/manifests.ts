import { buttonManifest } from "@/components/live/button/button.manifest"
import type { AnyComponentManifest } from "./manifest-types"

const REGISTRY: AnyComponentManifest[] = [buttonManifest]

export const MANIFESTS: Record<string, AnyComponentManifest> = Object.fromEntries(
  REGISTRY.map((m) => [m.id, m]),
)

export function getManifest(id: string | null | undefined): AnyComponentManifest | null {
  if (!id) return null
  return MANIFESTS[id] ?? null
}
