import type { NmsEvent } from '../../data/events'
import { formatEventWhen } from './eventLogic'
import './UpcomingEventCard.css'

type UpcomingEventCardProps = {
  event: NmsEvent
  going: boolean
}

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="upcoming-event__link" href={href} target="_blank" rel="noopener noreferrer">
      {children} <span aria-hidden="true">↗</span>{' '}
      <span className="upcoming-event__hint">(opens a new page)</span>
    </a>
  )
}

function RsvpAction({ event, going }: UpcomingEventCardProps) {
  if (going) {
    return (
      <>
        <p className="upcoming-event__going">✓ You're going</p>
        <ExternalLink href={event.rsvpUrl}>Change or cancel your RSVP</ExternalLink>
      </>
    )
  }
  if (event.spotsLeft === 0) {
    return <p className="upcoming-event__full">This event is full</p>
  }
  return <ExternalLink href={event.rsvpUrl}>RSVP on the event page</ExternalLink>
}

export function UpcomingEventCard({ event, going }: UpcomingEventCardProps) {
  return (
    <article className="upcoming-event">
      <p className="upcoming-event__tags">
        <span className="upcoming-event__tag">{event.format}</span>
        <span className="upcoming-event__tag">For {event.audience}</span>
      </p>
      <h5 className="upcoming-event__title">{event.title}</h5>
      <p className="upcoming-event__description">{event.description}</p>
      <p className="upcoming-event__detail">{formatEventWhen(event)}</p>
      <p className="upcoming-event__detail">{event.location}</p>
      <div className="upcoming-event__action">
        <RsvpAction event={event} going={going} />
      </div>
    </article>
  )
}
