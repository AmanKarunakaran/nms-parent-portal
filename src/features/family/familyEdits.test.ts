import { describe, expect, it } from 'vitest'
import type { FamilyEdits, FamilySections } from './familyEdits'
import { applySectionEdit, diffSection, mergeFamily } from './familyEdits'

const seed: FamilySections = {
  guardian: { name: 'Pat Doe', email: 'pat@example.com', phone: '555-111-2222' },
  address: { street: '1 Main St', city: 'Austin', state: 'TX', zip: '78701' },
  school: { schoolName: 'Oak Elementary', grade: '3', teacher: 'Ms. Lee' },
}

describe('mergeFamily', () => {
  it('returns the seed when nothing has been saved', () => {
    expect(mergeFamily(seed, {})).toEqual(seed)
  })

  it('lays saved fields over the seed and keeps the rest', () => {
    const merged = mergeFamily(seed, { address: { city: 'Dallas' }, school: { grade: '4' } })
    expect(merged.address).toEqual({ ...seed.address, city: 'Dallas' })
    expect(merged.school).toEqual({ ...seed.school, grade: '4' })
    expect(merged.guardian).toEqual(seed.guardian)
  })

  it('ignores corrupt or unknown saved data', () => {
    expect(mergeFamily(seed, 'not an object')).toEqual(seed)
    expect(mergeFamily(seed, null)).toEqual(seed)
    expect(mergeFamily(seed, { address: { city: 42, planet: 'Mars' } })).toEqual(seed)
  })
})

describe('diffSection', () => {
  it('keeps only the fields that differ from the seed', () => {
    expect(diffSection(seed.address, { ...seed.address, city: 'Dallas', zip: '75201' })).toEqual({
      city: 'Dallas',
      zip: '75201',
    })
  })

  it('is empty when nothing changed', () => {
    expect(diffSection(seed.guardian, { ...seed.guardian })).toEqual({})
  })
})

describe('applySectionEdit', () => {
  it('saves only the changed fields of the edited section', () => {
    const edits = applySectionEdit(seed, {}, 'address', { ...seed.address, city: 'Dallas' })
    expect(edits).toEqual({ address: { city: 'Dallas' } })
  })

  it('leaves other sections alone', () => {
    const before: FamilyEdits = { school: { teacher: 'Mr. Kim' } }
    const edits = applySectionEdit(seed, before, 'address', { ...seed.address, city: 'Dallas' })
    expect(edits).toEqual({ school: { teacher: 'Mr. Kim' }, address: { city: 'Dallas' } })
  })

  it('removes a field whose value was changed back to the seed', () => {
    const before: FamilyEdits = { address: { city: 'Dallas', zip: '75201' } }
    const edits = applySectionEdit(seed, before, 'address', { ...seed.address, zip: '75201' })
    expect(edits).toEqual({ address: { zip: '75201' } })
  })

  it('removes the section once nothing in it differs from the seed', () => {
    const before: FamilyEdits = { address: { city: 'Dallas' }, school: { grade: '4' } }
    const edits = applySectionEdit(seed, before, 'address', { ...seed.address })
    expect(edits).toEqual({ school: { grade: '4' } })
  })
})
