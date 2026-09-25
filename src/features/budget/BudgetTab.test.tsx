import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { loadJson } from '../../lib/storage'
import { BudgetTab } from './BudgetTab'

function fillForm(values: { description: string; category: string; date: string; amount: string }) {
  fireEvent.change(screen.getByLabelText('What did you buy?'), {
    target: { value: values.description },
  })
  fireEvent.change(screen.getByLabelText('Category'), { target: { value: values.category } })
  fireEvent.change(screen.getByLabelText('Date you paid'), { target: { value: values.date } })
  fireEvent.change(screen.getByLabelText('Amount ($)'), { target: { value: values.amount } })
  fireEvent.click(screen.getByRole('button', { name: 'Send request' }))
}

function spendingList() {
  return screen.getByRole('region', { name: 'Where your budget went' })
}

describe('BudgetTab', () => {
  it('shows the heading, how much is left, and the bar with a text summary', () => {
    render(<BudgetTab />)
    expect(screen.getByRole('heading', { level: 2, name: 'Budget' })).toBeInTheDocument()
    expect(screen.getByText("Your family's 2026–27 NMS budget")).toBeInTheDocument()
    expect(screen.getByText('$1,100.85')).toBeInTheDocument()
    expect(
      screen.getByRole('img', {
        name: 'Paid $1,399.15, waiting for review $0.00, left $1,100.85, out of $2,500.00',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Paid $1,399.15')).toBeInTheDocument()
  })

  it('lists paid items newest first', () => {
    render(<BudgetTab />)
    const headings = within(spendingList()).getAllByRole('heading', { level: 4 })
    expect(headings[0]).toHaveTextContent('Lone Star Math League fall sign-up')
    expect(headings.at(-1)).toHaveTextContent('Counting and Probability course')
    expect(within(spendingList()).getAllByText('Paid')).toHaveLength(6)
  })

  it('adds a valid request as Pending review, lowers what is left, and keeps it after a remount', () => {
    const { unmount } = render(<BudgetTab />)
    fillForm({
      description: 'Math workbook',
      category: 'Books & supplies',
      date: '2026-09-24',
      amount: '100',
    })

    expect(screen.getByRole('status')).toHaveTextContent(
      'Request sent. NMS usually reviews requests within 5 business days.',
    )
    const firstItem = within(spendingList()).getAllByRole('article')[0]
    expect(firstItem).toHaveTextContent('Math workbook')
    expect(firstItem).toHaveTextContent('Pending review')
    expect(screen.getByText('$1,000.85')).toBeInTheDocument()
    expect(screen.getByText('Waiting for review $100.00')).toBeInTheDocument()
    expect(screen.getByLabelText('What did you buy?')).toHaveValue('')

    unmount()
    render(<BudgetTab />)
    expect(within(spendingList()).getByText('Math workbook')).toBeInTheDocument()
    expect(within(spendingList()).getByText('Pending review')).toBeInTheDocument()
    expect(screen.getByText('$1,000.85')).toBeInTheDocument()
  })

  it('shows an inline error for too large an amount and saves nothing', () => {
    const { unmount } = render(<BudgetTab />)
    fillForm({
      description: 'Laptop',
      category: 'Books & supplies',
      date: '2026-09-24',
      amount: '5000',
    })

    const amount = screen.getByLabelText('Amount ($)')
    expect(amount).toHaveAttribute('aria-invalid', 'true')
    expect(amount).toHaveAccessibleDescription(
      "That's more than your remaining budget ($1,100.85).",
    )
    expect(amount).toHaveFocus()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(within(spendingList()).queryByText('Pending review')).not.toBeInTheDocument()

    unmount()
    render(<BudgetTab />)
    expect(within(spendingList()).queryByText('Laptop')).not.toBeInTheDocument()
    expect(screen.getByText('$1,100.85')).toBeInTheDocument()
  })

  it('moves focus to the first missing field when the form is empty', () => {
    render(<BudgetTab />)
    fireEvent.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getByLabelText('What did you buy?')).toHaveFocus()
    expect(screen.getByText('Please enter how much you paid.')).toBeInTheDocument()
  })

  it('records a summer camp request, but not other categories', () => {
    render(<BudgetTab />)
    fillForm({ description: 'Workbook', category: 'Books & supplies', date: '2026-09-24', amount: '10' })
    expect(loadJson('actions.done', {})).toEqual({})
    fillForm({ description: 'Camp', category: 'Summer camp', date: '2026-09-24', amount: '10' })
    expect(loadJson('actions.done', {})).toHaveProperty(['budget.summer-camp.requested'])
  })
})
