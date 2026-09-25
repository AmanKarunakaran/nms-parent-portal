import { describe, expect, it } from 'vitest'
import type { NmsEvent } from '../../data/events'
import {
  buildIcs,
  byMonth,
  filterByFormat,
  formatEventWhen,
  goingThisWeek,
  goingUpcoming,
  relativeDayLabel,
  upcoming,
} from './eventLogic'

const TODAY = '2026-09-25'

function makeEvent(overrides: Partial<NmsEvent> & { id: string }): NmsEvent {
  return {
    title: `Event ${overrides.id}`,
    description: 'Something fun.',
    format: 'Virtual',
    audience: 'Families',
    date: TODAY,
    startTime: '6:00 PM',
    endTime: '7:00 PM',
    timeZone: 'CT',
    location: 'Online',
    rsvpUrl: `https://example.com/events/${overrides.id}`,
    ...overrides,
  }
}

const ids = (events: readonly NmsEvent[]) => events.map((event) => event.id)

describe('upcoming', () => {
  it('drops past events and sorts the rest soonest first, keeping today', () => {
    const events = [
      makeEvent({ id: 'later', date: '2026-11-02' }),
      makeEvent({ id: 'past', date: '2026-09-24' }),
      makeEvent({ id: 'today', date: TODAY }),
      makeEvent({ id: 'soon', date: '2026-10-01' }),
    ]
    expect(ids(upcoming(events, TODAY))).toEqual(['today', 'soon', 'later'])
  })
})

describe('byMonth', () => {
  it('groups consecutive events under "Month Year" labels', () => {
    const events = [
      makeEvent({ id: 'a', date: '2026-09-30' }),
      makeEvent({ id: 'b', date: '2026-10-03' }),
      makeEvent({ id: 'c', date: '2026-10-28' }),
      makeEvent({ id: 'd', date: '2027-01-05' }),
    ]
    expect(byMonth(events).map((group) => [group.label, ids(group.events)])).toEqual([
      ['September 2026', ['a']],
      ['October 2026', ['b', 'c']],
      ['January 2027', ['d']],
    ])
  })

  it('returns no groups for no events', () => {
    expect(byMonth([])).toEqual([])
  })
})

describe('filterByFormat', () => {
  const events = [
    makeEvent({ id: 'online', format: 'Virtual' }),
    makeEvent({ id: 'austin', format: 'In person' }),
  ]

  it('keeps everything for All', () => {
    expect(ids(filterByFormat(events, 'All'))).toEqual(['online', 'austin'])
  })

  it('keeps only the chosen format', () => {
    expect(ids(filterByFormat(events, 'In person'))).toEqual(['austin'])
    expect(ids(filterByFormat(events, 'Virtual'))).toEqual(['online'])
  })
})

describe('goingUpcoming', () => {
  it('lists upcoming events the family is going to, soonest first', () => {
    const events = [
      makeEvent({ id: 'far', date: '2026-12-01' }),
      makeEvent({ id: 'not-going', date: '2026-10-01' }),
      makeEvent({ id: 'near', date: '2026-09-27' }),
      makeEvent({ id: 'past', date: '2026-09-01' }),
    ]
    expect(ids(goingUpcoming(events, ['far', 'near', 'past'], TODAY))).toEqual(['near', 'far'])
  })
})

describe('goingThisWeek', () => {
  const events = [
    makeEvent({ id: 'day-0', date: '2026-09-25' }),
    makeEvent({ id: 'day-7', date: '2026-10-02' }),
    makeEvent({ id: 'day-8', date: '2026-10-03' }),
    makeEvent({ id: 'day-past', date: '2026-09-24' }),
  ]

  it('counts events 0 through 7 days away, but not 8', () => {
    expect(goingThisWeek(events, ['day-0'], TODAY)).toBe(1)
    expect(goingThisWeek(events, ['day-7'], TODAY)).toBe(1)
    expect(goingThisWeek(events, ['day-8'], TODAY)).toBe(0)
    expect(goingThisWeek(events, ['day-0', 'day-7', 'day-8', 'day-past'], TODAY)).toBe(2)
  })

  it('ignores events the family is not going to', () => {
    expect(goingThisWeek(events, [], TODAY)).toBe(0)
  })
})

