import { describe, expect, it } from 'vitest'
import type { Todo } from '../../data/todos'
import { todos as seedTodos } from '../../data/todos'
import { daysUntil, groupTodos, needsAttention } from './groupTodos'

const TODAY = '2026-09-25'

const todo = (id: string, dueDate: string): Todo => ({ id, title: id, why: '', dueDate })

const idsByGroup = (groups: ReturnType<typeof groupTodos>) =>
  Object.fromEntries(Object.entries(groups).map(([group, items]) => [group, items.map((t) => t.id)]))

describe('daysUntil', () => {
  it('counts whole days, across month ends and the fall time change', () => {
    expect(daysUntil('2026-09-25', TODAY)).toBe(0)
    expect(daysUntil('2026-09-24', TODAY)).toBe(-1)
    expect(daysUntil('2026-10-01', TODAY)).toBe(6)
    expect(daysUntil('2026-11-10', TODAY)).toBe(46)
  })
})

describe('groupTodos', () => {
  it('puts each to-do in the right group at the 0, 7, 8, 30 and 31 day boundaries', () => {
    const groups = groupTodos(
      [
        todo('minus-1', '2026-09-24'),
        todo('day-0', '2026-09-25'),
        todo('day-7', '2026-10-02'),
        todo('day-8', '2026-10-03'),
        todo('day-30', '2026-10-25'),
        todo('day-31', '2026-10-26'),
      ],
      [],
      TODAY,
    )
    expect(idsByGroup(groups)).toEqual({
      overdue: ['minus-1'],
      urgent: ['day-0', 'day-7'],
      comingUp: ['day-8', 'day-30'],
      later: ['day-31'],
      done: [],
    })
  })

  it('sorts each group by due date, soonest first', () => {
    const groups = groupTodos(
      [todo('c', '2026-12-20'), todo('a', '2026-11-01'), todo('b', '2026-11-15')],
      [],
      TODAY,
    )
    expect(groups.later.map((t) => t.id)).toEqual(['a', 'b', 'c'])
  })

  it('moves completed to-dos to Done whatever their due date', () => {
    const groups = groupTodos(
      [todo('late', '2026-09-01'), todo('soon', '2026-09-28'), todo('far', '2027-01-01')],
      ['far', 'late'],
      TODAY,
    )
    expect(idsByGroup(groups)).toEqual({
      overdue: [],
      urgent: ['soon'],
      comingUp: [],
      later: [],
      done: ['late', 'far'],
    })
  })

  it('ignores completed IDs that match no to-do', () => {
    const groups = groupTodos([todo('a', '2026-09-28')], ['gone'], TODAY)
    expect(groups.urgent).toHaveLength(1)
    expect(groups.done).toHaveLength(0)
  })

  it('spreads the seed data as planned: 1 overdue, 1 urgent, 2 coming up, 3 later', () => {
    const groups = groupTodos(seedTodos, [], TODAY)
    expect(groups.overdue).toHaveLength(1)
    expect(groups.urgent).toHaveLength(1)
    expect(groups.comingUp).toHaveLength(2)
    expect(groups.later).toHaveLength(3)
  })
})

describe('needsAttention', () => {
  it('is true only while an overdue or urgent to-do is open', () => {
    const list = [todo('late', '2026-09-01'), todo('soon', '2026-09-28'), todo('far', '2027-01-01')]
    expect(needsAttention(groupTodos(list, [], TODAY))).toBe(true)
    expect(needsAttention(groupTodos(list, ['late'], TODAY))).toBe(true)
    expect(needsAttention(groupTodos(list, ['late', 'soon'], TODAY))).toBe(false)
  })
})
