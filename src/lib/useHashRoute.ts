import { useEffect, useState } from 'react'

export function useHashRoute(validIds: readonly string[]): string {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const id = hash.replace(/^#\/?/, '')
  return validIds.includes(id) ? id : validIds[0]
}
