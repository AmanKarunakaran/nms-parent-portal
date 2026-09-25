import type { LiveEvent } from '../../data/history'
import { formatDateRange } from './formatDates'
import './EventCard.css'

export function EventCard({ event }: { event: LiveEvent }) {
  return (
    <article className="event-card">
      <p className="event-card__kind">{event.kind}</p>
      <h4 className="event-card__name">{event.name}</h4>
      <p className="event-card__dates">{formatDateRange(event.startDate, event.endDate)}</p>
      <p className="event-card__detail">{event.location}</p>
      {event.result && (
        <p className="event-card__result">
          Result: <strong>{event.result}</strong>
        </p>
      )}
    </article>
  )
}
