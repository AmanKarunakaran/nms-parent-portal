import { describe, expect, it } from 'vitest'
import { clearAll, loadJson, saveJson } from './storage'

describe('storage', () => {
  it('saves under the nms:v1: prefix and loads it back', () => {
    saveJson('todos.completed', ['a', 'b'])
    expect(localStorage.getItem('nms:v1:todos.completed')).toBe('["a","b"]')
    expect(loadJson('todos.completed', [])).toEqual(['a', 'b'])
  })

  it('returns the fallback when the key is missing', () => {
    expect(loadJson('missing', { ok: true })).toEqual({ ok: true })
  })

  it('returns the fallback when the saved JSON is unreadable', () => {
    localStorage.setItem('nms:v1:broken', '{not json')
    expect(loadJson('broken', 42)).toBe(42)
  })

  it('clearAll removes nms: keys and leaves other keys alone', () => {
    saveJson('todos.completed', ['a'])
    localStorage.setItem('nms:v0:old', '1')
    localStorage.setItem('someone-else', 'keep me')

    clearAll()

    expect(localStorage.getItem('nms:v1:todos.completed')).toBeNull()
    expect(localStorage.getItem('nms:v0:old')).toBeNull()
    expect(localStorage.getItem('someone-else')).toBe('keep me')
  })
})
