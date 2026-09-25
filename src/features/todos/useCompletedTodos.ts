import { todos, type Todo } from '../../data/todos'
import { useRecordedActions } from '../../lib/portalActions'
import { usePersistentState } from '../../lib/usePersistentState'
import { logTodoEvents } from './todoLog'

export const isAutomatic = (todo: Todo) => todo.completedBy !== undefined
const automaticIds = new Set(todos.filter(isAutomatic).map((todo) => todo.id))

// The one place to-dos get completed or reopened by hand, so every change is
// logged. Shared by the To-dos tab and its badge; the storage keys keep them in
// sync. Automatic to-dos complete only through their recorded portal action.
export function useCompletedTodos() {
  const [manual, setManual] = usePersistentState<string[]>('todos.completed', [])
  const actions = useRecordedActions()
  const completed = [
    ...manual.filter((id) => !automaticIds.has(id)),
    ...todos.filter((todo) => todo.completedBy && actions[todo.completedBy.action]).map((todo) => todo.id),
  ]

  function markDone(ids: readonly string[]) {
    const newIds = ids.filter((id) => !automaticIds.has(id) && !completed.includes(id))
    if (newIds.length === 0) return
    setManual((current) => [...current, ...newIds.filter((id) => !current.includes(id))])
    logTodoEvents(newIds.map((todoId) => ({ todoId, event: 'completed' })))
  }

  function moveBack(id: string) {
    if (automaticIds.has(id) || !manual.includes(id)) return
    setManual((current) => current.filter((doneId) => doneId !== id))
    logTodoEvents([{ todoId: id, event: 'uncompleted' }])
  }

  return { completed, markDone, moveBack, isAutomatic }
}