describe('relativeDayLabel', () => {
  it.each([
    ['2026-09-25', 'Today'],
    ['2026-09-26', 'Tomorrow'],
    ['2026-09-27', 'In 2 days'],
    ['2026-10-01', 'In 6 days'],
    ['2026-10-02', 'Oct 2, 2026'],
  ])('labels %s as "%s"', (date, label) => {
    expect(relativeDayLabel(date, TODAY)).toBe(label)
  })
})

describe('formatEventWhen', () => {
  it('shows the weekday, date, times and time zone', () => {
    const event = makeEvent({
      id: 'x',
      date: '2026-10-10',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
    })
    expect(formatEventWhen(event)).toBe('Sat, Oct 10, 2026 · 10:00 AM – 12:00 PM CT')
  })
})

describe('buildIcs', () => {
  const lineValue = (ics: string, name: string) =>
    ics
      .split('\r\n')
      .find((line) => line.startsWith(`${name}:`))
      ?.slice(name.length + 1)

  it('wraps one VEVENT in a VCALENDAR with UID and DTSTAMP', () => {
    const ics = buildIcs(makeEvent({ id: 'puzzle-hunt' }))
    const lines = ics.split('\r\n')
    expect(lines[0]).toBe('BEGIN:VCALENDAR')
    expect(lines.filter((line) => line === 'BEGIN:VEVENT')).toHaveLength(1)
    expect(lines.at(-2)).toBe('END:VCALENDAR')
    expect(lineValue(ics, 'UID')).toMatch(/^puzzle-hunt@/)
    expect(lineValue(ics, 'DTSTAMP')).toBe('20260925T000000Z')
  })

  it.each([
    ['9:05 AM', '10:30 AM', '20261010T090500', '20261010T103000'],
    ['6:00 PM', '7:30 PM', '20261010T180000', '20261010T193000'],
    ['12:00 PM', '1:00 PM', '20261010T120000', '20261010T130000'],
    ['12:00 AM', '12:30 AM', '20261010T000000', '20261010T003000'],
  ])('turns %s – %s into floating local times', (startTime, endTime, dtStart, dtEnd) => {
    const ics = buildIcs(makeEvent({ id: 'x', date: '2026-10-10', startTime, endTime }))
    expect(lineValue(ics, 'DTSTART')).toBe(dtStart)
    expect(lineValue(ics, 'DTEND')).toBe(dtEnd)
  })

  it('escapes backslashes, commas, semicolons and newlines', () => {
    const ics = buildIcs(
      makeEvent({
        id: 'x',
        title: 'Puzzles, games; fun',
        description: 'Line one\nC:\\path',
        location: 'Austin Central Library, Austin, TX',
      }),
    )
    expect(lineValue(ics, 'SUMMARY')).toBe('Puzzles\\, games\\; fun')
    expect(lineValue(ics, 'DESCRIPTION')).toBe('Line one\\nC:\\\\path')
    expect(lineValue(ics, 'LOCATION')).toBe('Austin Central Library\\, Austin\\, TX')
  })

  it('uses CRLF line endings throughout', () => {
    const ics = buildIcs(makeEvent({ id: 'x' }))
    expect(ics.endsWith('\r\n')).toBe(true)
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/)
  })

  it('folds lines longer than 75 bytes onto continuation lines', () => {
    const ics = buildIcs(makeEvent({ id: 'x', description: 'a'.repeat(200) }))
    const lines = ics.split('\r\n')
    expect(lines.every((line) => line.length <= 75)).toBe(true)
    const unfolded = ics.replace(/\r\n /g, '')
    expect(lineValue(unfolded, 'DESCRIPTION')).toBe('a'.repeat(200))
  })
})
