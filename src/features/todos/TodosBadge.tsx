import { DEMO_TODAY } from '../../data/demoDate'
import { todos } from '../../data/todos'
import { groupTodos, needsAttention } from './groupTodos'
import { useCompletedTodos } from './useCompletedTodos'
import './TodosBadge.css'

export function TodosBadge() {
  const [completed] = useCompletedTodos()
  if (!needsAttention(groupTodos(todos, completed, DEMO_TODAY))) return null
  return (
    <span className="todos-badge" role="img" aria-label="Needs attention">
      !
    </span>
  )
}
