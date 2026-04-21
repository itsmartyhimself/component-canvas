/**
 * Copy specific Carbon Design System icons into public/SVGs/.
 *
 * Usage:
 *   pnpm tsx scripts/copy-icons.ts add close search arrow--right chevron--down
 *
 * This extracts the 32px SVG variant for each named icon from @carbon/icons
 * and writes it to apps/web/public/SVGs/ with the original name.
 *
 * All extracted SVGs include viewBox attributes (Carbon ships them by default).
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs"
import { basename, join, resolve } from "node:path"

const ROOT = resolve(import.meta.dirname, "..")
const DEST = join(ROOT, "apps", "web", "public", "SVGs")
const CARBON_SVG_DIR = join(ROOT, "node_modules", "@carbon", "icons", "svg", "32")

const icons = process.argv.slice(2)

if (icons.length === 0) {
  console.log("Usage: pnpm tsx scripts/copy-icons.ts <icon-name> [icon-name...]")
  console.log("Example: pnpm tsx scripts/copy-icons.ts add close search")
  console.log("")

  if (existsSync(CARBON_SVG_DIR)) {
    const available = readdirSync(CARBON_SVG_DIR)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => f.replace(".svg", ""))
    console.log(`Available icons (${available.length}):`)
    console.log(available.join(", "))
  } else {
    console.log("@carbon/icons not installed. Run: pnpm add -Dw @carbon/icons")
  }
  process.exit(0)
}

if (!existsSync(CARBON_SVG_DIR)) {
  console.error("Error: @carbon/icons not found. Run: pnpm add -Dw @carbon/icons")
  process.exit(1)
}

if (!existsSync(DEST)) {
  mkdirSync(DEST, { recursive: true })
}

let copied = 0
for (const name of icons) {
  const src = join(CARBON_SVG_DIR, `${name}.svg`)
  if (!existsSync(src)) {
    console.warn(`  skip: ${name} (not found in @carbon/icons/svg/32/)`)
    continue
  }
  const dest = join(DEST, `${basename(name)}.svg`)
  copyFileSync(src, dest)
  console.log(`  copied: ${name}.svg`)
  copied++
}

console.log(`\nDone. ${copied}/${icons.length} icons copied to ${DEST}`)
