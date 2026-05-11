# Dashboard — Pencil Context Map

Written post-hoc from the narrow `batch_get` calls used during the build. The plan called for this map up-front; I traded the doc for per-component reads at build time. This file captures the node-ID inventory + the canonical context comments for future agents.

## Node-ID inventory

### Top-level containers
- `pzqsk` — Dashboard-Layouts-Container (1560×?, padding 48, gap 48, fill `#F0F3F4`)
- `UAxrX` — Dashboard-Components-Kit-v2-Container (1072×?, padding 48, gap 48, fill `#F0F3F4`)
- `bmFW0` — DashboardNav-final (reusable, 1440×60, padding [12,40], gap 64, space_between)

### Layout wrappers (under `pzqsk`)
- `Y9lv7W` — LoginScreen-default-final (1440×900, white surface, radius 16, 1px border-secondary)
- `d5POK` — Dashboard-empty-final (1440×900)
- `ionyR` — Dashboard-populated-final (1440×1080)
- `iC6rE` — Dashboard-expanded-final (1440×1080) — main padding `[120, 280]`
- `y6krPp` — ConnectRepo-default-final (1440×900)

### Kit sections (under `UAxrX`)
- `DXPb8` — Section-HeroCard-v2 (display: `Gh8bm`)
- `U2dgXf` — Section-ListContainer-v2 (display: `sP7fn`)
- `jnMku` — Section-CardGrid-v2 (display: `In6n1`)
- `xyFqS` — Section-SectionLabel-v2 (display: `nALNt`)
- `q0LGae` — Section-FilterPills-v2 (display: `F0n6pi`)
- `OzlhI` — Section-Status-v2 (display: `BfTEP`)
- `AJNcY` — Section-WorkspaceChip-v2 (display: `iiF6h`)
- `Bji9C` — Section-RepoRow-v2 (display: `RJhhj`)
- `OvAbs` — Section-BranchRow-v2 (display: `SOKl4`)
- `PR3eE` — Section-OtherBranchesExpander-v2 (display: `U3Bm6e`)
- `J9AgZc` — Section-DashboardListHeader-v2 (display: `xjoWA`)
- `Ut9ay` — Section-Toast-v2 (display: `vBR8x`)

