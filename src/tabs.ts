import type { ComponentType } from 'react'
import { BudgetTab } from './features/budget/BudgetTab'
import { YourStarTab } from './features/your-star/YourStarTab'

export type Tab = {
  id: string
  label: string
  Component: ComponentType
}

// Tabs render in this order. Adding a section = one new entry here.
export const tabs: readonly Tab[] = [
  { id: 'your-star', label: 'Your Star', Component: YourStarTab },
  { id: 'budget', label: 'Budget', Component: BudgetTab },
]
