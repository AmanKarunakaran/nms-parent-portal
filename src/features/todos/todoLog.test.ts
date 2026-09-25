import { renderHook } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import { logTodoEvents, MAX_LOG_ENTRIES, readTodoLog, useLogShownOnce } from './todoLog'

describe('todoLog', () => {
  it('saves entries with a timestamp', () => {
    logTodoEvents([{ todoId: 'a', event: 'completed' }])
    const [entry] = readTodoLog()
    expect(entry).toMatchObject({ todoId: 'a', event: 'completed' })
    expect(new Date(entry.at).toISOString()).toBe(entry.at)
  })

  it(`keeps only the newest ${MAX_LOG_ENTRIES} entries`, () => {
    logTodoEvents(
      Array.from({ length: MAX_LOG_ENTRIES }, (_, i) => ({ todoId: `old-${i}`, event: 'shown' as const })),
    )
    logTodoEvents([
      { todoId: 'new-1', event: 'completed' },
      { todoId: 'new-2', event: 'uncompleted' },
    ])

    const log = readTodoLog()
    expect(log).toHaveLength(MAX_LOG_ENTRIES)
    expect(log[0].todoId).toBe('old-2')
    expect(log.at(-1)?.todoId).toBe('new-2')
  })

  it('logs "shown" once per visit, even under StrictMode and re-renders', () => {
    const ids = ['a', 'b']
    const visit = renderHook(({ todoIds }) => useLogShownOnce(todoIds), {
      initialProps: { todoIds: ids },
      wrapper: StrictMode,
    })
    visit.rerender({ todoIds: ['a'] })
    expect(readTodoLog().map((entry) => [entry.todoId, entry.event])).toEqual([
      ['a', 'shown'],
      ['b', 'shown'],
    ])

    visit.unmount()
    renderHook(() => useLogShownOnce(ids), { wrapper: StrictMode })
    expect(readTodoLog()).toHaveLength(4)
  })
})
