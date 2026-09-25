import { usePersistentState } from '../../lib/usePersistentState'
import { logTodoEvents } from './todoLog'

// The one place to-dos get completed or reopened, so every change is logged. It's
// shared by the To-dos tab and its badge; the storage key keeps them in sync. A
// linked tab can call `markDone` too, e.g. once a parent confirms their address.
export function useCompletedTodos() {
  const [completed, setCompleted] = usePersistentState<string[]>('todos.completed', [])

  function markDone(ids: readonly string[]) {
    const newIds = ids.filter((id) => !completed.includes(id))
    if (newIds.length === 0) return
    setCompleted((current) => [...current, ...newIds.filter((id) => !current.includes(id))])
    logTodoEvents(newIds.map((todoId) => ({ todoId, event: 'completed' })))
  }

  function moveBack(id: string) {
    if (!completed.includes(id)) return
    setCompleted((current) => current.filter((doneId) => doneId !== id))
    logTodoEvents([{ todoId: id, event: 'uncompleted' }])
  }

  return { completed, markDone, moveBack }
}
