export const SIDEBAR_WIDTH = 280
export const SIDEBAR_WIDTH_COLLAPSED = 44
export const SIDEBAR_FADE_HEIGHT = 24

// Width transition (not transform) — canvas is a flex sibling and must grow
// into the freed space.
export const SIDEBAR_WIDTH_DURATION_MS = 260
export const SIDEBAR_EASE_OUT_SOFT = "cubic-bezier(0.22, 1, 0.36, 1)"

// Labels fade only. Exit ~27% faster than enter.
export const SIDEBAR_LABEL_ENTER_MS = 220
export const SIDEBAR_LABEL_EXIT_MS = 160

export const SIDEBAR_COLLAPSED_STORAGE_KEY = "sidebar:collapsed"
