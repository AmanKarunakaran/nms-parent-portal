import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import { todos } from '../../data/todos'
import { recordAction } from '../../lib/portalActions'
import { loadJson, saveJson } from '../../lib/storage'
import { readTodoLog } from './todoLog'
import { TodosTab } from './TodosTab'

const ADDRESS = 'Confirm your home address for the 2026–27 school year'
const CAMP = 'Ask to be paid back for summer camp'
const PHOTO_RELEASE = "Return the signed photo release form to your Star's teacher"
const BUDGET_PLAN = "Plan how you'll use this year's family budget"

const group = (name: string) => screen.getByRole('region', { name })
const checkbox = (title: string) => screen.getByRole('checkbox', { name: title })
const cardFor = (title: string) =>
  screen.getByRole('heading', { level: 4, name: title }).closest('article') as HTMLElement
const confirmButton = () => screen.queryByRole('button', { name: /^Mark \d+ to-dos? as done$/ })
const groupNames = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
const nonShownLog = () =>
  readTodoLog()
    .filter((entry) => entry.event !== 'shown')
    .map((entry) => [entry.todoId, entry.event])

describe('TodosTab', () => {
  it('shows the open groups, with Later collapsed and no done summary line', () => {
    render(<TodosTab />)
    expect(screen.getByRole('heading', { level: 2, name: 'To-dos' })).toBeInTheDocument()
    expect(screen.queryByText(/of \d+ done/)).not.toBeInTheDocument()
    // DOM order: the main column, then the Overdue column.
    expect(groupNames()).toEqual(['Soon', 'Coming up', 'Later', 'Overdue'])
    expect(within(group('Later')).queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('labels overdue and soon to-dos', () => {
    render(<TodosTab />)
    expect(
      within(group('Overdue')).getByText("Was due Sep 15, 2026. It's still worth finishing!"),
    ).toBeInTheDocument()
    const soonCard = cardFor(PHOTO_RELEASE)
    expect(group('Soon')).toContainElement(soonCard)
    expect(within(soonCard).getByText('Do this soon')).toBeInTheDocument()
    expect(within(soonCard).getByText(/Due Sep 30, 2026/)).toBeInTheDocument()
  })

  it('hides the confirm button until something is selected', () => {
    render(<TodosTab />)
    expect(confirmButton()).not.toBeInTheDocument()

    fireEvent.click(checkbox(PHOTO_RELEASE))
    expect(screen.getByRole('button', { name: 'Mark 1 to-do as done' })).toBeInTheDocument()

    fireEvent.click(checkbox(PHOTO_RELEASE))
    expect(confirmButton()).not.toBeInTheDocument()
  })

  it('only selects on check: nothing moves, saves or logs until confirmed', () => {
    render(<TodosTab />)
    fireEvent.click(checkbox(PHOTO_RELEASE))

    expect(checkbox(PHOTO_RELEASE)).toBeChecked()
    expect(group('Soon')).toContainElement(cardFor(PHOTO_RELEASE))
    expect(screen.queryByRole('region', { name: 'Done' })).not.toBeInTheDocument()
    expect(loadJson('todos.completed', [])).toEqual([])
    expect(nonShownLog()).toEqual([])
  })

  it('does nothing when the title is clicked', () => {
    render(<TodosTab />)
    fireEvent.click(screen.getByRole('heading', { level: 4, name: PHOTO_RELEASE }))
    expect(checkbox(PHOTO_RELEASE)).not.toBeChecked()
    expect(confirmButton()).not.toBeInTheDocument()
  })

  it('moves confirmed to-dos to Done, says so, and keeps them there after a remount', () => {
    const first = render(<TodosTab />)
    fireEvent.click(checkbox(PHOTO_RELEASE))
    fireEvent.click(screen.getByRole('button', { name: 'Show 3 more to-dos' }))
    fireEvent.click(checkbox(BUDGET_PLAN))
    fireEvent.click(screen.getByRole('button', { name: 'Mark 2 to-dos as done' }))

    expect(screen.getByRole('status')).toHaveTextContent('Nice work! 2 to-dos marked as done.')
    expect(confirmButton()).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Soon' })).not.toBeInTheDocument()
    expect(loadJson('todos.completed', [])).toEqual(['todo-photo-release', 'todo-budget-plan'])

    first.unmount()
    render(<TodosTab />)
    fireEvent.click(screen.getByRole('button', { name: 'Show 2 done to-dos' }))
    expect(within(group('Done')).getByRole('heading', { name: PHOTO_RELEASE })).toBeInTheDocument()
    expect(within(group('Done')).queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('moves a done to-do back with its undo button', () => {
    saveJson('todos.completed', ['todo-photo-release'])
    render(<TodosTab />)
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 done to-do' }))
    fireEvent.click(within(cardFor(PHOTO_RELEASE)).getByRole('button', { name: 'Move back to my to-dos' }))

    expect(screen.queryByRole('region', { name: 'Done' })).not.toBeInTheDocument()
    expect(checkbox(PHOTO_RELEASE)).not.toBeChecked()
    expect(group('Soon')).toContainElement(cardFor(PHOTO_RELEASE))
    expect(loadJson('todos.completed', ['x'])).toEqual([])
  })

  it('logs completed on confirm and uncompleted on undo, not on select', () => {
    render(<TodosTab />)
    fireEvent.click(checkbox(PHOTO_RELEASE))
    fireEvent.click(checkbox(PHOTO_RELEASE))
    fireEvent.click(checkbox(PHOTO_RELEASE))
    expect(nonShownLog()).toEqual([])

    fireEvent.click(screen.getByRole('button', { name: 'Mark 1 to-do as done' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 done to-do' }))
    fireEvent.click(screen.getByRole('button', { name: 'Move back to my to-dos' }))
    expect(nonShownLog()).toEqual([
      ['todo-photo-release', 'completed'],
      ['todo-photo-release', 'uncompleted'],
    ])
  })

  it('expands and collapses Later with a button', () => {
    render(<TodosTab />)
    const button = screen.getByRole('button', { name: 'Show 3 more to-dos' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(within(group('Later')).getAllByRole('heading', { level: 4 })).toHaveLength(3)

    fireEvent.click(screen.getByRole('button', { name: 'Hide these to-dos' }))
    expect(within(group('Later')).queryAllByRole('heading', { level: 4 })).toHaveLength(0)
  })

  it('shows a warm message in place of the lists when everything is done', () => {
    saveJson(
      'todos.completed',
      todos.filter((todo) => !todo.completedBy).map((todo) => todo.id),
    )
    saveJson(
      'actions.done',
      Object.fromEntries(todos.flatMap((todo) => (todo.completedBy ? [[todo.completedBy.action, 'x']] : []))),
    )
    render(<TodosTab />)
    expect(screen.getByText(/You're all caught up!/)).toBeInTheDocument()
    expect(groupNames()).toEqual(['Done'])
  })

  it('links to the tab where the to-do gets done, and has no link when there is none', () => {
    render(<TodosTab />)
    expect(within(cardFor(ADDRESS)).getByRole('link', { name: 'Go to Family info' })).toHaveAttribute(
      'href',
      '#/family',
    )
    expect(within(cardFor(CAMP)).getByRole('link', { name: 'Go to Budget' })).toHaveAttribute(
      'href',
      '#/budget',
    )
    expect(within(cardFor(PHOTO_RELEASE)).queryByRole('link')).not.toBeInTheDocument()
  })

  it('gives automatic to-dos no checkbox, just their hint and link', () => {
    render(<TodosTab />)
    const card = cardFor(ADDRESS)
    expect(within(card).queryByRole('checkbox')).not.toBeInTheDocument()
    expect(
      within(card).getByText('This checks itself off when you confirm or update your address.'),
    ).toBeInTheDocument()
    expect(within(card).getByRole('link', { name: 'Go to Family info' })).toBeInTheDocument()
  })

  it('moves an automatic to-do to Done once its action is recorded, with no Move back', () => {
    render(<TodosTab />)
    act(() => recordAction('family.address.confirmed'))
    expect(screen.queryByRole('region', { name: 'Overdue' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 done to-do' }))
    const card = cardFor(ADDRESS)
    expect(group('Done')).toContainElement(card)
    expect(within(card).getByText('✓ Done')).toBeInTheDocument()
    expect(within(card).queryByRole('button')).not.toBeInTheDocument()
  })

  it('never completes an automatic to-do by hand, even if its id was saved', () => {
    saveJson('todos.completed', ['todo-confirm-address'])
    render(<TodosTab />)
    expect(group('Overdue')).toContainElement(cardFor(ADDRESS))
  })

  it('logs each visible open to-do as shown once per visit', () => {
    render(
      <StrictMode>
        <TodosTab />
      </StrictMode>,
    )
    // Overdue, Soon and Coming up are open; Later is collapsed.
    expect(readTodoLog().filter((entry) => entry.event === 'shown')).toHaveLength(4)
  })
})
