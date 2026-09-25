import type { NmsEvent } from '../../data/events'
import { buildIcs } from './eventLogic'

// Opening the .ics file adds the event in the phone's or computer's calendar app.
export function downloadIcs(event: NmsEvent) {
  const blob = new Blob([buildIcs(event)], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.id}.ics`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
