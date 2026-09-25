import { useEffect, useState } from 'react'
import { loadJson, saveJson } from './storage'

// Keys follow `<feature>.<thing>`, e.g. `todos.completed`.
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => loadJson(key, initial))

  useEffect(() => {
    saveJson(key, value)
  }, [key, value])

  return [value, setValue] as const
}
