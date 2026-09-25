import { describe, expect, it } from 'vitest'
import { normalizeSection, validateSection } from './familyValidation'

const guardian = { name: 'Pat Doe', email: 'pat@example.com', phone: '(512) 555-0147' }
const address = { street: '1 Main St', city: 'Austin', state: 'TX', zip: '78701' }
const school = { schoolName: 'Oak Elementary', grade: '3', teacher: 'Ms. Lee' }

describe('validateSection', () => {
  it('accepts valid sections', () => {
    expect(validateSection('guardian', guardian)).toEqual({})
    expect(validateSection('address', address)).toEqual({})
    expect(validateSection('school', school)).toEqual({})
    expect(validateSection('school', { ...school, grade: 'K' })).toEqual({})
  })

  it('requires every field', () => {
    const blank = (values: Record<string, string>) =>
      Object.fromEntries(Object.keys(values).map((key) => [key, '']))
    expect(Object.keys(validateSection('guardian', blank(guardian)))).toEqual(['name', 'email', 'phone'])
    expect(Object.keys(validateSection('address', blank(address)))).toEqual([
      'street',
      'city',
      'state',
      'zip',
    ])
    expect(Object.keys(validateSection('school', blank(school)))).toEqual([
      'schoolName',
      'grade',
      'teacher',
    ])
  })

  it('treats a missing field as blank', () => {
    expect(validateSection('address', { street: '1 Main St', city: 'Austin', state: 'TX' })).toEqual({
      zip: 'Please enter a 5-digit ZIP code.',
    })
  })

  it('checks the email has a basic valid shape', () => {
    for (const email of ['pat', 'pat@', 'pat@example', '@example.com', 'pat @example.com']) {
      expect(validateSection('guardian', { ...guardian, email })).toEqual({
        email: 'Please enter an email like name@example.com.',
      })
    }
  })

  it('accepts a 10-digit phone number in any format', () => {
    for (const phone of ['5125550147', '512-555-0147', '(512) 555 0147', '512.555.0147']) {
      expect(validateSection('guardian', { ...guardian, phone })).toEqual({})
    }
  })

  it('rejects a phone number without exactly 10 digits', () => {
    for (const phone of ['555-0147', '1 (512) 555-0147', 'call me']) {
      expect(validateSection('guardian', { ...guardian, phone })).toEqual({
        phone: 'Please enter a 10-digit phone number.',
      })
    }
  })

  it('requires a 5-digit ZIP code', () => {
    for (const zip of ['7870', '787011', '7870a', '78701-1234']) {
      expect(validateSection('address', { ...address, zip })).toEqual({
        zip: 'Please enter a 5-digit ZIP code.',
      })
    }
  })

  it('requires a 2-letter state', () => {
    for (const state of ['T', 'Tex', 'T1']) {
      expect(validateSection('address', { ...address, state })).toEqual({
        state: 'Please enter your state as 2 letters, like TX.',
      })
    }
  })

  it('rejects a grade outside K to 8', () => {
    expect(validateSection('school', { ...school, grade: '9' })).toEqual({
      grade: "Please choose your Star's grade.",
    })
  })
})

describe('normalizeSection', () => {
  it('trims every field', () => {
    expect(normalizeSection('guardian', { name: '  Pat Doe ', email: ' pat@example.com' })).toEqual({
      name: 'Pat Doe',
      email: 'pat@example.com',
    })
  })

  it('upper-cases the state', () => {
    expect(normalizeSection('address', { ...address, state: ' tx ' }).state).toBe('TX')
  })

  it('makes a whitespace-only field count as blank', () => {
    const values = normalizeSection('address', { ...address, city: '   ' })
    expect(validateSection('address', values)).toEqual({ city: 'Please enter your city.' })
  })
})
