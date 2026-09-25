import { describe, expect, it } from 'vitest'
import { formatDate, formatDateRange } from './formatDates'

describe('formatDate', () => {
  it('writes a single date in plain words without shifting the day', () => {
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026')
    expect(formatDate('2025-12-31')).toBe('Dec 31, 2025')
  })
})

describe('formatDateRange', () => {
  it('shows a single date when there is no end date', () => {
    expect(formatDateRange('2026-03-19')).toBe('Mar 19, 2026')
  })

  it('names the year once for a range within one year', () => {
    expect(formatDateRange('2026-01-12', '2026-03-30')).toBe('Jan 12 – Mar 30, 2026')
  })

  it('names both years for a range that crosses a year', () => {
    expect(formatDateRange('2025-11-24', '2026-01-26')).toBe('Nov 24, 2025 – Jan 26, 2026')
  })
})
