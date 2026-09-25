import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useHashRoute } from './useHashRoute'

const ids = ['home', 'budget', 'events'] as const

describe('useHashRoute', () => {
  it('reads the tab id from the hash', () => {
    window.location.hash = '#/budget'
    const { result } = renderHook(() => useHashRoute(ids))
    expect(result.current).toBe('budget')
  })

  it('falls back to the first id when the hash is empty', () => {
    const { result } = renderHook(() => useHashRoute(ids))
    expect(result.current).toBe('home')
  })

  it('falls back to the first id when the hash is unknown', () => {
    window.location.hash = '#/nonsense'
    const { result } = renderHook(() => useHashRoute(ids))
    expect(result.current).toBe('home')
  })

  it('updates when the hash changes', async () => {
    const { result } = renderHook(() => useHashRoute(ids))
    window.location.hash = '#/events'
    await waitFor(() => expect(result.current).toBe('events'))
  })
})
