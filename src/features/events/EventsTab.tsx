import { useId, useState } from 'react'
import { DEMO_TODAY } from '../../data/demoDate'
import { events as seedEvents, myRsvps, type NmsEvent } from '../../data/events'
import { byMonth, filterByFormat, goingUpcoming, upcoming, type FormatFilter } from './eventLogic'
import { FormatFilterButtons } from './FormatFilterButtons'
import { GoingList } from './GoingList'
import { UpcomingEventCard } from './UpcomingEventCard'
import './EventsTab.css'

// The props exist for tests; the tab itself renders with the seed data.
type EventsTabProps = {
  events?: readonly NmsEvent[]
  rsvps?: readonly string[]
  today?: string
}

const EMPTY_MESSAGES: Record<FormatFilter, string> = {
  All: 'No events coming up right now. Check back soon!',
  'In person': "No in-person events coming up. Try 'All'.",
  Virtual: "No virtual events coming up. Try 'All'.",
}

export function EventsTab({ events = seedEvents, rsvps = myRsvps, today = DEMO_TODAY }: EventsTabProps) {
  const [filter, setFilter] = useState<FormatFilter>('All')
  const listHeadingId = useId()
  const going = new Set(rsvps)
  const months = byMonth(filterByFormat(upcoming(events, today), filter))

  return (
    <section className="events">
      <h2 className="events__title">Events</h2>
      <p className="events__intro">Classes, meetups, and events for your Star and your family.</p>

      <GoingList events={goingUpcoming(events, rsvps, today)} today={today} />

      <section aria-labelledby={listHeadingId}>
        <h3 id={listHeadingId} className="events__section-title">
          Upcoming events
        </h3>
        <FormatFilterButtons value={filter} onChange={setFilter} />
        {months.length === 0 ? (
          <p className="events__empty" role="status">
            {EMPTY_MESSAGES[filter]}
          </p>
        ) : (
          <div className="events__months">
            {months.map((month) => (
              <div key={month.label}>
                <h4 className="events__month">{month.label}</h4>
                <ul className="events__list">
                  {month.events.map((event) => (
                    <li key={event.id}>
                      <UpcomingEventCard event={event} going={going.has(event.id)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
