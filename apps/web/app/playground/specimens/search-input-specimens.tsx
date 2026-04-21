"use client"

import { useState } from "react"
import { SearchInput } from "@/components/live/search-input"
import { Specimen, SpecimenGroup, SIDEBAR_WIDTH_SPECIMEN } from "./_shared"

export function SearchInputSpecimens() {
  const [empty, setEmpty] = useState("")
  const [filled, setFilled] = useState("Button")
  const [focused, setFocused] = useState("")
  const [disabled, setDisabled] = useState("")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-11)",
      }}
    >
      <SpecimenGroup title="States">
        <Specimen label={`empty, placeholder="Search"`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <SearchInput value={empty} onValueChange={setEmpty} />
        </Specimen>
        <Specimen label={`with value "Button"`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <SearchInput value={filled} onValueChange={setFilled} />
        </Specimen>
        <Specimen label={`autoFocus (cursor lands here on mount)`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <SearchInput value={focused} onValueChange={setFocused} autoFocus />
        </Specimen>
        <Specimen label={`disabled=true`} width={SIDEBAR_WIDTH_SPECIMEN}>
          <SearchInput value={disabled} onValueChange={setDisabled} disabled />
        </Specimen>
      </SpecimenGroup>
    </div>
  )
}
