// Dummy data for the Star's history, shaped like an API response. Entries are
// deliberately out of order: the UI sorts them.

export type Course = {
  id: string
  name: string
  format: 'Online' | 'In person'
  startDate: string
  endDate: string
  status: 'Completed' | 'In progress'
  instructor: string
}

export type LiveEvent = {
  id: string
  kind: 'Competition' | 'Summer camp'
  name: string
  startDate: string
  endDate?: string
  location: string
  // Set on competitions only.
  result?: string
}

export const courses: Course[] = [
  {
    id: 'course-geometry-explorers',
    name: 'Geometry Explorers',
    format: 'In person',
    startDate: '2026-01-12',
    endDate: '2026-03-30',
    status: 'Completed',
    instructor: 'Mr. Okafor',
  },
  {
    id: 'course-counting-probability',
    name: 'Counting and Probability',
    format: 'Online',
    startDate: '2026-06-22',
    endDate: '2026-08-24',
    status: 'In progress',
    instructor: 'Ms. Chen',
  },
  {
    id: 'course-number-theory-1',
    name: 'Number Theory I',
    format: 'Online',
    startDate: '2025-09-08',
    endDate: '2025-11-17',
    status: 'Completed',
    instructor: 'Ms. Rivera',
  },
  {
    id: 'course-problem-solving',
    name: 'Problem Solving Strategies',
    format: 'Online',
    startDate: '2025-11-24',
    endDate: '2026-01-26',
    status: 'Completed',
    instructor: 'Dr. Patel',
  },
]

export const liveEvents: LiveEvent[] = [
  {
    id: 'event-hopscotch-challenge',
    kind: 'Competition',
    name: 'Hopscotch Math Challenge',
    startDate: '2026-03-19',
    location: 'Online',
    result: 'Honorable Mention',
  },
  {
    id: 'event-star-summer-camp',
    kind: 'Summer camp',
    name: 'Star Summer Math Camp',
    startDate: '2026-07-06',
    endDate: '2026-07-17',
    location: 'Austin, TX',
  },
  {
    id: 'event-lone-star-league',
    kind: 'Competition',
    name: 'Lone Star Math League: Fall Round',
    startDate: '2025-10-18',
    location: 'Online',
    result: 'Top 10%',
  },
  {
    id: 'event-mathletes-chapter-meet',
    kind: 'Competition',
    name: 'Mathletes Chapter Meet',
    startDate: '2026-02-07',
    location: 'San Antonio, TX',
    result: '3rd place, team round',
  },
  {
    id: 'event-puzzle-lab-camp',
    kind: 'Summer camp',
    name: 'Puzzle Lab Day Camp',
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    location: 'Houston, TX',
  },
]
