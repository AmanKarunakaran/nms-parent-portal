import { useId } from 'react'
import type { FormatFilter } from './eventLogic'
import './FormatFilterButtons.css'

const OPTIONS: FormatFilter[] = ['All', 'In person', 'Virtual']

type FormatFilterButtonsProps = {
  value: FormatFilter
  onChange: (value: FormatFilter) => void
}

export function FormatFilterButtons({ value, onChange }: FormatFilterButtonsProps) {
  const labelId = useId()
  return (
    <div className="format-filter" role="group" aria-labelledby={labelId}>
      <span id={labelId} className="format-filter__label">
        Show
      </span>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className="format-filter__option"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
