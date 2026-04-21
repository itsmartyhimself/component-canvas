import type { FolderRecord, LeafRecord, Registry } from "./types"

export interface SearchMatch {
  leaves: Set<string>
  folders: Set<string>
  ancestors: Set<string>
}

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

function score(name: string, query: string): number {
  const lower = name.toLowerCase()
  if (lower === query) return 3
  if (lower.startsWith(query)) return 2
  if (lower.includes(query)) return 1
  return 0
}

export function searchRegistry(
  registry: Registry,
  rawQuery: string,
): SearchMatch | null {
  const query = normalizeQuery(rawQuery)
  if (!query) return null

  const leaves = new Set<string>()
  const folders = new Set<string>()
  const ancestors = new Set<string>()

  const folderById = new Map<string, FolderRecord>()
  for (const folder of registry.folders) folderById.set(folder.id, folder)

  const addFolderAncestry = (folder: FolderRecord) => {
    ancestors.add(folder.id)
    let current: FolderRecord | undefined = folder
    while (current?.parentId) {
      const parent = folderById.get(current.parentId)
      if (!parent) break
      ancestors.add(parent.id)
      current = parent
    }
  }

  for (const folder of registry.folders) {
    if (score(folder.name, query) > 0) {
      folders.add(folder.id)
      addFolderAncestry(folder)
    }
  }

  for (const leaf of registry.leaves) {
    if (score(leaf.name, query) > 0) {
      leaves.add(leaf.id)
      if (leaf.folderId) {
        const parent = folderById.get(leaf.folderId)
        if (parent) addFolderAncestry(parent)
      }
    }
  }

  return { leaves, folders, ancestors }
}

export function rankLeaves(leaves: LeafRecord[], rawQuery: string): LeafRecord[] {
  const query = normalizeQuery(rawQuery)
  if (!query) return leaves
  return [...leaves]
    .map((leaf) => ({ leaf, score: score(leaf.name, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.leaf.name.localeCompare(b.leaf.name)
    })
    .map((entry) => entry.leaf)
}