### RepoRow variants (under `RJhhj > z5dHf > DnwLw`)
- `K6NYJ` — RepoRow-default-personal (white)
- `B0gux` — RepoRow-default-team (white)
- `PIVBw` — RepoRow-hover (#f6f8f9 + 1px stroke)
- `Tw8OZ` — RepoRow-syncing
- `Rp18h` — RepoRow-failed
- `GdVeT` — RepoRow-stale
- `Nthat` — RepoRow-expanded (#f6f8f9)

### BranchRow variants (under `SOKl4 > RPuHN`)
- `nfiVN` — BranchRow-default-v2 (unpinned, synced)
- `khagX` — BranchRow-pinned-v2 (filled pin)
- `EllEv` — BranchRow-syncing-v2 (hollow status ring)
- `nRWc4` — BranchRow-failed-v2 (red, "Build failed · View logs")
- `wV8gi` — BranchRow-stale-v2 (pin-off + secondary colors)
- `HFhHV` — BranchRow-hover-v2 (white + 1px stroke, action cluster revealed)

### OtherBranchesExpander variants (under `U3Bm6e > MhJ0o`)
- `oeNZB` — OtherBranches-collapsed-v2
- `Nkna5` — OtherBranches-hover-v2 (white + 1px stroke)
- `J6Fl0r` — OtherBranches-loading-v2 (spinner)
- `dv1Kj` — OtherBranches-expanded-v2

### DashboardListHeader variants (under `xjoWA`)
- `ytIEo` — DashboardListHeader-populated (title + count + FilterPills + sort)
- `zktt6` — DashboardListHeader-expanded (title + count + sort, no pills)
- `z7OZe` — DashboardListHeader-personal-only ("Your repos" title)

### DashboardNav children (under `bmFW0`)
- `sF7Fe` — Nav-LogoSlot (238×36, empty)
- `uXeQw` — Nav-Search (480×36, radius 12, 1px border)
- `Fubfq` — Nav-Search-Left
- `HN02d` — Nav-Search-Kbd (16h, #f0f3f4, radius 4)
- `lYtdd` — Nav-Connect-Button (dark #171719, radius 12, 36h, padding [16,20])
- `HoiCg` — Nav-Avatar (36×36, radius 40, gradient-dusk fill)
- `rXbsX` — Nav-ThemeToggle (36×36, radius 40, gradient-dusk fill)

### Layout sections inside `iC6rE` (Dashboard-expanded-final)
- `KNRCz` — Recent Repos (#f0f3f4, radius 18, padding 2, 1px stroke)
- `aHZOW` — RepoList (#f0f3f4, radius 18, padding 2, 1px stroke, clip)
- `Lm1KZ` — Expanded-Main (padding [120, 280], 1016 height)
- `V94z5` — Expanded-Header (no FilterPills variant)

---

## Key tokens / dimensions per component

| Component | Pencil dims | Notes |
|---|---|---|
| DashboardNav | 1440×60, padding [12,40], gap 64 | `space-between`; bound to `var(--color-bg-elevated)` |
| HeroCard | width 480, radius 40, padding 24, gap 32 | gradient + radius are inline-hardcoded exceptions |
| ListContainer | radius 18, padding 2, gap 2, fill `#f0f3f4` | mapped to `var(--radius-5)` (closest token, 2px tolerance) |
| CardGrid | same primitive as ListContainer + Text Holder header | horizontal card row inside |
| RepoRow | 56h, radius 16, padding [16,20], gap 16 | hover → bg-secondary + 1px stroke; expanded → bg-secondary fill |
| BranchRow | 48h, radius 16, padding [12,20,12,48] (32 indent), gap 12 | always fill bg-secondary |
| OtherBranchesExpander | 48h, radius 16, padding [10,20,10,48] | chevron rotates on expand, spinner on load |
| WorkspaceChip | 28h, radius 8, padding [4,8] personal / [4,10,4,4] team | active → 1px text-primary ring + bg-secondary |
| StatusChip | 24h, radius full, padding [4,10], gap 6 | wash bg or white + border-secondary |
| FilterPills | 28h, radius full, padding [0,12] | active → bg text-primary + white text |
| DashboardListHeader | row, gap 5 | populated variant has FilterPills; expanded omits them |

---

## Caveats from Pencil context comments

- **AuthButton frame naming bug** in Pencil: `yA9R9` and `Nqeid` have their names swapped vs their content. Implementer must read content, not names. (Handled in code by building github/google variants from scratch.)
- **Google G placeholder**: Pencil uses lucide `globe` as a stand-in. Real brand mark added at `public/SVGs/google-g.svg`.
- **Ronzino font on Nav-Connect-Label**: Pencil internal placeholder. Renders as `font-sans` (Geist) — no-op in code.
- **Pencil radius 18/14** has no exact token. Bound to `var(--radius-5)` / `var(--radius-3)` respectively with ≤2px tolerance per the plan.
- **HeroCard radius 40 + gradient** are the only two inline-hardcoded values in the build. Documented in ROADMAP §Dashboard.

---

## What's not mapped here

- The kit's caption-text Geist 11/500 uppercase letter-spacing 1 (used as section labels and state callouts inside the kit). Implemented via `.type-3 font-medium` + `textTransform: uppercase` + `letterSpacing: 0.05em` on `SectionLabel`.
- Per-state demo content (specific org/repo strings, branch names, SHAs) — lives in `apps/web/lib/dashboard/demo.ts`.
- Color → token mapping table — lives in `dashboard-implementation-plan.md` and is enforced inline via `var(--color-*)` references.
