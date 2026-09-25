import type { Course } from '../../data/history'
import { formatDateRange } from './formatDates'
import './CourseCard.css'

export function CourseCard({ course }: { course: Course }) {
  const statusModifier = course.status === 'In progress' ? 'in-progress' : 'completed'
  return (
    <article className="course-card">
      <div className="course-card__top">
        <h4 className="course-card__name">{course.name}</h4>
        <span className={`course-card__status course-card__status--${statusModifier}`}>
          {course.status}
        </span>
      </div>
      <p className="course-card__dates">{formatDateRange(course.startDate, course.endDate)}</p>
      <p className="course-card__detail">
        {course.format} · Instructor: {course.instructor}
      </p>
    </article>
  )
}
