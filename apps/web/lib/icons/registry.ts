import {
  Add,
  ChevronRight,
  ChevronSort,
  ColorPalette,
  Cube,
  Document,
  DocumentAdd,
  Edit,
  Folder,
  FolderAdd,
  FolderOpen,
  Growth,
  Map,
  OverflowMenuHorizontal,
  Pen,
  Ruler,
  Search,
  TextFont,
  TrashCan,
} from "@carbon/icons-react"

export const CARBON_ICONS = {
  add: Add,
  folder: Folder,
  "folder-open": FolderOpen,
  document: Document,
  "color-palette": ColorPalette,
  "text-font": TextFont,
  ruler: Ruler,
  pen: Pen,
  growth: Growth,
  map: Map,
  cube: Cube,
  "chevron-right": ChevronRight,
  "chevron-sort": ChevronSort,
  search: Search,
  "folder-add": FolderAdd,
  "document-add": DocumentAdd,
  "overflow-menu-horizontal": OverflowMenuHorizontal,
  "trash-can": TrashCan,
  edit: Edit,
} as const

export type CarbonIconName = keyof typeof CARBON_ICONS

export function getCarbonIcon(name: CarbonIconName) {
  return CARBON_ICONS[name]
}
