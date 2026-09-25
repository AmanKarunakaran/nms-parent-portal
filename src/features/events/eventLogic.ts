import { DEMO_TODAY } from '../../data/demoDate'
import type { EventFormat, NmsEvent } from '../../data/events'
import { daysUntil } from '../todos/groupTodos'
import { formatDate } from '../your-star/formatDates'

export type FormatFilter = 'All' | EventFormat

export type MonthGroup = {
  label: string
  events: NmsEvent[]
}

export const THIS_WEEK_DAYS = 7

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function isoParts(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return { year, month, day }
}

// ISO dates sort as strings.
export function upcoming(events: readonly NmsEvent[], today: string): NmsEvent[] {
  return events
    .filter((event) => daysUntil(event.date, today) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Keeps the input order, so pass events that are already sorted.
export function byMonth(events: readonly NmsEvent[]): MonthGroup[] {
  const groups: MonthGroup[] = []
  for (const event of events) {
    const { year, month } = isoParts(event.date)
    const label = `${MONTHS[month - 1]} ${year}`
    const last = groups.at(-1)
    if (last?.label === label) last.events.push(event)
    else groups.push({ label, events: [event] })
  }
  return groups
}

export function filterByFormat(events: readonly NmsEvent[], filter: FormatFilter): NmsEvent[] {
  return filter === 'All' ? [...events] : events.filter((event) => event.format === filter)
}

export function goingUpcoming(
  events: readonly NmsEvent[],
  rsvps: readonly string[],
  today: string,
): NmsEvent[] {
  const going = new Set(rsvps)
  return upcoming(events, today).filter((event) => going.has(event.id))
}

export function goingThisWeek(
  events: readonly NmsEvent[],
  rsvps: readonly string[],
  today: string,
): number {
  return goingUpcoming(events, rsvps, today).filter(
    (event) => daysUntil(event.date, today) <= THIS_WEEK_DAYS,
  ).length
}

export function relativeDayLabel(date: string, today: string): string {
  const days = daysUntil(date, today)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days >= 2 && days <= 6) return `In ${days} days`
  return formatDate(date)
}

// "Sat, Oct 10, 2026 · 10:00 AM – 12:00 PM CT"
export function formatEventWhen(event: NmsEvent): string {
  const { year, month, day } = isoParts(event.date)
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
  return `${weekday}, ${formatDate(event.date)} · ${event.startTime} – ${event.endTime} ${event.timeZone}`
}

const pad = (value: number) => String(value).padStart(2, '0')

// "6:00 PM" -> { hours: 18, minutes: 0 }. 12:xx AM is midnight; 12:xx PM is noon.
function parseTime(time: string): { hours: number; minutes: number } {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim())
  if (!match) throw new Error(`Unrecognized time: ${time}`)
  const hour12 = Number(match[1]) % 12
  const isPm = match[3].toUpperCase() === 'PM'
  return { hours: isPm ? hour12 + 12 : hour12, minutes: Number(match[2]) }
}

// Floating local time (no Z or TZID): the calendar app shows it in the device's
// own time zone. Fine while every event is listed in CT for families in CT.
function icsDateTime(date: string, time: string): string {
  const { year, month, day } = isoParts(date)
  const { hours, minutes } = parseTime(time)
  return `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// RFC 5545 caps lines at 75 bytes; longer ones continue on lines starting with a space.
function foldLine(line: string): string {
  const encoder = new TextEncoder()
  const chunks: string[] = []
  let current = ''
  let currentBytes = 0
  for (const char of line) {
    const bytes = encoder.encode(char).length
    const limit = chunks.length === 0 ? 75 : 74
    if (currentBytes + bytes > limit) {
      chunks.push(current)
      current = ''
      currentBytes = 0
    }
    current += char
    currentBytes += bytes
  }
  chunks.push(current)
  return chunks.join('\r\n ')
}

// DTSTAMP uses DEMO_TODAY rather than the clock, so the output is deterministic.
export function buildIcs(event: NmsEvent): string {
  const { year, month, day } = isoParts(DEMO_TODAY)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//National Math Stars//Parent Portal//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@parent-portal.nationalmathstars.org`,
    `DTSTAMP:${year}${pad(month)}${pad(day)}T000000Z`,
    `DTSTART:${icsDateTime(event.date, event.startTime)}`,
    `DTEND:${icsDateTime(event.date, event.endTime)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    `URL:${event.rsvpUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(foldLine).join('\r\n') + '\r\n'
}
