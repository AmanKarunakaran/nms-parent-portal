import type { ComponentType } from 'react'
import { BudgetTab } from './features/budget/BudgetTab'
import { FamilyTab } from './features/family/FamilyTab'
import { YourStarTab } from './features/your-star/YourStarTab'

export type Tab = {
  id: string
  label: string
  Component: ComponentType
  // Drawn at the top-right of the tab label. It renders nothing when there's
  // nothing to flag.
  Badge?: ComponentType
}

// Tabs render in this order. Adding a section = one new entry here.
export const tabs: readonly Tab[] = [
  { id: 'your-star', label: 'Your Star', Component: YourStarTab },
  { id: 'family', label: 'Family info', Component: FamilyTab },
  { id: 'budget', label: 'Budget', Component: BudgetTab },
]
