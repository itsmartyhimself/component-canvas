export const SEARCH_MODAL_WIDTH = 880
export const SEARCH_MODAL_MAX_HEIGHT_VH = 70
export const SEARCH_MODAL_MAX_HEIGHT_PX = 640
export const SEARCH_MODAL_MIN_HEIGHT_PX = 320

// Skeleton hold window: time since the last keystroke before the skeleton
// dismounts and results render. Picked above average inter-key gap (~200ms)
// so fast/average typists see skeleton through a full typing burst; bump to
// 400ms only if very-slow typists report flicker.
export const SEARCH_HOLD_MS = 300

// SEARCH_MIN_SKELETON_MS = 220 — wire in once real backend latency varies and
// fast resolutions can flash the skeleton off in <220ms. Today the 300ms hold
// is already past the flash threshold, so the floor is dead weight.

export const SEARCH_MAX_ROWS = 50
