import { courses, liveEvents } from '../../data/history'
import { star } from '../../data/star'
import { CourseCard } from './CourseCard'
import { EventCard } from './EventCard'
import { HistoryColumn } from './HistoryColumn'
import './YourStarTab.css'

// ISO date strings sort correctly as plain strings.
function newestFirst<T extends { startDate: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.startDate.localeCompare(a.startDate))
}

export function YourStarTab() {
  return (
    <section>
      <h2 className="your-star__title">Your Star: {star.name}</h2>
      <p className="your-star__subtitle">This year: September 2025 – August 2026</p>
      <div className="your-star__columns">
        <HistoryColumn
          title="Classes"
          hint="Math courses your Star took this year"
          emptyMessage="No classes yet this year."
          items={newestFirst(courses).map((course) => ({
            key: course.id,
            card: <CourseCard course={course} />,
          }))}
        />
        <HistoryColumn
          title="Events"
          hint="Competitions and summer camps"
          emptyMessage="No events yet this year."
          items={newestFirst(liveEvents).map((event) => ({
            key: event.id,
            card: <EventCard event={event} />,
          }))}
        />
      </div>
    </section>
  )
}
