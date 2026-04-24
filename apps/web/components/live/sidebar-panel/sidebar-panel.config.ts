export const SIDEBAR_WIDTH = 280
export const SIDEBAR_WIDTH_COLLAPSED = 44
export const SIDEBAR_FADE_HEIGHT = 24

// Aside width is a layout property (can't use transform for this, because the
// canvas is a flex sibling and must grow into the freed space). CSS transition
// keeps the interpolation off the main thread. 260ms + ease-out-soft sits in
// Kowalski's 200-300ms drawer window.
export const SIDEBAR_WIDTH_DURATION_MS = 260
export const SIDEBAR_EASE_OUT_SOFT = "cubic-bezier(0.22, 1, 0.36, 1)"

// Labels (team-switcher, user-footer, row labels, row trailings, section
// headers) fade only. Exit is ~27% faster than enter, matching Kowalski's
// "exits ~20% faster than entrances".
export const SIDEBAR_LABEL_ENTER_MS = 220
export const SIDEBAR_LABEL_EXIT_MS = 160

export const SIDEBAR_COLLAPSED_STORAGE_KEY = "sidebar:collapsed"
