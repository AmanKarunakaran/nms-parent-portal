import { useEffect, useRef } from 'react'
import { loadJson, saveJson } from '../../lib/storage'

// A record of when to-dos are shown and checked off, kept for A/B testing nudges
// later. Nothing reads it in the portal yet.

export type TodoLogEvent = 'shown' | 'completed' | 'uncompleted'
export type TodoLogEntry = { todoId: string; event: TodoLogEvent; at: string }

export const TODO_LOG_KEY = 'todos.log'
export const MAX_LOG_ENTRIES = 500

export function readTodoLog(): TodoLogEntry[] {
  return loadJson<TodoLogEntry[]>(TODO_LOG_KEY, [])
}

export function logTodoEvents(events: readonly Omit<TodoLogEntry, 'at'>[]): void {
  if (events.length === 0) return
  const at = new Date().toISOString()
  const entries = [...readTodoLog(), ...events.map((event) => ({ ...event, at }))]
  saveJson(TODO_LOG_KEY, entries.slice(-MAX_LOG_ENTRIES))
}

// Logs once per mount. The ref survives StrictMode's second effect run, so a dev
// build doesn't double-log a visit.
export function useLogShownOnce(todoIds: readonly string[]): void {
  const logged = useRef(false)
  useEffect(() => {
    if (logged.current) return
    logged.current = true
    logTodoEvents(todoIds.map((todoId) => ({ todoId, event: 'shown' })))
  }, [todoIds])
}
