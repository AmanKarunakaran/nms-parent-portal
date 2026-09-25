import { describe, expect, it } from 'vitest'
import type { ReimbursementRequest, Transaction } from '../../data/budget'
import { budgetEntries, formatMoney, paid, pending, remaining } from './budgetMath'

function transaction(id: string, date: string, amount: number): Transaction {
  return { id, date, description: `Item ${id}`, category: 'Course', amount }
}

function request(
  id: string,
  date: string,
  amount: number,
  submittedAt = '2026-09-25T12:00:00.000Z',
): ReimbursementRequest {
  return { ...transaction(id, date, amount), category: 'Travel', submittedAt }
}

describe('paid, pending and remaining', () => {
  const transactions = [transaction('a', '2026-06-01', 400), transaction('b', '2026-07-01', 100.5)]
  const requests = [request('r1', '2026-09-01', 49.5)]

  it('adds up paid items and pending requests separately', () => {
    expect(paid(transactions)).toBe(500.5)
    expect(pending(requests)).toBe(49.5)
  })

  it('takes both paid and pending off the total', () => {
    expect(remaining(1000, transactions, requests)).toBe(450)
  })

  it('never goes below zero', () => {
    expect(remaining(500, transactions, requests)).toBe(0)
  })

  it('keeps cents exact', () => {
    const pennies = [transaction('x', '2026-06-01', 0.1), transaction('y', '2026-06-02', 0.2)]
    expect(paid(pennies)).toBe(0.3)
    expect(remaining(1, pennies, [])).toBe(0.7)
  })

  it('is zero for empty lists', () => {
    expect(paid([])).toBe(0)
    expect(pending([])).toBe(0)
    expect(remaining(2500, [], [])).toBe(2500)
  })
})

describe('budgetEntries', () => {
  it('lists everything newest first, marking seed items Paid and requests Pending review', () => {
    const entries = budgetEntries(
      [transaction('old', '2026-06-01', 10), transaction('mid', '2026-08-01', 10)],
      [request('new', '2026-09-01', 10), request('older-request', '2026-07-01', 10)],
    )
    expect(entries.map((entry) => [entry.id, entry.status])).toEqual([
      ['new', 'Pending review'],
      ['mid', 'Paid'],
      ['older-request', 'Pending review'],
      ['old', 'Paid'],
    ])
  })

  it('on the same date, shows the newest request first, then paid items', () => {
    const entries = budgetEntries(
      [transaction('paid', '2026-09-01', 10)],
      [
        request('first', '2026-09-01', 10, '2026-09-20T10:00:00.000Z'),
        request('second', '2026-09-01', 10, '2026-09-21T10:00:00.000Z'),
      ],
    )
    expect(entries.map((entry) => entry.id)).toEqual(['second', 'first', 'paid'])
  })

  it('does not copy submittedAt onto entries', () => {
    const [entry] = budgetEntries([], [request('r', '2026-09-01', 10)])
    expect(entry).not.toHaveProperty('submittedAt')
  })
})

describe('formatMoney', () => {
  it('formats US dollars with cents and thousands separators', () => {
    expect(formatMoney(2500)).toBe('$2,500.00')
    expect(formatMoney(1100.85)).toBe('$1,100.85')
    expect(formatMoney(0)).toBe('$0.00')
    expect(formatMoney(0.1 + 0.2)).toBe('$0.30')
  })
})
