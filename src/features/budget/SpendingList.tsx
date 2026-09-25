import { useId } from 'react'
import { formatDate } from '../your-star/formatDates'
import { formatMoney, type BudgetEntry } from './budgetMath'
import './SpendingList.css'

export function SpendingList({ entries }: { entries: BudgetEntry[] }) {
  const headingId = useId()
  return (
    <section className="spending-list" aria-labelledby={headingId}>
      <h3 id={headingId} className="budget-tab__section-title">
        Where your budget went
      </h3>
      <p className="budget-tab__section-hint">Newest first</p>
      {entries.length === 0 ? (
        <p className="spending-list__empty">Nothing has been spent from your budget yet.</p>
      ) : (
        <ul className="spending-list__items">
          {entries.map((entry) => (
            <li key={entry.id}>
              <SpendingItem entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SpendingItem({ entry }: { entry: BudgetEntry }) {
  const statusModifier = entry.status === 'Paid' ? 'paid' : 'pending'
  return (
    <article className="spending-item">
      <div className="spending-item__top">
        <h4 className="spending-item__description">{entry.description}</h4>
        <span className="spending-item__amount">{formatMoney(entry.amount)}</span>
      </div>
      <div className="spending-item__bottom">
        <p className="spending-item__detail">
          {formatDate(entry.date)} · {entry.category}
        </p>
        <span className={`spending-item__status spending-item__status--${statusModifier}`}>
          {entry.status}
        </span>
      </div>
    </article>
  )
}
