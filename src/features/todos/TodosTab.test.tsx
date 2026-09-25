import { fireEvent, render, screen, within } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import { todos } from '../../data/todos'
import { saveJson } from '../../lib/storage'
import { readTodoLog } from './todoLog'
import { TodosTab } from './TodosTab'

const ADDRESS = 'Confirm your home address for the 2026–27 school year'
const CAMP_RECEIPT = 'Send in your summer camp receipt'
const PHOTO_RELEASE = "Return the signed photo release form to your Star's teacher"

const group = (name: string) => screen.getByRole('region', { name })
const cardFor = (title: string) => screen.getByLabelText(title).closest('article') as HTMLElement

describe('TodosTab', () => {
  it('shows the summary and the open groups in order, with Later collapsed', () => {
    render(<TodosTab />)
    expect(screen.getByRole('heading', { level: 2, name: 'To-dos' })).toBeInTheDocument()
    expect(screen.getByText('0 of 7 done')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Overdue',
      'Urgent',
      'Coming up',
      'Later',
    ])
    expect(within(group('Later')).queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('labels overdue and urgent to-dos', () => {
    render(<TodosTab />)
    expect(
      within(group('Overdue')).getByText("Was due Sep 15, 2026. It's still worth finishing!"),
    ).toBeInTheDocument()
    const urgentCard = cardFor(PHOTO_RELEASE)
    expect(group('Urgent')).toContainElement(urgentCard)
    expect(within(urgentCard).getByText('Urgent')).toBeInTheDocument()
    expect(within(urgentCard).getByText(/Due Sep 30, 2026/)).toBeInTheDocument()
  })

  it('moves a checked to-do to Done and keeps it there after a remount', () => {
    const first = render(<TodosTab />)
    fireEvent.click(screen.getByLabelText(CAMP_RECEIPT))

    expect(screen.getByText('1 of 7 done')).toBeInTheDocument()
    expect(within(group('Coming up')).queryByLabelText(CAMP_RECEIPT)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 done to-do' }))
    expect(within(group('Done')).getByLabelText(CAMP_RECEIPT)).toBeChecked()

    first.unmount()
    render(<TodosTab />)
    expect(screen.getByText('1 of 7 done')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 done to-do' }))
    fireEvent.click(within(group('Done')).getByLabelText(CAMP_RECEIPT))

    expect(screen.getByText('0 of 7 done')).toBeInTheDocument()
    expect(within(group('Coming up')).getByLabelText(CAMP_RECEIPT)).not.toBeChecked()
  })

  it('expands and collapses Later with a button', () => {
    render(<TodosTab />)
    const button = screen.getByRole('button', { name: 'Show 3 more to-dos' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(within(group('Later')).getAllByRole('checkbox')).toHaveLength(3)

    fireEvent.click(screen.getByRole('button', { name: 'Hide these to-dos' }))
    expect(within(group('Later')).queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('shows a warm message in place of the lists when everything is done', () => {
    saveJson(
      'todos.completed',
      todos.map((todo) => todo.id),
    )
    render(<TodosTab />)
    expect(screen.getByText('7 of 7 done')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent("You're all caught up!")
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Done'])
  })

  it('links to the tab where the to-do gets done, and has no link when there is none', () => {
    render(<TodosTab />)
    expect(within(cardFor(ADDRESS)).getByRole('link', { name: 'Go to Family info' })).toHaveAttribute(
      'href',
      '#/family',
    )
    expect(within(cardFor(CAMP_RECEIPT)).getByRole('link', { name: 'Go to Budget' })).toHaveAttribute(
      'href',
      '#/budget',
    )
    expect(within(cardFor(PHOTO_RELEASE)).queryByRole('link')).not.toBeInTheDocument()
  })

  it('logs each visible open to-do as shown once per visit, and logs checking and unchecking', () => {
    render(
      <StrictMode>
        <TodosTab />
      </StrictMode>,
    )
    const shown = readTodoLog().filter((entry) => entry.event === 'shown')
    // Overdue, Urgent and Coming up are open; Later is collapsed.
    expect(shown).toHaveLength(4)

    fireEvent.click(screen.getByLabelText(ADDRESS))
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 done to-do' }))
    fireEvent.click(screen.getByLabelText(ADDRESS))
    expect(
      readTodoLog()
        .filter((entry) => entry.event !== 'shown')
        .map((entry) => [entry.todoId, entry.event]),
    ).toEqual([
      ['todo-confirm-address', 'completed'],
      ['todo-confirm-address', 'uncompleted'],
    ])
  })
})
