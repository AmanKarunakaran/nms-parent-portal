import { DEMO_TODAY } from '../../data/demoDate'
import { todos } from '../../data/todos'
import { COMING_UP_DAYS, groupTodos, URGENT_DAYS, type TodoGroupId } from './groupTodos'
import { TodoGroup } from './TodoGroup'
import { logTodoEvents, useLogShownOnce } from './todoLog'
import { useCompletedTodos } from './useCompletedTodos'
import './TodosTab.css'

const plural = (count: number) => (count === 1 ? 'to-do' : 'to-dos')

// Groups render in this order and are hidden when empty. A group with
// `showLabel` starts collapsed behind a "Show ..." button.
const GROUPS: {
  id: TodoGroupId
  title: string
  hint: string
  showLabel?: (count: number) => string
}[] = [
  { id: 'overdue', title: 'Overdue', hint: 'These are past their due date.' },
  { id: 'urgent', title: 'Urgent', hint: `Due in the next ${URGENT_DAYS} days.` },
  { id: 'comingUp', title: 'Coming up', hint: `Due in the next ${COMING_UP_DAYS} days.` },
  {
    id: 'later',
    title: 'Later',
    hint: `Due more than ${COMING_UP_DAYS} days from now. No rush on these.`,
    showLabel: (count) => `Show ${count} more ${plural(count)}`,
  },
  {
    id: 'done',
    title: 'Done',
    hint: 'Nice work! Uncheck a to-do if you need to do it again.',
    showLabel: (count) => `Show ${count} done ${plural(count)}`,
  },
]

export function TodosTab() {
  const [completed, setCompleted] = useCompletedTodos()
  const groups = groupTodos(todos, completed, DEMO_TODAY)
  const allDone = groups.done.length === todos.length

  useLogShownOnce(
    GROUPS.filter((group) => !group.showLabel).flatMap((group) => groups[group.id].map((todo) => todo.id)),
  )

  function handleToggle(id: string) {
    const wasDone = completed.includes(id)
    setCompleted(wasDone ? completed.filter((doneId) => doneId !== id) : [...completed, id])
    logTodoEvents([{ todoId: id, event: wasDone ? 'uncompleted' : 'completed' }])
  }

  return (
    <section className="todos">
      <h2 className="todos__title">To-dos</h2>
      <p className="todos__summary">
        {groups.done.length} of {todos.length} done
      </p>
      <p className="todos__hint">
        Check off each to-do when it's finished. Links take you to the part of the portal
        where you can do it.
      </p>

      {/* The open groups are all empty by now, so this takes their place. */}
      {allDone && (
        <p className="todos__all-done" role="status">
          You're all caught up! Every to-do is done. Thank you for helping your Star shine.
        </p>
      )}

      <div className="todos__groups">
        {GROUPS.filter((group) => groups[group.id].length > 0).map((group) => (
          <TodoGroup
            key={group.id}
            groupId={group.id}
            title={group.title}
            hint={group.hint}
            todos={groups[group.id]}
            showLabel={group.showLabel}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  )
}
