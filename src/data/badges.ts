// Dummy merit badges (pins) for the Star, shaped like an API response. `earnedOn`
// is missing for badges still in progress.

export type Badge = {
  id: string
  name: string
  picture: string
  requirement: string
  earnedOn?: string
}

export const badges: Badge[] = [
  {
    id: 'badge-prime-hunter',
    name: 'Prime Hunter',
    picture: '🔍',
    requirement: 'Found every prime number under 100.',
    earnedOn: '2025-10-14',
  },
  {
    id: 'badge-puzzle-pro',
    name: 'Puzzle Pro',
    picture: '🧩',
    requirement: 'Solved 25 logic puzzles.',
    earnedOn: '2026-01-22',
  },
  {
    id: 'badge-competitor',
    name: 'First Competition',
    picture: '🏅',
    requirement: 'Took part in a math competition.',
    earnedOn: '2026-03-19',
  },
  {
    id: 'badge-camper',
    name: 'Summer Camper',
    picture: '🏕️',
    requirement: 'Finished an NMS summer camp.',
    earnedOn: '2026-07-17',
  },
  {
    id: 'badge-geometry',
    name: 'Shape Shifter',
    picture: '📐',
    requirement: 'Build all five Platonic solids out of paper.',
  },
  {
    id: 'badge-code',
    name: 'Code Breaker',
    picture: '🔐',
    requirement: 'Crack three secret-code challenges.',
  },
  {
    id: 'badge-stargazer',
    name: 'Stargazer',
    picture: '🔭',
    requirement: 'Measure the height of something using shadows.',
  },
  {
    id: 'badge-teacher',
    name: 'Helper Star',
    picture: '🤝',
    requirement: 'Teach a math trick to a friend or family member.',
  },
]
