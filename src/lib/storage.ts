const PREFIX = 'nms:'
const NAMESPACE = `${PREFIX}v1:`

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NAMESPACE + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function saveJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(NAMESPACE + key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: the change just won't survive a reload.
  }
}

export function clearAll(): void {
  try {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(PREFIX))
    keys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Storage blocked: there is nothing saved to clear.
  }
}
