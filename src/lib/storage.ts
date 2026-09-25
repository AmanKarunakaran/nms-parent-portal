const PREFIX = 'nms:'
const NAMESPACE = `${PREFIX}v1:`

// Fired after a saved value changes, so every reader of that key can reload.
export const STORAGE_EVENT = 'nms-storage'
export type StorageEventDetail = { key: string }

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NAMESPACE + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

// Skipping unchanged values is what stops two readers of one key from saving
// back and forth forever.
export function saveJson<T>(key: string, value: T): void {
  try {
    const raw = JSON.stringify(value)
    if (localStorage.getItem(NAMESPACE + key) === raw) return
    localStorage.setItem(NAMESPACE + key, raw)
  } catch {
    // Storage full or blocked: the change just won't survive a reload.
    return
  }
  window.dispatchEvent(
    new CustomEvent<StorageEventDetail>(STORAGE_EVENT, { detail: { key } }),
  )
}

export function clearAll(): void {
  try {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(PREFIX))
    keys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Storage blocked: there is nothing saved to clear.
  }
}
