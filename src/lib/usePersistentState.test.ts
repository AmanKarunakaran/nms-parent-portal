import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePersistentState } from './usePersistentState'

describe('usePersistentState', () => {
  it('keeps the value after unmounting and remounting', () => {
    const first = renderHook(() => usePersistentState('test.count', 0))
    act(() => first.result.current[1](5))
    first.unmount()

    const second = renderHook(() => usePersistentState('test.count', 0))
    expect(second.result.current[0]).toBe(5)
  })

  it('supports functional updates', () => {
    const { result } = renderHook(() => usePersistentState<string[]>('test.ids', []))
    act(() => result.current[1]((ids) => [...ids, 'a']))
    act(() => result.current[1]((ids) => [...ids, 'b']))
    expect(result.current[0]).toEqual(['a', 'b'])
  })

  it('keeps two users of the same key in sync', () => {
    const first = renderHook(() => usePersistentState<string[]>('test.shared', []))
    const second = renderHook(() => usePersistentState<string[]>('test.shared', []))
    const other = renderHook(() => usePersistentState<string[]>('test.other', ['x']))

    act(() => first.result.current[1](['a']))
    expect(second.result.current[0]).toEqual(['a'])

    act(() => second.result.current[1]([]))
    expect(first.result.current[0]).toEqual([])
    expect(other.result.current[0]).toEqual(['x'])
  })
})
