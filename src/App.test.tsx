import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('shows the portal title and the Star in the header', () => {
    render(<App />)
    const header = screen.getByRole('banner')
    expect(header).toHaveTextContent('National Math Stars Parent Portal')
    expect(header).toHaveTextContent('Starry McStarface')
  })

  it('opens on the Your Star tab', () => {
    render(<App />)
    expect(screen.getByRole('tab', { name: 'Your Star' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(
      screen.getByRole('heading', { name: 'Your Star: Starry McStarface' }),
    ).toBeInTheDocument()
  })
})
