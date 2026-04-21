// DEMO-ONLY — replace with real data fetch when backend exists. See apps/web/ROADMAP.md → "Backend / Registry".

import type {
  FolderRecord,
  LeafRecord,
  Registry,
  SectionRecord,
  Team,
  TopPage,
  User,
} from "./types"

const SECTIONS: SectionRecord[] = [
  { id: "library", label: "LIBRARY", actionable: true, kind: "folders" },
  { id: "frontend", label: "FRONTEND", actionable: true, kind: "folders" },
  { id: "projects", label: "PROJECTS", actionable: true, kind: "folders" },
  {
    id: "design-system",
    label: "DESIGN SYSTEM",
    actionable: false,
    kind: "items",
  },
]

const FOLDERS: FolderRecord[] = [
  // LIBRARY
  { id: "forms", sectionId: "library", name: "Forms", order: 0 },
  { id: "navigation", sectionId: "library", name: "Navigation", order: 1 },
  { id: "feedback", sectionId: "library", name: "Feedback", order: 2 },
  { id: "media", sectionId: "library", name: "Media", order: 3 },

  // FRONTEND
  { id: "landing", sectionId: "frontend", name: "Landing", order: 0 },
  { id: "dashboard", sectionId: "frontend", name: "Dashboard", order: 1 },
  { id: "checkout", sectionId: "frontend", name: "Checkout", order: 2 },
  { id: "ancillary", sectionId: "frontend", name: "Ancillary", order: 3 },

  // PROJECTS
  {
    id: "travel",
    sectionId: "projects",
    name: "Travel",
    iconName: "map",
    order: 0,
  },
  {
    id: "sales-marketing",
    sectionId: "projects",
    name: "Sales & Marketing",
    iconName: "growth",
    order: 1,
  },
  {
    id: "design-engineering",
    sectionId: "projects",
    name: "Design Engineering",
    iconName: "pen",
    order: 2,
  },
  { id: "drafts", sectionId: "projects", name: "Drafts", order: 3 },
]

type LeafSeed = Pick<LeafRecord, "id" | "name"> &
  Partial<Pick<LeafRecord, "loading" | "disabled" | "iconName" | "kind">>

function componentLeaves(
  folderId: string,
  sectionId: LeafRecord["sectionId"],
  seeds: LeafSeed[],
): LeafRecord[] {
  return seeds.map((seed, order) => ({
    id: seed.id,
    name: seed.name,
    kind: seed.kind ?? "component",
    iconName: seed.iconName ?? "cube",
    folderId,
    sectionId,
    order,
    loading: seed.loading,
    disabled: seed.disabled,
  }))
}

