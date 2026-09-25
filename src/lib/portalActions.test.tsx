import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { recordAction, useRecordedActions } from './portalActions'
import { loadJson } from './storage'

function Reader() {
  const actions = useRecordedActions()
  return <p>{actions['your-star.viewed'] ? 'viewed' : 'not viewed'}</p>
}

describe('portalActions', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('records an action once and keeps the first timestamp', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-25T10:00:00Z'))
    recordAction('your-star.viewed')
    vi.setSystemTime(new Date('2026-09-26T10:00:00Z'))
    recordAction('your-star.viewed')
    expect(loadJson('actions.done', {})).toEqual({ 'your-star.viewed': '2026-09-25T10:00:00.000Z' })
  })

  it('updates a reader live', () => {
    render(<Reader />)
    expect(screen.getByText('not viewed')).toBeInTheDocument()
    act(() => recordAction('your-star.viewed'))
    expect(screen.getByText('viewed')).toBeInTheDocument()
  })
})
