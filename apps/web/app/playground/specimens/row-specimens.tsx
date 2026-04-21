"use client"

import type { CSSProperties, ReactNode } from "react"
import { OverflowMenuHorizontal } from "@carbon/icons-react"
import { Row } from "@/components/live/row"
import {
  Specimen,
  SpecimenGroup,
  SIDEBAR_WIDTH_SPECIMEN,
} from "./_shared"

const sizes = [20, 24, 28, 32, 36] as const

const subGroupStyle: CSSProperties = {
  borderLeft: "1px solid var(--sidebar-indent-rail)",
  paddingLeft: "var(--spacing-3)",
  marginLeft: "var(--spacing-4)",
  listStyle: "none",
  padding: "0 0 0 var(--spacing-3)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-1)",
}

function SubGroup({ children }: { children: ReactNode }) {
  return <ul style={subGroupStyle}>{children}</ul>
}

export function RowSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-11)",
      }}
    >
      <SpecimenGroup title="Sizes">
        {sizes.map((size) => (
          <Specimen
            key={size}
            label={`size={${size}} leading=icon("cube") trailing=chevron`}
            width={SIDEBAR_WIDTH_SPECIMEN}
          >
            <Row
              label={`Row size ${size}`}
              size={size}
              leading={{ kind: "icon", icon: "cube" }}
              trailing={{ kind: "chevron" }}
            />
          </Specimen>
        ))}
      </SpecimenGroup>

      <SpecimenGroup title="Leading kinds">
        <Specimen label={`leading=icon("cube")`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row label="Icon leading" leading={{ kind: "icon", icon: "cube" }} />
        </Specimen>
        <Specimen label={`leading=folder expanded=false`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Forms"
            leading={{ kind: "folder", expanded: false }}
            trailing={{ kind: "chevron", expanded: false }}
          />
        </Specimen>
        <Specimen label={`leading=folder expanded=true`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Forms"
            leading={{ kind: "folder", expanded: true }}
            trailing={{ kind: "chevron", expanded: true }}
            expanded
          />
        </Specimen>
        <Specimen label={`leading=dot`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row label="History" leading={{ kind: "dot" }} variant="menu-sub-button" />
        </Specimen>
        <Specimen label={`leading=initial letter="A"`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row label="Acme" leading={{ kind: "initial", letter: "A" }} />
        </Specimen>
        <Specimen label={`leading=none`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row label="No leading" leading={{ kind: "none" }} />
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Trailing kinds">
        <Specimen label={`trailing=chevron expanded=false`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Collapsed folder"
            leading={{ kind: "folder" }}
            trailing={{ kind: "chevron", expanded: false }}
          />
        </Specimen>
        <Specimen label={`trailing=chevron expanded=true`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Expanded folder"
            leading={{ kind: "folder", expanded: true }}
            trailing={{ kind: "chevron", expanded: true }}
            expanded
          />
        </Specimen>
        <Specimen
          label={`trailing=action (OverflowMenuHorizontal)`}
          width={SIDEBAR_WIDTH_SPECIMEN}
        >
          <Row
            label="Hover to reveal action →"
            leading={{ kind: "icon", icon: "cube" }}
            trailing={{
              kind: "action",
              action: (
                <span
                  style={{
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <OverflowMenuHorizontal size={16} />
                </span>
              ),
            }}
          />
        </Specimen>
        <Specimen label={`trailing=badge "5"`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Badge row"
            leading={{ kind: "icon", icon: "cube" }}
            trailing={{ kind: "badge", content: "5" }}
          />
        </Specimen>
        <Specimen label={`trailing=kbd "/"`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Focus search"
            leading={{ kind: "icon", icon: "search" }}
            trailing={{ kind: "kbd", label: "/" }}
          />
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="States">
        <Specimen label={`default (hover me to see hover)`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Hover me"
            leading={{ kind: "icon", icon: "cube" }}
            trailing={{ kind: "none" }}
          />
        </Specimen>
        <Specimen label={`active=true`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Active leaf"
            leading={{ kind: "icon", icon: "cube" }}
            active
          />
        </Specimen>
        <Specimen label={`expanded=true`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Expanded folder"
            leading={{ kind: "folder", expanded: true }}
            trailing={{ kind: "chevron", expanded: true }}
            expanded
          />
        </Specimen>
        <Specimen label={`disabled=true`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Disabled component"
            leading={{ kind: "icon", icon: "cube" }}
            disabled
          />
        </Specimen>
        <Specimen label={`loading=true`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="Loading component"
            leading={{ kind: "icon", icon: "cube" }}
            loading
          />
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Depth 1 (with indent rail)">
        <Specimen label={`depth=1 variant=menu-sub-button size=28`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <SubGroup>
            <li>
              <Row
                label="Button"
                variant="menu-sub-button"
                depth={1}
                leading={{ kind: "icon", icon: "cube" }}
              />
            </li>
            <li>
              <Row
                label="Input"
                variant="menu-sub-button"
                depth={1}
                leading={{ kind: "icon", icon: "cube" }}
              />
            </li>
            <li>
              <Row
                label="Select"
                variant="menu-sub-button"
                depth={1}
                leading={{ kind: "icon", icon: "cube" }}
                active
              />
            </li>
          </SubGroup>
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Inline editing">
        <Specimen label={`editing=true (type and press Enter / Esc)`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <Row
            label="New folder"
            leading={{ kind: "folder" }}
            editing
            editDefaultValue="New folder"
            onCommitEdit={(value) => console.log("commit", value)}
            onCancelEdit={() => console.log("cancel edit")}
          />
        </Specimen>
      </SpecimenGroup>
    </div>
  )
}
