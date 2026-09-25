import type { Todo } from '../../data/todos'

export type TodoGroupId = 'overdue' | 'soon' | 'comingUp' | 'later' | 'done'
export type GroupedTodos = Record<TodoGroupId, Todo[]>

export const SOON_DAYS = 7
export const COMING_UP_DAYS = 30

const MS_PER_DAY = 24 * 60 * 60 * 1000

// Reads the parts straight from the string and compares in UTC, so a user's time
// zone can't shift a due date by a day.
function isoToUtcMs(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

export function daysUntil(dueIso: string, todayIso: string): number {
  return Math.round((isoToUtcMs(dueIso) - isoToUtcMs(todayIso)) / MS_PER_DAY)
}

function openGroupFor(days: number): TodoGroupId {
  if (days < 0) return 'overdue'
  if (days <= SOON_DAYS) return 'soon'
  if (days <= COMING_UP_DAYS) return 'comingUp'
  return 'later'
}

// Each group is sorted by due date, soonest first. ISO dates sort as strings.
export function groupTodos(
  todos: readonly Todo[],
  completedIds: readonly string[],
  todayIso: string,
): GroupedTodos {
  const groups: GroupedTodos = { overdue: [], soon: [], comingUp: [], later: [], done: [] }
  const completed = new Set(completedIds)
  const byDueDate = [...todos].sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  for (const todo of byDueDate) {
    const group = completed.has(todo.id) ? 'done' : openGroupFor(daysUntil(todo.dueDate, todayIso))
    groups[group].push(todo)
  }
  return groups
}

export function needsAttention(groups: GroupedTodos): boolean {
  return groups.overdue.length > 0 || groups.soon.length > 0
}
