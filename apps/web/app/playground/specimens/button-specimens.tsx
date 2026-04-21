"use client"

import type { CSSProperties } from "react"
import { Add, ArrowRight } from "@carbon/icons-react"
import { Button } from "@/components/live/button"
import type {
  ButtonForm,
  ButtonSize,
  ButtonVariant,
} from "@/components/live/button"
import { Specimen, SpecimenGroup } from "./_shared"

const VARIANTS: ButtonVariant[] = [
  "pop",
  "primary",
  "secondary",
  "tertiary",
  "ghost",
  "text-link",
]
const SIZES: ButtonSize[] = ["small", "medium", "large"]
const FORMS: ButtonForm[] = ["label", "icon-only"]

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-5)",
  flexWrap: "wrap",
}

const addIcon = <Add size={16} />
const arrowIcon = <ArrowRight size={16} />

export function ButtonSpecimens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-11)",
      }}
    >
      <SpecimenGroup title="Variant × Size (form=label)">
        {VARIANTS.map((variant) => (
          <Specimen
            key={variant}
            label={`variant="${variant}" form="label"`}
          >
            <div style={rowStyle}>
              {SIZES.map((size) => (
                <Button
                  key={size}
                  label={`${variant} / ${size}`}
                  variant={variant}
                  size={size}
                  form="label"
                />
              ))}
            </div>
          </Specimen>
        ))}
      </SpecimenGroup>

      <SpecimenGroup title="Icon + label">
        {VARIANTS.filter((v) => v !== "text-link").map((variant) => (
          <Specimen
            key={variant}
            label={`variant="${variant}" form="label" icon=<Add>`}
          >
            <div style={rowStyle}>
              {SIZES.map((size) => (
                <Button
                  key={size}
                  label={`${variant} / ${size}`}
                  variant={variant}
                  size={size}
                  icon={addIcon}
                />
              ))}
            </div>
          </Specimen>
        ))}
      </SpecimenGroup>

      <SpecimenGroup title="Icon-only">
        {VARIANTS.filter((v) => v !== "text-link").map((variant) => (
          <Specimen key={variant} label={`variant="${variant}" form="icon-only"`}>
            <div style={rowStyle}>
              {SIZES.map((size) => (
                <Button
                  key={size}
                  variant={variant}
                  size={size}
                  form="icon-only"
                  icon={addIcon}
                  ariaLabel={`Add (${variant}/${size})`}
                />
              ))}
            </div>
          </Specimen>
        ))}
      </SpecimenGroup>

      <SpecimenGroup title="Text link">
        {SIZES.map((size) => (
          <Specimen
            key={size}
            label={`variant="text-link" size="${size}"`}
          >
            <Button label={`text-link / ${size}`} variant="text-link" size={size} />
          </Specimen>
        ))}
      </SpecimenGroup>

      <SpecimenGroup title="States">
        <Specimen label={`loading=true`}>
          <div style={rowStyle}>
            {VARIANTS.filter((v) => v !== "text-link").map((variant) => (
              <Button
                key={variant}
                label={variant}
                variant={variant}
                size="small"
                loading
              />
            ))}
          </div>
        </Specimen>
        <Specimen label={`disabled=true`}>
          <div style={rowStyle}>
            {VARIANTS.filter((v) => v !== "text-link").map((variant) => (
              <Button
                key={variant}
                label={variant}
                variant={variant}
                size="small"
                disabled
              />
            ))}
          </div>
        </Specimen>
        <Specimen label={`fill=true (stretches container)`}>
          <div style={{ width: 320 }}>
            <Button label="Fill" variant="primary" size="medium" fill />
          </div>
        </Specimen>
        <Specimen label={`icon + label, trailing arrow via custom composition`}>
          <div style={rowStyle}>
            <Button label="Continue" icon={arrowIcon} variant="primary" size="medium" />
            <Button label="Add" icon={addIcon} variant="pop" size="small" />
          </div>
        </Specimen>
      </SpecimenGroup>

      <SpecimenGroup title="Form coverage (full matrix)">
        {VARIANTS.filter((v) => v !== "text-link").flatMap((variant) =>
          FORMS.map((form) => (
            <Specimen
              key={`${variant}-${form}`}
              label={`variant="${variant}" form="${form}"`}
            >
              <div style={rowStyle}>
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    label={form === "icon-only" ? undefined : `${size}`}
                    variant={variant}
                    size={size}
                    form={form}
                    icon={form === "icon-only" ? addIcon : undefined}
                    ariaLabel={form === "icon-only" ? `${variant} ${size}` : undefined}
                  />
                ))}
              </div>
            </Specimen>
          )),
        )}
      </SpecimenGroup>
    </div>
  )
}
