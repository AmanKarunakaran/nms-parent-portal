import { budgetCategories, type BudgetCategory } from '../../data/budget'
import { formatMoney, toCents } from './budgetMath'

// Raw form values, exactly as typed.
export type ReimbursementForm = {
  description: string
  category: string
  date: string
  amount: string
}

export type ReimbursementField = keyof ReimbursementForm

export type ReimbursementErrors = Partial<Record<ReimbursementField, string>>

// Also the order focus moves in: the first invalid field gets focus.
export const reimbursementFields: readonly ReimbursementField[] = [
  'description',
  'category',
  'date',
  'amount',
]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// Accepts what people naturally type: "25", "25.50", "$25.50", "1,200".
export function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, '')
  if (cleaned === '' || !/^\d*\.?\d*$/.test(cleaned)) return Number.NaN
  return Number(cleaned)
}

export function isBudgetCategory(value: string): value is BudgetCategory {
  return (budgetCategories as readonly string[]).includes(value)
}

export function validateReimbursement(
  form: ReimbursementForm,
  remainingDollars: number,
  today: string,
): ReimbursementErrors {
  const errors: ReimbursementErrors = {}

  if (form.description.trim() === '') {
    errors.description = 'Please tell us what you bought.'
  }

  if (!isBudgetCategory(form.category)) {
    errors.category = 'Please choose a category.'
  }

  if (!ISO_DATE.test(form.date)) {
    errors.date = 'Please enter the date you paid.'
  } else if (form.date > today) {
    errors.date = "The date can't be in the future."
  }

  if (form.amount.trim() === '') {
    errors.amount = 'Please enter how much you paid.'
  } else {
    const amount = parseAmount(form.amount)
    if (Number.isNaN(amount) || toCents(amount) <= 0) {
      errors.amount = 'Please enter an amount more than $0, like 25.50.'
    } else if (toCents(amount) > toCents(remainingDollars)) {
      errors.amount = `That's more than your remaining budget (${formatMoney(remainingDollars)}).`
    }
  }

  return errors
}
