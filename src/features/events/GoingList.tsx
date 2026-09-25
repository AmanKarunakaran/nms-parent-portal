import { useId } from 'react'
import type { NmsEvent } from '../../data/events'
import { downloadIcs } from './downloadIcs'
import { daysUntil } from '../todos/groupTodos'
import { formatEventWhen, relativeDayLabel } from './eventLogic'
import './GoingList.css'

type GoingListProps = {
  events: readonly NmsEvent[]
  today: string
}

export function GoingList({ events, today }: GoingListProps) {
  const headingId = useId()
  return (
    <section className="going" aria-labelledby={headingId}>
      <h3 id={headingId} className="going__title">
        You're going
      </h3>
      {events.length === 0 ? (
        <p className="going__empty">You haven't signed up for anything yet. Pick an event below!</p>
      ) : (
        <ul className="going__list">
          {events.map((event) => (
            <li key={event.id} className="going__item">
              {/* Past a week the label would only repeat the date line below. */}
              {daysUntil(event.date, today) <= 6 && (
                <p className="going__when">{relativeDayLabel(event.date, today)}</p>
              )}
              <h4 className="going__name">{event.title}</h4>
              <p className="going__detail">{formatEventWhen(event)}</p>
              <p className="going__detail">{event.location}</p>
              <button type="button" className="going__calendar" onClick={() => downloadIcs(event)}>
                Add to calendar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
