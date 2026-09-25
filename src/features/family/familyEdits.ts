import type { Family } from '../../data/family'

export type FamilySections = Pick<Family, 'guardian' | 'address' | 'school'>
export type SectionKey = keyof FamilySections
export type SectionValues = Record<string, string>

// Only the fields the parent changed from the seed. A section with no changes is absent.
export type FamilyEdits = { [K in SectionKey]?: Partial<FamilySections[K]> }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Edits come from storage, so anything that isn't a string for a known field is ignored.
function mergeSection<T extends SectionValues>(seed: T, edit: unknown): T {
  if (!isRecord(edit)) return seed
  const merged: SectionValues = { ...seed }
  for (const field of Object.keys(seed)) {
    const value = edit[field]
    if (typeof value === 'string') merged[field] = value
  }
  return merged as T
}

export function mergeFamily(seed: FamilySections, edits: unknown): FamilySections {
  const safeEdits = isRecord(edits) ? edits : {}
  return {
    guardian: mergeSection(seed.guardian, safeEdits.guardian),
    address: mergeSection(seed.address, safeEdits.address),
    school: mergeSection(seed.school, safeEdits.school),
  }
}

export function diffSection<T extends SectionValues>(seed: T, values: SectionValues): Partial<T> {
  const changed: SectionValues = {}
  for (const field of Object.keys(seed)) {
    const value = values[field]
    if (typeof value === 'string' && value !== seed[field]) changed[field] = value
  }
  return changed as Partial<T>
}

// Replaces one section's saved changes with the diff of `values` against the seed.
export function applySectionEdit(
  seed: FamilySections,
  edits: FamilyEdits,
  key: SectionKey,
  values: SectionValues,
): FamilyEdits {
  const { [key]: _previous, ...others } = isRecord(edits) ? edits : ({} as FamilyEdits)
  const changed = diffSection(seed[key], values)
  return Object.keys(changed).length === 0 ? others : { ...others, [key]: changed }
}
