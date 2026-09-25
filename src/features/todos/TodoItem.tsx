import { useId } from 'react'
import type { Todo } from '../../data/todos'
import { tabHref } from '../../lib/tabHref'
import { formatDate } from '../your-star/formatDates'
import type { TodoGroupId } from './groupTodos'
import './TodoItem.css'

type TodoItemProps = {
  todo: Todo
  groupId: TodoGroupId
  selected: boolean
  onSelect: (id: string) => void
  onMoveBack: (id: string) => void
}

function DueLine({ dueDate, groupId }: { dueDate: string; groupId: TodoGroupId }) {
  const date = formatDate(dueDate)
  if (groupId === 'overdue') {
    return (
      <p className="todo-item__due todo-item__due--overdue">
        Was due {date}. It's still worth finishing!
      </p>
    )
  }
  if (groupId === 'soon') {
    return (
      <p className="todo-item__due">
        <span className="todo-item__soon">Do this soon</span> Due {date}
      </p>
    )
  }
  return <p className="todo-item__due">Due {date}</p>
}

// Open manual to-dos have a checkbox that only selects them; the tab's confirm
// button marks the selection as done. Done manual to-dos get a button to move them
// back. Automatic to-dos (`completedBy`) have neither: they check themselves off.
export function TodoItem({ todo, groupId, selected, onSelect, onMoveBack }: TodoItemProps) {
  const titleId = useId()
  const done = groupId === 'done'
  const automatic = todo.completedBy !== undefined
  return (
    <article className={`todo-item todo-item--${groupId}`}>
      {!done && !automatic && (
        <input
          type="checkbox"
          className="todo-item__checkbox"
          aria-labelledby={titleId}
          checked={selected}
          onChange={() => onSelect(todo.id)}
        />
      )}
      <div className="todo-item__body">
        <h4 id={titleId} className="todo-item__title">
          {todo.title}
        </h4>
        <p className="todo-item__why">{todo.why}</p>
        <DueLine dueDate={todo.dueDate} groupId={groupId} />
        {todo.completedBy && !done && <p className="todo-item__auto-hint">{todo.completedBy.hint}</p>}
        {todo.link && !done && (
          <a className="todo-item__link" href={tabHref(todo.link.tabId)}>
            Go to {todo.link.label} <span aria-hidden="true">→</span>
          </a>
        )}
        {done && automatic && <p className="todo-item__auto-done">✓ Done</p>}
        {done && !automatic && (
          <button type="button" className="todo-item__move-back" onClick={() => onMoveBack(todo.id)}>
            Move back to my to-dos
          </button>
        )}
      </div>
    </article>
  )
}
