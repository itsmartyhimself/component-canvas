import { ArrowLeft } from "@carbon/icons-react"
import { Button } from "@/components/live/button"

// Wrapper with `align-self: flex-start` prevents the Button from stretching
// across the parent flex column. Without this, motion.div (the Button's outer
// wrapper) stretches under `align-items: stretch`, the shadcn button's
// `justify-center` base class kicks in, and the back-link text appears centered
// across the page instead of at the left.
export function ConnectRepoCrumb() {
  return (
    <div style={{ alignSelf: "flex-start" }}>
      <Button
        variant="text-link"
        size="small"
        form="label"
        label="Back to dashboard"
        icon={<ArrowLeft size={14} />}
        href="/"
      />
    </div>
  )
}
