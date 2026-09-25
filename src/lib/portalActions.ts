import { loadJson, saveJson } from './storage'
import { usePersistentState } from './usePersistentState'

// Things a parent did in the portal. Features record them; to-dos with a matching
// `completedBy` check themselves off. Features never import to-do code.
export type PortalAction =
  | 'family.guardian.confirmed'
  | 'family.address.confirmed'
  | 'family.school.confirmed'
  | 'budget.summer-camp.requested'
  | 'your-star.viewed'

export type RecordedActions = Partial<Record<PortalAction, string>>

const KEY = 'actions.done'

// Keeps the first timestamp, so repeat visits don't rewrite the log.
export function recordAction(action: PortalAction): void {
  const done = loadJson<RecordedActions>(KEY, {})
  if (done[action]) return
  saveJson(KEY, { ...done, [action]: new Date().toISOString() })
}

export function useRecordedActions(): RecordedActions {
  return usePersistentState<RecordedActions>(KEY, {})[0]
}
