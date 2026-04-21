"use client"

import type { CSSProperties, ReactNode } from "react"
import { AddMenuSpecimens } from "./specimens/add-menu-specimens"
import { ButtonSpecimens } from "./specimens/button-specimens"
import { DocModalSpecimens } from "./specimens/doc-modal-specimens"
import { IconButtonSpecimens } from "./specimens/icon-button-specimens"
import { ImportDialogSpecimens } from "./specimens/import-dialog-specimens"
import { RowSpecimens } from "./specimens/row-specimens"
import { SearchInputSpecimens } from "./specimens/search-input-specimens"
import { SectionHeaderSpecimens } from "./specimens/section-header-specimens"
import { SidebarPanelSpecimen } from "./specimens/sidebar-panel-specimen"
import { TeamSwitcherSpecimens } from "./specimens/team-switcher-specimens"
import { UserFooterSpecimens } from "./specimens/user-footer-specimens"

interface PlaygroundSection {
  id: string
  title: string
  render: () => ReactNode
}

const SECTIONS: PlaygroundSection[] = [
  { id: "button", title: "Button System", render: () => <ButtonSpecimens /> },
  { id: "row", title: "Row System", render: () => <RowSpecimens /> },
  {
    id: "section-header",
    title: "SectionHeader",
    render: () => <SectionHeaderSpecimens />,
  },
  {
    id: "search-input",
    title: "SearchInput",
    render: () => <SearchInputSpecimens />,
  },
  {
    id: "icon-button",
    title: "IconButton",
    render: () => <IconButtonSpecimens />,
  },
  {
    id: "team-switcher",
    title: "TeamSwitcher",
    render: () => <TeamSwitcherSpecimens />,
  },
  {
    id: "user-footer",
    title: "UserFooter",
    render: () => <UserFooterSpecimens />,
  },
  { id: "add-menu", title: "AddMenu", render: () => <AddMenuSpecimens /> },
  {
    id: "import-dialog",
    title: "ImportDialog",
    render: () => <ImportDialogSpecimens />,
  },
  {
    id: "doc-modal",
    title: "DocModal",
    render: () => <DocModalSpecimens />,
  },
  {
    id: "sidebar-panel",
    title: "Full SidebarPanel",
    render: () => <SidebarPanelSpecimen />,
  },
]

const rootStyle: CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  overscrollBehavior: "contain",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
}

const containerStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "var(--spacing-12) var(--spacing-7)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-11)",
}

export function Playground() {
  return (
    <div style={rootStyle}>
      <div style={containerStyle}>
        <header style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          <h1 className="type-8 text-trim" style={{ color: "var(--color-text-primary)" }}>
            Component Canvas playground
          </h1>
          <p className="type-3 text-trim" style={{ color: "var(--color-text-tertiary)" }}>
            Every component we ship, every variant, in one scrollable column. Access via <code>/playground</code>.
          </p>
        </header>
        {SECTIONS.map((section) => (
          <PlaygroundSection key={section.id} title={section.title}>
            {section.render()}
          </PlaygroundSection>
        ))}
      </div>
    </div>
  )
}

interface PlaygroundSectionProps {
  title: string
  children: ReactNode
}

export function PlaygroundSection({ title, children }: PlaygroundSectionProps) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-7)",
      }}
    >
      <h2 className="type-7" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
