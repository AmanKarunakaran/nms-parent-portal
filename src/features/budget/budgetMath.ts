import type { BudgetCategory, ReimbursementRequest, Transaction } from '../../data/budget'

export type BudgetEntryStatus = 'Paid' | 'Pending review'

export type BudgetEntry = {
  id: string
  date: string
  description: string
  category: BudgetCategory
  amount: number
  status: BudgetEntryStatus
}

// All sums go through whole cents: 0.1 + 0.2 in floating point is 0.30000000000000004.
export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}

function sumCents(items: { amount: number }[]): number {
  return items.reduce((sum, item) => sum + toCents(item.amount), 0)
}

export function paid(transactions: Transaction[]): number {
  return sumCents(transactions) / 100
}

export function pending(requests: ReimbursementRequest[]): number {
  return sumCents(requests) / 100
}

export function remaining(
  total: number,
  transactions: Transaction[],
  requests: ReimbursementRequest[],
): number {
  const leftCents = toCents(total) - sumCents(transactions) - sumCents(requests)
  return Math.max(0, leftCents) / 100
}

// Newest first. On the same date, pending requests come before paid items, and
// the most recently submitted request comes first.
export function budgetEntries(
  transactions: Transaction[],
  requests: ReimbursementRequest[],
): BudgetEntry[] {
  const newestSubmittedFirst = [...requests].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  )
  const entries: BudgetEntry[] = [
    ...newestSubmittedFirst.map((request) => toEntry(request, 'Pending review')),
    ...transactions.map((transaction) => toEntry(transaction, 'Paid')),
  ]
  // ISO dates sort correctly as plain strings; Array.sort is stable, so ties keep
  // the order above.
  return entries.sort((a, b) => b.date.localeCompare(a.date))
}

function toEntry(item: Transaction, status: BudgetEntryStatus): BudgetEntry {
  const { id, date, description, category, amount } = item
  return { id, date, description, category, amount, status }
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatMoney(dollars: number): string {
  return money.format(dollars)
}
