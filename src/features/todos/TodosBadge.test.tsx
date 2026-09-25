import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../App'

const ADDRESS = 'Confirm your home address for the 2026–27 school year'
const PHOTO_RELEASE = "Return the signed photo release form to your Star's teacher"

const badge = () => screen.queryByRole('img', { name: 'Needs attention' })

describe('To-dos tab badge', () => {
  it('sits inside the To-dos tab link', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /To-dos/ })).toContainElement(badge())
  })

  it('clears only once the overdue and soon to-dos are confirmed, and returns on undo', () => {
    window.location.hash = '#/todos'
    render(<App />)
    expect(badge()).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox', { name: ADDRESS }))
    fireEvent.click(screen.getByRole('checkbox', { name: PHOTO_RELEASE }))
    expect(badge()).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Mark 2 to-dos as done' }))
    expect(badge()).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show 2 done to-dos' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Move back to my to-dos' })[0])
    expect(badge()).toBeInTheDocument()
  })
})
