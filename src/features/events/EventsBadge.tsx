import { DEMO_TODAY } from '../../data/demoDate'
import { events, myRsvps } from '../../data/events'
import { goingThisWeek } from './eventLogic'
import './EventsBadge.css'

export function EventsBadge() {
  const count = goingThisWeek(events, myRsvps, DEMO_TODAY)
  if (count === 0) return null
  const label = `${count} ${count === 1 ? 'event' : 'events'} you're going to this week`
  return (
    <span className="events-badge" role="img" aria-label={label}>
      {count}
    </span>
  )
}
