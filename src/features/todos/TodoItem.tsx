import { useId } from 'react'
import type { Todo } from '../../data/todos'
import { tabHref } from '../../lib/tabHref'
import { formatDate } from '../your-star/formatDates'
import type { TodoGroupId } from './groupTodos'
import './TodoItem.css'

type TodoItemProps = {
  todo: Todo
  groupId: TodoGroupId
  onToggle: (id: string) => void
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
  if (groupId === 'urgent') {
    return (
      <p className="todo-item__due">
        <span className="todo-item__urgent">Urgent</span> Due {date}
      </p>
    )
  }
  return <p className="todo-item__due">Due {date}</p>
}

export function TodoItem({ todo, groupId, onToggle }: TodoItemProps) {
  const checkboxId = useId()
  const done = groupId === 'done'
  return (
    <article className={`todo-item${done ? ' todo-item--done' : ''}`}>
      <input
        id={checkboxId}
        type="checkbox"
        className="todo-item__checkbox"
        checked={done}
        onChange={() => onToggle(todo.id)}
      />
      <div className="todo-item__body">
        <label htmlFor={checkboxId} className="todo-item__title">
          {todo.title}
        </label>
        <p className="todo-item__why">{todo.why}</p>
        <DueLine dueDate={todo.dueDate} groupId={groupId} />
        {todo.link && (
          <a className="todo-item__link" href={tabHref(todo.link.tabId)}>
            Go to {todo.link.label} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  )
}
