import { usePersistentState } from '../../lib/usePersistentState'

// Shared by the To-dos tab and its badge in the tab bar; the key keeps them in sync.
export function useCompletedTodos() {
  return usePersistentState<string[]>('todos.completed', [])
}
