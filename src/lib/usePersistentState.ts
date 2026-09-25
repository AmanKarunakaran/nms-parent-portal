import { useEffect, useRef, useState } from 'react'
import { loadJson, saveJson, STORAGE_EVENT, type StorageEventDetail } from './storage'

// Keys follow `<feature>.<thing>`, e.g. `todos.completed`. Every component using
// the same key stays in sync, e.g. a tab and its badge in the tab bar.
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => loadJson(key, initial))
  // Callers pass a fresh literal every render; the first one is enough as a fallback.
  const fallback = useRef(initial)

  useEffect(() => {
    saveJson(key, value)
  }, [key, value])

  useEffect(() => {
    function onStorage(event: Event) {
      if ((event as CustomEvent<StorageEventDetail>).detail.key !== key) return
      const next = loadJson(key, fallback.current)
      setValue((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next))
    }
    window.addEventListener(STORAGE_EVENT, onStorage)
    return () => window.removeEventListener(STORAGE_EVENT, onStorage)
  }, [key])

  return [value, setValue] as const
}
