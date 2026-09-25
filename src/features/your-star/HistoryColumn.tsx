import { useId, type ReactNode } from 'react'
import './HistoryColumn.css'

type HistoryColumnProps = {
  title: string
  hint: string
  emptyMessage: string
  items: { key: string; card: ReactNode }[]
}

export function HistoryColumn({ title, hint, emptyMessage, items }: HistoryColumnProps) {
  const headingId = useId()
  return (
    <section className="history-column" aria-labelledby={headingId}>
      <h3 id={headingId} className="history-column__title">
        {title}
      </h3>
      <p className="history-column__hint">{hint}</p>
      {items.length === 0 ? (
        <p className="history-column__empty">{emptyMessage}</p>
      ) : (
        <ul className="history-column__list">
          {items.map((item) => (
            <li key={item.key}>{item.card}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