const LEAVES: LeafRecord[] = [
  // LIBRARY → Forms
  ...componentLeaves("forms", "library", [
    { id: "cmp-button", name: "Button" },
    { id: "cmp-input", name: "Input" },
    { id: "cmp-checkbox", name: "Checkbox" },
    { id: "cmp-toggle", name: "Toggle" },
    { id: "cmp-select", name: "Select", loading: true },
    { id: "cmp-slider", name: "Slider", disabled: true },
  ]),
  // LIBRARY → Navigation
  ...componentLeaves("navigation", "library", [
    { id: "cmp-nav-bar", name: "Nav Bar" },
    { id: "cmp-breadcrumbs", name: "Breadcrumbs" },
    { id: "cmp-pagination", name: "Pagination" },
    { id: "cmp-tabs", name: "Tabs" },
    { id: "cmp-stepper", name: "Stepper" },
  ]),
  // LIBRARY → Feedback
  ...componentLeaves("feedback", "library", [
    { id: "cmp-toast", name: "Toast" },
    { id: "cmp-dialog", name: "Dialog" },
    { id: "cmp-banner", name: "Banner" },
    { id: "cmp-badge", name: "Badge" },
  ]),

  // FRONTEND → Landing
  ...componentLeaves("landing", "frontend", [
    { id: "pg-hero", name: "Hero" },
    { id: "pg-feature-grid", name: "Feature Grid" },
    { id: "pg-testimonials", name: "Testimonial Wall" },
    { id: "pg-pricing", name: "Pricing Table" },
    { id: "pg-cta-footer", name: "CTA Footer" },
  ]),
  // FRONTEND → Dashboard
  ...componentLeaves("dashboard", "frontend", [
    { id: "pg-stats-row", name: "Stats Row" },
    { id: "pg-activity-feed", name: "Activity Feed" },
    { id: "pg-usage-chart", name: "Usage Chart" },
    { id: "pg-project-card", name: "Project Card" },
    { id: "pg-filter-bar", name: "Filter Bar" },
    { id: "pg-empty-state", name: "Empty State" },
    { id: "pg-notifications", name: "Notifications" },
  ]),
  // FRONTEND → Checkout
  ...componentLeaves("checkout", "frontend", [
    { id: "pg-cart-summary", name: "Cart Summary" },
    { id: "pg-address-form", name: "Address Form" },
    { id: "pg-payment-selector", name: "Payment Selector" },
    { id: "pg-order-confirmation", name: "Order Confirmation" },
  ]),

  // PROJECTS → Travel (nav leaves with dot leading)
  ...[
    { id: "travel-history", name: "History" },
    { id: "travel-starred", name: "Starred" },
    { id: "travel-settings", name: "Settings" },
    { id: "travel-notes", name: "Notes" },
    { id: "travel-archive", name: "Archive" },
  ].map<LeafRecord>((seed, order) => ({
    id: seed.id,
    name: seed.name,
    kind: "nav",
    folderId: "travel",
    sectionId: "projects",
    order,
  })),
  // PROJECTS → Sales & Marketing
  ...componentLeaves("sales-marketing", "projects", [
    { id: "sm-lead-funnel", name: "Lead Funnel" },
    { id: "sm-campaign-composer", name: "Campaign Composer" },
    { id: "sm-email-template", name: "Email Template" },
    { id: "sm-landing-variants", name: "Landing Variants" },
    { id: "sm-pipeline-board", name: "Pipeline Board" },
    { id: "sm-deal-card", name: "Deal Card" },
    { id: "sm-metrics-board", name: "Metrics Board" },
    { id: "sm-attribution-chart", name: "Attribution Chart" },
    { id: "sm-sender-profile", name: "Sender Profile" },
    { id: "sm-engagement-timeline", name: "Engagement Timeline" },
  ]),
  // PROJECTS → Design Engineering
  ...componentLeaves("design-engineering", "projects", [
    { id: "de-token-sheet", name: "Token Sheet" },
    { id: "de-component-diff", name: "Component Diff Viewer" },
    { id: "de-prop-inspector", name: "Prop Inspector" },
    { id: "de-motion-explorer", name: "Motion Explorer" },
    { id: "de-a11y-report", name: "Accessibility Report" },
  ]),

  // DESIGN SYSTEM (flat doc leaves)
  {
    id: "doc-colors",
    name: "Colors",
    kind: "doc",
    iconName: "color-palette",
    sectionId: "design-system",
    order: 0,
  },
  {
    id: "doc-typography",
    name: "Typography",
    kind: "doc",
    iconName: "text-font",
    sectionId: "design-system",
    order: 1,
  },
  {
    id: "doc-spacing",
    name: "Spacing",
    kind: "doc",
    iconName: "ruler",
    sectionId: "design-system",
    order: 2,
  },
  {
    id: "doc-motion",
    name: "Motion",
    kind: "doc",
    iconName: "cube",
    sectionId: "design-system",
    order: 3,
  },
]

const TOP_PAGES: TopPage[] = [
  { id: "getting-started", label: "Getting Started", iconName: "document" },
  { id: "changelog", label: "Changelog", iconName: "document" },
]

const TEAM: Team = {
  id: "acme",
  name: "Acme",
  plan: "Pro plan",
  initial: "A",
}

const USER: User = {
  name: "Martin Heneby",
  email: "martin@component-canvas.dev",
}

export const DEMO_REGISTRY: Registry = {
  sections: SECTIONS,
  folders: FOLDERS,
  leaves: LEAVES,
  topPages: TOP_PAGES,
  team: TEAM,
  user: USER,
}

export const DEMO_DEFAULT_HIDDEN_DOC_IDS: string[] = ["doc-motion"]

export const DEMO_TEAMS_MULTI: Team[] = [
  TEAM,
  { id: "northwind", name: "Northwind", plan: "Starter plan", initial: "N" },
]
