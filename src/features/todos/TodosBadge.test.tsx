import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../App'

const ADDRESS = 'Confirm your home address for the 2026–27 school year'
const PHOTO_RELEASE = "Return the signed photo release form to your Star's teacher"
const CAMP_RECEIPT = 'Send in your summer camp receipt'

const badge = () => screen.queryByRole('img', { name: 'Needs attention' })

describe('To-dos tab badge', () => {
  it('sits inside the To-dos tab link', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /To-dos/ })).toContainElement(badge())
  })

  it('clears live once overdue and urgent to-dos are done, and returns when one is unchecked', () => {
    window.location.hash = '#/todos'
    render(<App />)
    expect(badge()).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(CAMP_RECEIPT))
    fireEvent.click(screen.getByLabelText(ADDRESS))
    expect(badge()).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(PHOTO_RELEASE))
    expect(badge()).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show 3 done to-dos' }))
    fireEvent.click(screen.getByLabelText(PHOTO_RELEASE))
    expect(badge()).toBeInTheDocument()
  })
})
