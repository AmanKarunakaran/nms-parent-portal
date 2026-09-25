import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { recordAction } from '../../lib/portalActions'
import { saveJson } from '../../lib/storage'
import { FamilyTab } from '../family/FamilyTab'
import { TodosBadge } from './TodosBadge'

const PHOTO_RELEASE = "Return the signed photo release form to your Star's teacher"

const badge = () => screen.queryByRole('img', { name: 'Needs attention' })

describe('To-dos tab badge', () => {
  it('sits inside the To-dos tab link', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /To-dos/ })).toContainElement(badge())
  })

  it('clears only once the overdue and soon to-dos are done, and returns on undo', () => {
    window.location.hash = '#/todos'
    render(<App />)
    expect(badge()).toBeInTheDocument()

    act(() => recordAction('family.address.confirmed'))
    expect(badge()).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox', { name: PHOTO_RELEASE }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark 1 to-do as done' }))
    expect(badge()).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show 2 done to-dos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Move back to my to-dos' }))
    expect(badge()).toBeInTheDocument()
  })

  it('clears when the address is confirmed on the Family tab', () => {
    saveJson('todos.completed', ['todo-photo-release'])
    render(
      <>
        <TodosBadge />
        <FamilyTab />
      </>,
    )
    expect(badge()).toBeInTheDocument()

    const address = screen.getByRole('region', { name: 'Home address' })
    fireEvent.click(within(address).getByRole('button', { name: 'Yes, this is correct' }))
    expect(badge()).not.toBeInTheDocument()
  })
})
