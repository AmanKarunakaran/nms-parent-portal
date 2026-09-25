import { formatMoney, toCents } from './budgetMath'
import './BudgetSummary.css'

type BudgetSummaryProps = {
  total: number
  paid: number
  pending: number
  left: number
}

function percentOf(part: number, total: number): string {
  if (total <= 0) return '0%'
  return `${Math.min(100, (toCents(part) / toCents(total)) * 100)}%`
}

export function BudgetSummary({ total, paid, pending, left }: BudgetSummaryProps) {
  const barLabel =
    `Paid ${formatMoney(paid)}, waiting for review ${formatMoney(pending)}, ` +
    `left ${formatMoney(left)}, out of ${formatMoney(total)}`

  return (
    <section className="budget-summary" aria-label="Budget summary">
      <p className="budget-summary__left">
        <strong className="budget-summary__left-amount">{formatMoney(left)}</strong> left of{' '}
        {formatMoney(total)}
      </p>
      <div className="budget-summary__bar" role="img" aria-label={barLabel}>
        <span
          className="budget-summary__segment budget-summary__segment--paid"
          style={{ width: percentOf(paid, total) }}
        />
        <span
          className="budget-summary__segment budget-summary__segment--pending"
          style={{ width: percentOf(pending, total) }}
        />
      </div>
      <ul className="budget-summary__legend">
        <li>
          <span className="budget-summary__swatch budget-summary__swatch--paid" aria-hidden="true" />
          Paid {formatMoney(paid)}
        </li>
        <li>
          <span
            className="budget-summary__swatch budget-summary__swatch--pending"
            aria-hidden="true"
          />
          Waiting for review {formatMoney(pending)}
        </li>
        <li>
          <span className="budget-summary__swatch budget-summary__swatch--left" aria-hidden="true" />
          Left {formatMoney(left)}
        </li>
      </ul>
    </section>
  )
}
