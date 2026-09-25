const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Reads the parts straight from the string: `new Date('2026-01-12')` is UTC
// midnight and can render as the previous day in US time zones.
function parseIsoDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return { year, month: MONTHS[month - 1], day }
}

export function formatDate(iso: string): string {
  const { year, month, day } = parseIsoDate(iso)
  return `${month} ${day}, ${year}`
}

export function formatDateRange(startIso: string, endIso?: string): string {
  if (!endIso || endIso === startIso) return formatDate(startIso)
  const start = parseIsoDate(startIso)
  const end = parseIsoDate(endIso)
  if (start.year === end.year) {
    return `${start.month} ${start.day} – ${end.month} ${end.day}, ${end.year}`
  }
  return `${formatDate(startIso)} – ${formatDate(endIso)}`
}
