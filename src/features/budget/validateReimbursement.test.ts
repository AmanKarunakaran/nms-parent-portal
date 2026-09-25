import { describe, expect, it } from 'vitest'
import {
  parseAmount,
  validateReimbursement,
  type ReimbursementForm,
} from './validateReimbursement'

const TODAY = '2026-09-25'

const valid: ReimbursementForm = {
  description: 'Math workbook',
  category: 'Books & supplies',
  date: '2026-09-20',
  amount: '25.50',
}

function errorsFor(changes: Partial<ReimbursementForm>, remaining = 1100) {
  return validateReimbursement({ ...valid, ...changes }, remaining, TODAY)
}

describe('validateReimbursement', () => {
  it('accepts a complete, valid request', () => {
    expect(errorsFor({})).toEqual({})
  })

  it('flags every empty field', () => {
    expect(errorsFor({ description: '', category: '', date: '', amount: '' })).toEqual({
      description: 'Please tell us what you bought.',
      category: 'Please choose a category.',
      date: 'Please enter the date you paid.',
      amount: 'Please enter how much you paid.',
    })
  })

  it('treats a description of only spaces as empty', () => {
    expect(errorsFor({ description: '   ' })).toHaveProperty('description')
  })

  it('rejects a category that is not on the list', () => {
    expect(errorsFor({ category: 'Snacks' })).toHaveProperty('category')
  })

  it('rejects an amount that is not a number', () => {
    expect(errorsFor({ amount: 'twenty' })).toEqual({
      amount: 'Please enter an amount more than $0, like 25.50.',
    })
  })

  it('rejects zero, negative, and less-than-a-cent amounts', () => {
    expect(errorsFor({ amount: '0' })).toHaveProperty('amount')
    expect(errorsFor({ amount: '-5' })).toHaveProperty('amount')
    expect(errorsFor({ amount: '0.001' })).toHaveProperty('amount')
  })

  it('rejects more than what is left, naming the amount left', () => {
    expect(errorsFor({ amount: '1100.01' })).toEqual({
      amount: "That's more than your remaining budget ($1,100.00).",
    })
  })

  it('accepts exactly what is left', () => {
    expect(errorsFor({ amount: '1100' })).toEqual({})
  })

  it('accepts today but not a future date', () => {
    expect(errorsFor({ date: TODAY })).toEqual({})
    expect(errorsFor({ date: '2026-09-26' })).toEqual({
      date: "The date can't be in the future.",
    })
  })
})

describe('parseAmount', () => {
  it('accepts dollar signs, commas and spaces', () => {
    expect(parseAmount('$1,200.50')).toBe(1200.5)
    expect(parseAmount(' 25 ')).toBe(25)
  })

  it('returns NaN for anything else', () => {
    expect(parseAmount('')).toBeNaN()
    expect(parseAmount('.')).toBeNaN()
    expect(parseAmount('12abc')).toBeNaN()
    expect(parseAmount('1.2.3')).toBeNaN()
  })
})
