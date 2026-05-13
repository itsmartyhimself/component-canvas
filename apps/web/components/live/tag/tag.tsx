import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react"
import { cn } from "@/lib/utils"

import {
  GAP,
  HEIGHT_MAP,
  PADDING_INLINE_MAP,
  RADIUS_MAP,
  TONE_COLORS,
  TYPE_CLASS,
  type TagSize,
  type TagTone,
} from "./tag.config"

export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: TagSize
  tone?: TagTone
  leading?: ReactNode
  trailing?: ReactNode
  children: ReactNode
}

function TagBase(
  {
    size = "sm",
    tone = "neutral",
    leading,
    trailing,
    children,
    className,
    style,
    ...rest
  }: TagProps,
  ref: Ref<HTMLSpanElement>,
) {
  const { bg, fg } = TONE_COLORS[tone]
  const height = HEIGHT_MAP[size]
  const radius = RADIUS_MAP[size]
  const inlinePad = PADDING_INLINE_MAP[size]

  const rootStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: GAP,
    height,
    padding: `0 ${inlinePad}`,
    borderRadius: radius,
    backgroundColor: bg,
    color: fg,
    ...style,
  }

  return (
    <span ref={ref} className={cn(TYPE_CLASS, className)} style={rootStyle} {...rest}>
      {leading}
      {children}
      {trailing}
    </span>
  )
}

export const Tag = forwardRef(TagBase)
Tag.displayName = "Tag"
