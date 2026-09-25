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
    const link = screen.getByRole('link', { name: 'Your Star' })
    expect(link).toHaveAttribute('href', '#/your-star')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(
      screen.getByRole('heading', { name: 'Your Star: Starry McStarface' }),
    ).toBeInTheDocument()
  })

  it('opens the first tab when the hash is unknown', () => {
    window.location.hash = '#/nonsense'
    render(<App />)
    expect(screen.getByRole('link', { name: 'Your Star' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('shows a Reset demo data button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Reset demo data' })).toBeInTheDocument()
  })
})
