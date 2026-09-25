// Dummy NMS events, shaped like an API response. Dates are set around DEMO_TODAY
// (2026-09-25): one is already past (the UI hides it), one is in two days, and the
// rest run through December. Entries are deliberately out of order: the UI sorts them.

export type EventFormat = 'Virtual' | 'In person'
export type EventAudience = 'Stars' | 'Parents' | 'Families'

export type NmsEvent = {
  id: string
  title: string
  description: string
  format: EventFormat
  audience: EventAudience
  date: string
  // Display strings like "6:00 PM", in `timeZone`.
  startTime: string
  endTime: string
  timeZone: 'CT'
  location: string
  // Missing when there's no cap. 0 means the event is full.
  spotsLeft?: number
  // Families sign up on NMS's external event pages, not in the portal.
  rsvpUrl: string
}

const ONLINE = "Online. We'll email you the link."

export const events: NmsEvent[] = [
  {
    id: 'family-math-night-austin',
    title: 'Family Math Night in Austin',
    description:
      'Games, puzzles and snacks for the whole family. Meet other NMS families and our teachers.',
    format: 'In person',
    audience: 'Families',
    date: '2026-10-10',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    timeZone: 'CT',
    location: 'Austin Central Library, Austin, TX',
    spotsLeft: 18,
    rsvpUrl: 'https://example.com/events/family-math-night-austin',
  },
  {
    id: 'parent-qa-grade-skipping',
    title: 'Parent Q&A: Is grade skipping right for my child?',
    description:
      'Our team answers your questions about skipping a grade in math, and how to talk to your school about it.',
    format: 'Virtual',
    audience: 'Parents',
    date: '2026-10-14',
    startTime: '7:00 PM',
    endTime: '8:00 PM',
    timeZone: 'CT',
    location: ONLINE,
    rsvpUrl: 'https://example.com/events/parent-qa-grade-skipping',
  },
  {
    id: 'stars-puzzle-hunt',
    title: 'Stars Puzzle Hunt',
    description:
      'Stars team up online to crack a chain of math puzzles. No preparation needed, just curiosity!',
    format: 'Virtual',
    audience: 'Stars',
    date: '2026-09-27',
    startTime: '2:00 PM',
    endTime: '3:30 PM',
    timeZone: 'CT',
    location: ONLINE,
    rsvpUrl: 'https://example.com/events/stars-puzzle-hunt',
  },
  {
    id: 'summer-camp-info-session',
    title: 'Summer Camp Info Session',
    description: 'Hear about next summer’s math camps and how to apply.',
    format: 'Virtual',
    audience: 'Parents',
    date: '2026-09-18',
    startTime: '6:00 PM',
    endTime: '7:00 PM',
    timeZone: 'CT',
    location: ONLINE,
    rsvpUrl: 'https://example.com/events/summer-camp-info-session',
  },
  {
    id: 'competition-prep-session',
    title: 'Math Competition Prep Session',
    description:
      'A coach walks Stars through practice problems like the ones in middle school math contests.',
    format: 'Virtual',
    audience: 'Stars',
    date: '2026-10-24',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    timeZone: 'CT',
    location: ONLINE,
    spotsLeft: 6,
    rsvpUrl: 'https://example.com/events/competition-prep-session',
  },
  {
    id: 'geometry-workshop-houston',
    title: 'Hands-on Geometry Workshop',
    description: 'Stars build shapes, bridges and towers to explore geometry with their hands.',
    format: 'In person',
    audience: 'Stars',
    date: '2026-11-07',
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    timeZone: 'CT',
    location: 'Houston Museum of Science, Houston, TX',
    spotsLeft: 0,
    rsvpUrl: 'https://example.com/events/geometry-workshop-houston',
  },
  {
    id: 'family-picnic-dallas',
    title: 'Fall Family Picnic in Dallas',
    description: 'Bring a blanket! Lunch, lawn games and a math scavenger hunt in the park.',
    format: 'In person',
    audience: 'Families',
    date: '2026-11-21',
    startTime: '12:00 PM',
    endTime: '3:00 PM',
    timeZone: 'CT',
    location: 'Klyde Warren Park, Dallas, TX',
    spotsLeft: 40,
    rsvpUrl: 'https://example.com/events/family-picnic-dallas',
  },
  {
    id: 'parent-budget-workshop',
    title: 'Making the Most of Your Family Budget',
    description:
      'Ideas for spending your family budget on classes, books and camps, and how reimbursements work.',
    format: 'Virtual',
    audience: 'Parents',
    date: '2026-12-09',
    startTime: '12:00 PM',
    endTime: '1:00 PM',
    timeZone: 'CT',
    location: ONLINE,
    rsvpUrl: 'https://example.com/events/parent-budget-workshop',
  },
  {
    id: 'winter-puzzle-party',
    title: 'Winter Puzzle Party',
    description: 'Holiday-themed puzzles for Stars and their families to solve together.',
    format: 'Virtual',
    audience: 'Families',
    date: '2026-12-19',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    timeZone: 'CT',
    location: ONLINE,
    rsvpUrl: 'https://example.com/events/winter-puzzle-party',
  },
]

// Event IDs the family has signed up for, as NMS's records show them. RSVPs happen
// on the external event pages, so the portal only reads this.
export const myRsvps: string[] = ['stars-puzzle-hunt', 'family-math-night-austin']
