import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { recordAction } from '../../lib/portalActions'
import { loadJson, saveJson } from '../../lib/storage'
import { useCompletedTodos } from './useCompletedTodos'

describe('useCompletedTodos', () => {
  it('combines manual and automatic completions', () => {
    saveJson('todos.completed', ['todo-photo-release'])
    const { result } = renderHook(() => useCompletedTodos())
    act(() => recordAction('your-star.viewed'))
    expect(result.current.completed).toEqual(['todo-photo-release', 'todo-review-classes'])
  })

  it('ignores markDone and moveBack for automatic to-dos', () => {
    const { result } = renderHook(() => useCompletedTodos())
    act(() => result.current.markDone(['todo-confirm-address']))
    expect(result.current.completed).toEqual([])
    expect(loadJson('todos.completed', [])).toEqual([])

    act(() => recordAction('family.address.confirmed'))
    act(() => result.current.moveBack('todo-confirm-address'))
    expect(result.current.completed).toEqual(['todo-confirm-address'])
  })
})
