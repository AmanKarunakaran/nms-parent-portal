import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { loadJson } from '../../lib/storage'
import { YourStarTab } from './YourStarTab'

function cardNamesIn(columnName: string) {
  const column = screen.getByRole('region', { name: columnName })
  return within(column)
    .getAllByRole('heading', { level: 4 })
    .map((heading) => heading.textContent)
}

describe('YourStarTab', () => {
  it('shows the heading and the school-year subheading', () => {
    render(<YourStarTab />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Your Star: Starry McStarface' }),
    ).toBeInTheDocument()
    expect(screen.getByText('This year: September 2025 – August 2026')).toBeInTheDocument()
  })

  it('shows a Classes column and an Events column', () => {
    render(<YourStarTab />)
    expect(screen.getByRole('heading', { level: 3, name: 'Classes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Events' })).toBeInTheDocument()
  })

  it('lists classes newest first', () => {
    render(<YourStarTab />)
    expect(cardNamesIn('Classes')).toEqual([
      'Counting and Probability',
      'Geometry Explorers',
      'Problem Solving Strategies',
      'Number Theory I',
    ])
  })

  it('lists competitions and camps together, newest first', () => {
    render(<YourStarTab />)
    expect(cardNamesIn('Events')).toEqual([
      'Star Summer Math Camp',
      'Puzzle Lab Day Camp',
      'Hopscotch Math Challenge',
      'Mathletes Chapter Meet',
      'Lone Star Math League: Fall Round',
    ])
  })

  it('shows a competition result', () => {
    render(<YourStarTab />)
    const events = screen.getByRole('region', { name: 'Events' })
    expect(within(events).getByText('Honorable Mention')).toBeInTheDocument()
  })

  it('records that the tab was opened', () => {
    render(<YourStarTab />)
    expect(loadJson('actions.done', {})).toHaveProperty(['your-star.viewed'])
  })
})

describe('Badgebook on the Your Star tab', () => {
  it('shows earned and not-yet-earned pins', () => {
    render(<YourStarTab />)
    const book = screen.getByRole('region', { name: 'Badgebook' })
    expect(within(book).getByText('Prime Hunter')).toBeInTheDocument()
    expect(within(book).getByText('Earned Oct 14, 2025')).toBeInTheDocument()
    expect(within(book).getAllByText('Not earned yet')).toHaveLength(4)
  })
})
