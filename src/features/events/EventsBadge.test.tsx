import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../App'

describe('Events tab badge', () => {
  it('shows the count of events this week inside the Events tab link', () => {
    render(<App />)
    const badge = screen.getByRole('img', { name: "1 event you're going to this week" })
    expect(badge).toHaveTextContent('1')
    expect(screen.getByRole('link', { name: /Events/ })).toContainElement(badge)
  })

  it('leaves the red to-do badge in place', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /To-dos/ })).toContainElement(
      screen.getByRole('img', { name: 'Needs attention' }),
    )
  })
})
