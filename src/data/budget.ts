// Dummy budget data, shaped like an API response (real figures live in
// Ramp/QuickBooks). Amounts are in dollars and may have cents.

export const budgetCategories = [
  'Course',
  'Summer camp',
  'Competition fees',
  'Books & supplies',
  'Travel',
] as const

export type BudgetCategory = (typeof budgetCategories)[number]

export type Transaction = {
  id: string
  date: string
  description: string
  category: BudgetCategory
  amount: number
}

// A parent's "pay me back" request. Only these are saved; seed transactions never are.
export type ReimbursementRequest = Transaction & {
  submittedAt: string
}

export const budget = { year: '2026–27', total: 2500 }

export const transactions: Transaction[] = [
  {
    id: 'txn-star-summer-camp',
    date: '2026-06-24',
    description: 'Star Summer Math Camp',
    category: 'Summer camp',
    amount: 480,
  },
  {
    id: 'txn-counting-probability',
    date: '2026-06-03',
    description: 'Counting and Probability course',
    category: 'Course',
    amount: 450,
  },
  {
    id: 'txn-lone-star-league',
    date: '2026-09-10',
    description: 'Lone Star Math League fall sign-up',
    category: 'Competition fees',
    amount: 35,
  },
  {
    id: 'txn-puzzle-lab-camp',
    date: '2026-06-10',
    description: 'Puzzle Lab Day Camp',
    category: 'Summer camp',
    amount: 285,
  },
  {
    id: 'txn-camp-bus',
    date: '2026-07-02',
    description: 'Bus tickets to Austin for summer camp',
    category: 'Travel',
    amount: 96.4,
  },
  {
    id: 'txn-practice-books',
    date: '2026-08-18',
    description: 'Competition practice books',
    category: 'Books & supplies',
    amount: 52.75,
  },
]
