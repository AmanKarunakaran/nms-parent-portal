import { fireEvent, render, screen, within } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import { todos } from '../../data/todos'
import { loadJson, saveJson } from '../../lib/storage'
import { readTodoLog } from './todoLog'
import { TodosTab } from './TodosTab'

const ADDRESS = 'Confirm your home address for the 2026–27 school year'
const CAMP_RECEIPT = 'Send in your summer camp receipt'
const PHOTO_RELEASE = "Return the signed photo release form to your Star's teacher"
const CONTACT = 'Add a second emergency contact'

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

    fireEvent.click(checkbox(CAMP_RECEIPT))
    expect(screen.getByRole('button', { name: 'Mark 1 to-do as done' })).toBeInTheDocument()

    fireEvent.click(checkbox(CAMP_RECEIPT))
    expect(confirmButton()).not.toBeInTheDocument()
  })

  it('only selects on check: nothing moves, saves or logs until confirmed', () => {
    render(<TodosTab />)
    fireEvent.click(checkbox(CAMP_RECEIPT))

    expect(checkbox(CAMP_RECEIPT)).toBeChecked()
    expect(group('Coming up')).toContainElement(cardFor(CAMP_RECEIPT))
    expect(screen.queryByRole('region', { name: 'Done' })).not.toBeInTheDocument()
    expect(loadJson('todos.completed', [])).toEqual([])
    expect(nonShownLog()).toEqual([])
  })

  it('does nothing when the title is clicked', () => {
    render(<TodosTab />)
    fireEvent.click(screen.getByRole('heading', { level: 4, name: CAMP_RECEIPT }))
    expect(checkbox(CAMP_RECEIPT)).not.toBeChecked()
    expect(confirmButton()).not.toBeInTheDocument()
  })

  it('moves confirmed to-dos to Done, says so, and keeps them there after a remount', () => {
    const first = render(<TodosTab />)
    fireEvent.click(checkbox(CAMP_RECEIPT))
    fireEvent.click(checkbox(CONTACT))
    fireEvent.click(screen.getByRole('button', { name: 'Mark 2 to-dos as done' }))

    expect(screen.getByRole('status')).toHaveTextContent('Nice work! 2 to-dos marked as done.')
    expect(confirmButton()).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Coming up' })).not.toBeInTheDocument()
    expect(loadJson('todos.completed', [])).toEqual(['todo-camp-receipt', 'todo-emergency-contact'])

    first.unmount()
    render(<TodosTab />)
    fireEvent.click(screen.getByRole('button', { name: 'Show 2 done to-dos' }))
    expect(within(group('Done')).getByRole('heading', { name: CAMP_RECEIPT })).toBeInTheDocument()
    expect(within(group('Done')).queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('moves a done to-do back with its undo button', () => {
    saveJson('todos.completed', ['todo-camp-receipt'])
    render(<TodosTab />)
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 done to-do' }))
    fireEvent.click(within(cardFor(CAMP_RECEIPT)).getByRole('button', { name: 'Move back to my to-dos' }))

    expect(screen.queryByRole('region', { name: 'Done' })).not.toBeInTheDocument()
    expect(checkbox(CAMP_RECEIPT)).not.toBeChecked()
    expect(group('Coming up')).toContainElement(cardFor(CAMP_RECEIPT))
    expect(loadJson('todos.completed', ['x'])).toEqual([])
  })

  it('logs completed on confirm and uncompleted on undo, not on select', () => {
    render(<TodosTab />)
    fireEvent.click(checkbox(ADDRESS))
    fireEvent.click(checkbox(ADDRESS))
    fireEvent.click(checkbox(ADDRESS))
    expect(nonShownLog()).toEqual([])

    fireEvent.click(screen.getByRole('button', { name: 'Mark 1 to-do as done' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show 1 done to-do' }))
    fireEvent.click(screen.getByRole('button', { name: 'Move back to my to-dos' }))
    expect(nonShownLog()).toEqual([
      ['todo-confirm-address', 'completed'],
      ['todo-confirm-address', 'uncompleted'],
    ])
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
    expect(screen.getByText(/You're all caught up!/)).toBeInTheDocument()
    expect(groupNames()).toEqual(['Done'])
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
