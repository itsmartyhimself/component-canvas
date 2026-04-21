"use client"

// DEMO-ONLY — in-memory mutations via SidebarActions. Replace with server calls
// when the backend exists. See apps/web/ROADMAP.md → "Backend / Registry".

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type {
  FolderRecord,
  LeafRecord,
  Registry,
  SectionId,
} from "@/lib/registry/types"
import {
  DEMO_DEFAULT_HIDDEN_DOC_IDS,
  DEMO_REGISTRY,
} from "@/lib/registry/data"
import { searchRegistry, type SearchMatch } from "@/lib/registry/search"

const HIDDEN_DOCS_STORAGE_KEY = "cc.hiddenDocs"

export interface SidebarActions {
  toggleExpanded: (id: string) => void
  setSearchQuery: (query: string) => void
  openAddMenu: (section: SectionId | null) => void
  closeAddMenu: () => void
  startNewFolder: (sectionId: SectionId) => void
  startRename: (id: string) => void
  commitRename: (id: string, nextName: string) => void
  cancelRename: () => void
  addComponent: (input: {
    name: string
    folderId: string | null
    sectionId: SectionId
  }) => void
  deleteEntry: (id: string) => void
  openImportDialog: (section?: SectionId | null) => void
  closeImportDialog: () => void
  openDoc: (id: string) => void
  closeDoc: () => void
  hideDoc: (id: string) => void
  unhideDoc: (id: string) => void
}

export interface SidebarPanelContextValue {
  registry: Registry
  expandedIds: Set<string>
  searchQuery: string
  searchMatch: SearchMatch | null
  effectiveExpandedIds: Set<string>
  addMenuOpen: boolean
  addMenuSection: SectionId | null
  renamingId: string | null
  importDialogOpen: boolean
  importDialogSection: SectionId | null
  openDocId: string | null
  hiddenDocIds: Set<string>
  actions: SidebarActions
}

const SidebarPanelContext = createContext<SidebarPanelContextValue | null>(null)

