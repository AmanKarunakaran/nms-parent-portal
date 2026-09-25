import { useId, useState } from 'react'
import type { Todo } from '../../data/todos'
import type { TodoGroupId } from './groupTodos'
import { TodoItem } from './TodoItem'
import './TodoGroup.css'

type TodoGroupProps = {
  groupId: TodoGroupId
  title: string
  hint: string
  todos: readonly Todo[]
  // Set for groups that start collapsed; returns the "Show ..." button text.
  showLabel?: (count: number) => string
  selectedIds: readonly string[]
  onSelect: (id: string) => void
  onMoveBack: (id: string) => void
}

export function TodoGroup({
  groupId,
  title,
  hint,
  todos,
  showLabel,
  selectedIds,
  onSelect,
  onMoveBack,
}: TodoGroupProps) {
  const headingId = useId()
  const listId = useId()
  const [expanded, setExpanded] = useState(false)
  const listVisible = !showLabel || expanded

  return (
    <section className={`todo-group todo-group--${groupId}`} aria-labelledby={headingId}>
      <h3 id={headingId} className="todo-group__title">
        {title}
      </h3>
      <p className="todo-group__hint">{hint}</p>
      {showLabel && (
        <button
          type="button"
          className="todo-group__toggle"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? 'Hide these to-dos' : showLabel(todos.length)}
        </button>
      )}
      {listVisible && (
        <ul id={listId} className="todo-group__list">
          {todos.map((todo) => (
            <li key={todo.id}>
              <TodoItem
                todo={todo}
                groupId={groupId}
                selected={selectedIds.includes(todo.id)}
                onSelect={onSelect}
                onMoveBack={onMoveBack}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
