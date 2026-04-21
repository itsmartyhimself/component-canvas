import type { CarbonIconName } from "@/lib/icons/registry"

export type SectionId = "library" | "frontend" | "projects" | "design-system"

export type LeafKind = "component" | "nav" | "doc"

export interface SectionRecord {
  id: SectionId
  label: string
  actionable: boolean
  kind: "folders" | "items"
}

export interface FolderRecord {
  id: string
  sectionId: SectionId
  name: string
  parentId?: string
  iconName?: CarbonIconName
  order: number
}

export interface LeafRecord {
  id: string
  name: string
  kind: LeafKind
  folderId?: string
  sectionId: SectionId
  iconName?: CarbonIconName
  sourcePath?: string
  variants?: string[]
  thumbnail?: string
  order: number
  loading?: boolean
  disabled?: boolean
}

export type TopPageId = "getting-started" | "changelog"

export interface TopPage {
  id: TopPageId
  label: string
  iconName: CarbonIconName
}

export interface Team {
  id: string
  name: string
  plan: string
  initial: string
}

export interface User {
  name: string
  email: string
  avatarUrl?: string
}

export interface Registry {
  sections: SectionRecord[]
  folders: FolderRecord[]
  leaves: LeafRecord[]
  topPages: TopPage[]
  team: Team
  user: User
}