function createId(prefix: string): string {
  const bytes =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${bytes}`
}

function nextFolderOrder(folders: FolderRecord[], sectionId: SectionId): number {
  const scoped = folders.filter((folder) => folder.sectionId === sectionId)
  if (scoped.length === 0) return 0
  return Math.max(...scoped.map((folder) => folder.order)) + 1
}

function nextLeafOrder(leaves: LeafRecord[], folderId: string | null): number {
  const scoped = leaves.filter((leaf) => (leaf.folderId ?? null) === folderId)
  if (scoped.length === 0) return 0
  return Math.max(...scoped.map((leaf) => leaf.order)) + 1
}

export function SidebarPanelProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<Registry>(DEMO_REGISTRY)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())
  const [searchQuery, setSearchQueryState] = useState<string>("")
  const [addMenuOpen, setAddMenuOpen] = useState<boolean>(false)
  const [addMenuSection, setAddMenuSection] = useState<SectionId | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false)
  const [importDialogSection, setImportDialogSection] = useState<SectionId | null>(null)
  const [openDocId, setOpenDocId] = useState<string | null>(null)
  const [hiddenDocIds, setHiddenDocIds] = useState<Set<string>>(() => new Set())
  const [hiddenDocsHydrated, setHiddenDocsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(HIDDEN_DOCS_STORAGE_KEY)
      if (raw === null) {
        setHiddenDocIds(new Set(DEMO_DEFAULT_HIDDEN_DOC_IDS))
      } else {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setHiddenDocIds(new Set(parsed))
      }
    } catch {
      setHiddenDocIds(new Set(DEMO_DEFAULT_HIDDEN_DOC_IDS))
    } finally {
      setHiddenDocsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hiddenDocsHydrated) return
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(
        HIDDEN_DOCS_STORAGE_KEY,
        JSON.stringify([...hiddenDocIds]),
      )
    } catch {
      // localStorage unavailable; ignore.
    }
  }, [hiddenDocIds, hiddenDocsHydrated])

  const searchMatch = useMemo(
    () => searchRegistry(registry, searchQuery),
    [registry, searchQuery],
  )

  const effectiveExpandedIds = useMemo(() => {
    if (!searchMatch) return expandedIds
    const combined = new Set(expandedIds)
    for (const id of searchMatch.ancestors) combined.add(id)
    return combined
  }, [expandedIds, searchMatch])

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query)
  }, [])

  const openAddMenu = useCallback((section: SectionId | null) => {
    setAddMenuSection(section)
    setAddMenuOpen(true)
  }, [])

  const closeAddMenu = useCallback(() => {
    setAddMenuOpen(false)
  }, [])

  const startNewFolder = useCallback((sectionId: SectionId) => {
    setAddMenuOpen(false)
    const newId = createId(`${sectionId}-folder`)
    setRegistry((prev) => {
      const order = nextFolderOrder(prev.folders, sectionId)
      const folder: FolderRecord = {
        id: newId,
        sectionId,
        name: "",
        order,
      }
      return { ...prev, folders: [...prev.folders, folder] }
    })
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.add(newId)
      return next
    })
    setRenamingId(newId)
  }, [])

  const startRename = useCallback((id: string) => {
    setRenamingId(id)
  }, [])

  const commitRename = useCallback((id: string, nextName: string) => {
    const trimmed = nextName.trim()
    if (!trimmed) {
      setRegistry((prev) => {
        if (prev.folders.some((folder) => folder.id === id && folder.name === "")) {
          return {
            ...prev,
            folders: prev.folders.filter((folder) => folder.id !== id),
          }
        }
        return prev
      })
      setRenamingId((current) => (current === id ? null : current))
      return
    }
    setRegistry((prev) => {
      const folderMatch = prev.folders.some((folder) => folder.id === id)
      if (folderMatch) {
        return {
          ...prev,
          folders: prev.folders.map((folder) =>
            folder.id === id ? { ...folder, name: trimmed } : folder,
          ),
        }
      }
      return {
        ...prev,
        leaves: prev.leaves.map((leaf) =>
          leaf.id === id ? { ...leaf, name: trimmed } : leaf,
        ),
      }
    })
    setRenamingId((current) => (current === id ? null : current))
  }, [])

  const cancelRename = useCallback(() => {
    setRenamingId((current) => {
      if (current === null) return null
      setRegistry((prev) => {
        const pending = prev.folders.find(
          (folder) => folder.id === current && folder.name === "",
        )
        if (pending) {
          return {
            ...prev,
            folders: prev.folders.filter((folder) => folder.id !== current),
          }
        }
        return prev
      })
      return null
    })
  }, [])

  const addComponent = useCallback(
    (input: { name: string; folderId: string | null; sectionId: SectionId }) => {
      const trimmed = input.name.trim()
      if (!trimmed) return
      const newLeaf: LeafRecord = {
        id: createId("cmp"),
        name: trimmed,
        kind: "component",
        iconName: "cube",
        folderId: input.folderId ?? undefined,
        sectionId: input.sectionId,
        order: 0,
      }
      setRegistry((prev) => {
        const leaves = [...prev.leaves]
        newLeaf.order = nextLeafOrder(leaves, input.folderId)
        leaves.push(newLeaf)
        return { ...prev, leaves }
      })
      if (input.folderId) {
        setExpandedIds((prev) => {
          const next = new Set(prev)
          next.add(input.folderId as string)
          return next
        })
      }
    },
    [],
  )

  const deleteEntry = useCallback((id: string) => {
    setRegistry((prev) => {
      const isFolder = prev.folders.some((folder) => folder.id === id)
      if (isFolder) {
        return {
          ...prev,
          folders: prev.folders.filter(
            (folder) => folder.id !== id && folder.parentId !== id,
          ),
          leaves: prev.leaves.filter((leaf) => leaf.folderId !== id),
        }
      }
      return {
        ...prev,
        leaves: prev.leaves.filter((leaf) => leaf.id !== id),
      }
    })
    setRenamingId((current) => (current === id ? null : current))
    setExpandedIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const openImportDialog = useCallback((section?: SectionId | null) => {
    setAddMenuOpen(false)
    setImportDialogSection(section ?? null)
    setImportDialogOpen(true)
  }, [])

  const closeImportDialog = useCallback(() => {
    setImportDialogOpen(false)
  }, [])

  const openDoc = useCallback((id: string) => {
    setOpenDocId(id)
  }, [])

  const closeDoc = useCallback(() => {
    setOpenDocId(null)
  }, [])

  const hideDoc = useCallback((id: string) => {
    setHiddenDocIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const unhideDoc = useCallback((id: string) => {
    setHiddenDocIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const actions = useMemo<SidebarActions>(
    () => ({
      toggleExpanded,
      setSearchQuery,
      openAddMenu,
      closeAddMenu,
      startNewFolder,
      startRename,
      commitRename,
      cancelRename,
      addComponent,
      deleteEntry,
      openImportDialog,
      closeImportDialog,
      openDoc,
      closeDoc,
      hideDoc,
      unhideDoc,
    }),
    [
      toggleExpanded,
      setSearchQuery,
      openAddMenu,
      closeAddMenu,
      startNewFolder,
      startRename,
      commitRename,
      cancelRename,
      addComponent,
      deleteEntry,
      openImportDialog,
      closeImportDialog,
      openDoc,
      closeDoc,
      hideDoc,
      unhideDoc,
    ],
  )

  const value = useMemo<SidebarPanelContextValue>(
    () => ({
      registry,
      expandedIds,
      searchQuery,
      searchMatch,
      effectiveExpandedIds,
      addMenuOpen,
      addMenuSection,
      renamingId,
      importDialogOpen,
      importDialogSection,
      openDocId,
      hiddenDocIds,
      actions,
    }),
    [
      registry,
      expandedIds,
      searchQuery,
      searchMatch,
      effectiveExpandedIds,
      addMenuOpen,
      addMenuSection,
      renamingId,
      importDialogOpen,
      importDialogSection,
      openDocId,
      hiddenDocIds,
      actions,
    ],
  )

  return (
    <SidebarPanelContext.Provider value={value}>
      {children}
    </SidebarPanelContext.Provider>
  )
}

export function useSidebarPanelContext(): SidebarPanelContextValue {
  const ctx = useContext(SidebarPanelContext)
  if (!ctx) {
    throw new Error("useSidebarPanelContext must be used inside <SidebarPanelProvider>.")
  }
  return ctx
}
