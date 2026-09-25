import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { events, myRsvps, type NmsEvent } from '../../data/events'
import { EventsTab } from './EventsTab'

const PUZZLE_HUNT = 'Stars Puzzle Hunt'
const FAMILY_NIGHT = 'Family Math Night in Austin'
const GRADE_SKIPPING = 'Parent Q&A: Is grade skipping right for my child?'
const GEOMETRY = 'Hands-on Geometry Workshop'
const PAST = 'Summer Camp Info Session'

const goingSection = () => screen.getByRole('region', { name: "You're going" })
const upcomingSection = () => screen.getByRole('region', { name: 'Upcoming events' })
const cardFor = (title: string) =>
  within(upcomingSection()).getByRole('heading', { name: title }).closest('article') as HTMLElement

// jsdom doesn't implement these, so the test assigns stubs and puts back whatever was there.
const { createObjectURL, revokeObjectURL } = URL

afterEach(() => {
  vi.restoreAllMocks()
  URL.createObjectURL = createObjectURL
  URL.revokeObjectURL = revokeObjectURL
})

describe('EventsTab', () => {
  it('shows the heading and intro', () => {
    render(<EventsTab />)
    expect(screen.getByRole('heading', { level: 2, name: 'Events' })).toBeInTheDocument()
    expect(
      screen.getByText('Classes, meetups, and events for your Star and your family.'),
    ).toBeInTheDocument()
  })

  it('lists the events the family is going to, soonest first, with a relative day', () => {
    render(<EventsTab />)
    const items = within(goingSection()).getAllByRole('listitem')
    expect(items.map((item) => within(item).getByRole('heading').textContent)).toEqual([
      PUZZLE_HUNT,
      FAMILY_NIGHT,
    ])
    expect(within(items[0]).getByText('In 2 days')).toBeInTheDocument()
    expect(within(items[1]).getByText('Sat, Oct 10, 2026 · 10:00 AM – 12:00 PM CT')).toBeInTheDocument()
    expect(within(items[1]).getByText('Austin Central Library, Austin, TX')).toBeInTheDocument()
  })

  it('shows a friendly message when the family is not going to anything', () => {
    render(<EventsTab rsvps={[]} />)
    expect(
      within(goingSection()).getByText("You haven't signed up for anything yet. Pick an event below!"),
    ).toBeInTheDocument()
  })

  it('groups upcoming events by month and hides past events', () => {
    render(<EventsTab />)
    expect(
      within(upcomingSection())
        .getAllByRole('heading', { level: 4 })
        .map((heading) => heading.textContent),
    ).toEqual(['September 2026', 'October 2026', 'November 2026', 'December 2026'])
    expect(screen.queryByText(PAST)).not.toBeInTheDocument()
  })

  it('marks events the family is going to, with a link to change the RSVP', () => {
    render(<EventsTab />)
    for (const id of myRsvps) {
      const event = events.find((e) => e.id === id) as NmsEvent
      const card = cardFor(event.title)
      expect(within(card).getByText("✓ You're going")).toBeInTheDocument()
      const link = within(card).getByRole('link', { name: /Change or cancel your RSVP/ })
      expect(link).toHaveAttribute('href', `https://example.com/events/${id}`)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('links to the event page to RSVP, noting it opens a new page', () => {
    render(<EventsTab />)
    const card = cardFor(GRADE_SKIPPING)
    expect(within(card).queryByText("✓ You're going")).not.toBeInTheDocument()
    const link = within(card).getByRole('link', { name: /RSVP on the event page/ })
    expect(link).toHaveAttribute('href', 'https://example.com/events/parent-qa-grade-skipping')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveTextContent('(opens a new page)')
  })

  it('says a full event is full and offers no link', () => {
    render(<EventsTab />)
    const card = cardFor(GEOMETRY)
    expect(within(card).getByText('This event is full')).toBeInTheDocument()
    expect(within(card).queryByRole('link')).not.toBeInTheDocument()
  })

  it('narrows the list with the format filter', () => {
    render(<EventsTab />)
    const all = screen.getByRole('button', { name: 'All' })
    const inPerson = screen.getByRole('button', { name: 'In person' })
    expect(screen.getByRole('group', { name: 'Show' })).toContainElement(all)
    expect(all).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(inPerson)
    expect(inPerson).toHaveAttribute('aria-pressed', 'true')
    expect(all).toHaveAttribute('aria-pressed', 'false')
    expect(within(upcomingSection()).getAllByRole('article')).toHaveLength(3)
    expect(within(upcomingSection()).queryByText(GRADE_SKIPPING)).not.toBeInTheDocument()
    // The "You're going" list doesn't follow the filter.
    expect(within(goingSection()).getByText(PUZZLE_HUNT)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Virtual' }))
    expect(within(upcomingSection()).getByText(GRADE_SKIPPING)).toBeInTheDocument()
    expect(within(upcomingSection()).queryByText(FAMILY_NIGHT)).not.toBeInTheDocument()
  })

  it('suggests "All" when a filter leaves nothing to show', () => {
    render(<EventsTab events={events.filter((event) => event.format === 'In person')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Virtual' }))
    expect(screen.getByText("No virtual events coming up. Try 'All'.")).toBeInTheDocument()
    expect(within(upcomingSection()).queryAllByRole('article')).toHaveLength(0)
  })

  it('downloads a calendar file from Add to calendar', () => {
    const createStub = vi.fn((_blob: Blob) => 'blob:event')
    const revokeStub = vi.fn()
    URL.createObjectURL = createStub
    URL.revokeObjectURL = revokeStub
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      expect(this.download).toBe('stars-puzzle-hunt.ics')
      expect(this.getAttribute('href')).toBe('blob:event')
    })

    render(<EventsTab />)
    const item = within(goingSection()).getAllByRole('listitem')[0]
    fireEvent.click(within(item).getByRole('button', { name: 'Add to calendar' }))

    expect(createStub).toHaveBeenCalledTimes(1)
    const blob = createStub.mock.calls[0][0]
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('text/calendar')
    expect(click).toHaveBeenCalledTimes(1)
    expect(revokeStub).toHaveBeenCalledWith('blob:event')
  })
})
