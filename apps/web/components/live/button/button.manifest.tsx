import { Button } from "./button"
import type { ButtonProps } from "./button.config"
import type { ComponentManifest } from "@/lib/registry/manifest-types"

export const buttonManifest: ComponentManifest<ButtonProps> = {
  id: "button-demo",
  render: (props) => <Button {...props} />,
  defaultProps: {
    label: "Button",
    variant: "primary",
    size: "small",
    form: "label",
    fill: false,
    loading: false,
    disabled: false,
  },
  controls: {
    variants: {
      prop: "variant",
      options: ["pop", "primary", "secondary", "tertiary", "ghost", "text-link"],
    },
    sizes: { prop: "size", options: ["small", "medium", "large"] },
    forms: { prop: "form", options: ["label", "icon-only"] },
    booleans: ["fill", "loading", "disabled"],
  },
}
