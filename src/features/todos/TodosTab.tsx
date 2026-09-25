import { useEffect, useState } from 'react'
import { DEMO_TODAY } from '../../data/demoDate'
import { todos } from '../../data/todos'
import { COMING_UP_DAYS, groupTodos, SOON_DAYS, type TodoGroupId } from './groupTodos'
import { TodoGroup } from './TodoGroup'
import { useLogShownOnce } from './todoLog'
import { useCompletedTodos } from './useCompletedTodos'
import './TodosTab.css'

const plural = (count: number) => (count === 1 ? 'to-do' : 'to-dos')
const STATUS_MS = 6000

// Groups are hidden when empty. A group with `showLabel` starts collapsed behind a
// "Show ..." button. `side` groups sit in the right-hand column on wide screens;
// on phones everything stacks in this order.
const GROUPS: {
  id: TodoGroupId
  title: string
  hint: string
  side?: boolean
  showLabel?: (count: number) => string
}[] = [
  { id: 'soon', title: 'Soon', hint: `Due in the next ${SOON_DAYS} days.` },
  { id: 'overdue', title: 'Overdue', hint: 'These are past their due date.', side: true },
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
    hint: 'Nice work! Move a to-do back if you need to do it again.',
    showLabel: (count) => `Show ${count} done ${plural(count)}`,
  },
]

export function TodosTab() {
  const { completed, markDone, moveBack, isAutomatic } = useCompletedTodos()
  const [selected, setSelected] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const groups = groupTodos(todos, completed, DEMO_TODAY)
  const allDone = groups.done.length === todos.length
  // Something completed elsewhere is no longer selectable.
  const manualIds = todos.filter((todo) => !isAutomatic(todo)).map((todo) => todo.id)
  const selectedOpen = selected.filter((id) => manualIds.includes(id) && !completed.includes(id))

  useLogShownOnce(
    GROUPS.filter((group) => !group.showLabel).flatMap((group) => groups[group.id].map((todo) => todo.id)),
  )

  useEffect(() => {
    if (!statusMessage) return
    const timer = setTimeout(() => setStatusMessage(''), STATUS_MS)
    return () => clearTimeout(timer)
  }, [statusMessage])

  function handleSelect(id: string) {
    setSelected((ids) => (ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id]))
  }

  function handleConfirm() {
    markDone(selectedOpen)
    setSelected([])
    setStatusMessage(`Nice work! ${selectedOpen.length} ${plural(selectedOpen.length)} marked as done.`)
  }

  function handleMoveBack(id: string) {
    moveBack(id)
    setStatusMessage('')
  }

  const renderGroups = (side: boolean) =>
    GROUPS.filter((group) => Boolean(group.side) === side && groups[group.id].length > 0).map((group) => (
      <TodoGroup
        key={group.id}
        groupId={group.id}
        title={group.title}
        hint={group.hint}
        todos={groups[group.id]}
        showLabel={group.showLabel}
        selectedIds={selectedOpen}
        onSelect={handleSelect}
        onMoveBack={handleMoveBack}
      />
    ))
  const sideGroups = renderGroups(true)

  return (
    <section className="todos">
      <h2 className="todos__title">To-dos</h2>
      <p className="todos__hint">
        Some to-dos check themselves off when you finish them in the portal. For the rest, tick
        them when they're done and press the button.
      </p>

      {/* The open groups are all empty by now, so this takes their place. */}
      {allDone && (
        <p className="todos__all-done">
          You're all caught up! Every to-do is done. Thank you for helping your Star shine.
        </p>
      )}

      <div className={`todos__groups${sideGroups.length > 0 ? ' todos__groups--with-side' : ''}`}>
        <div className="todos__main">{renderGroups(false)}</div>
        {sideGroups.length > 0 && <div className="todos__side">{sideGroups}</div>}
      </div>

      {/* Sticks to the bottom of the screen so it's always in reach while scrolling. */}
      <div className="todos__actions">
        <p className="todos__status" role="status">
          {statusMessage}
        </p>
        {selectedOpen.length > 0 && (
          <button type="button" className="todos__confirm" onClick={handleConfirm}>
            Mark {selectedOpen.length} {plural(selectedOpen.length)} as done
          </button>
        )}
      </div>
    </section>
  )
}
