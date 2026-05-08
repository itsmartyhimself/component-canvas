const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

export function formatRelativeTimeShort(
  date: Date | null,
  now: Date = new Date(),
): string {
  if (date === null) return "—"
  const delta = Math.max(0, now.getTime() - date.getTime())
  if (delta < MINUTE) return "now"
  if (delta < HOUR) return `${Math.floor(delta / MINUTE)}m`
  if (delta < DAY) return `${Math.floor(delta / HOUR)}h`
  if (delta < WEEK) return `${Math.floor(delta / DAY)}d`
  return `${Math.floor(delta / WEEK)}w`
}
