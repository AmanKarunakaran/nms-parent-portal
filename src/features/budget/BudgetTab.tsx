import { budget, transactions, type ReimbursementRequest } from '../../data/budget'
import { recordAction } from '../../lib/portalActions'
import { usePersistentState } from '../../lib/usePersistentState'
import { BudgetSummary } from './BudgetSummary'
import { budgetEntries, paid, pending, remaining } from './budgetMath'
import { ReimbursementForm } from './ReimbursementForm'
import { SpendingList } from './SpendingList'
import './BudgetTab.css'

export function BudgetTab() {
  const [requests, setRequests] = usePersistentState<ReimbursementRequest[]>(
    'budget.reimbursements',
    [],
  )
  const left = remaining(budget.total, transactions, requests)

  return (
    <section>
      <h2 className="budget-tab__title">Budget</h2>
      <p className="budget-tab__subtitle">Your family's {budget.year} NMS budget</p>
      <BudgetSummary
        total={budget.total}
        paid={paid(transactions)}
        pending={pending(requests)}
        left={left}
      />
      <div className="budget-tab__columns">
        <SpendingList entries={budgetEntries(transactions, requests)} />
        <ReimbursementForm
          left={left}
          onSubmit={(request) => {
            setRequests((current) => [...current, request])
            if (request.category === 'Summer camp') recordAction('budget.summer-camp.requested')
          }}
        />
      </div>
    </section>
  )
}
