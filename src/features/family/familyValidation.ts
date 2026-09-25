import { GRADES } from '../../data/family'
import type { SectionKey, SectionValues } from './familyEdits'

type Rule = (value: string) => string | undefined

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function required(message: string): Rule {
  return (value) => (value === '' ? message : undefined)
}

const rules: Record<SectionKey, Record<string, Rule[]>> = {
  guardian: {
    name: [required("Please enter the parent or guardian's name.")],
    email: [
      required('Please enter an email address.'),
      (value) =>
        EMAIL_SHAPE.test(value) ? undefined : 'Please enter an email like name@example.com.',
    ],
    phone: [
      (value) =>
        value.replace(/\D/g, '').length === 10
          ? undefined
          : 'Please enter a 10-digit phone number.',
    ],
  },
  address: {
    street: [required('Please enter your street address.')],
    city: [required('Please enter your city.')],
    state: [
      required('Please enter your state.'),
      (value) =>
        /^[A-Za-z]{2}$/.test(value) ? undefined : 'Please enter your state as 2 letters, like TX.',
    ],
    zip: [(value) => (/^\d{5}$/.test(value) ? undefined : 'Please enter a 5-digit ZIP code.')],
  },
  school: {
    schoolName: [required("Please enter your Star's school.")],
    grade: [
      (value) =>
        (GRADES as readonly string[]).includes(value) ? undefined : "Please choose your Star's grade.",
    ],
    teacher: [required("Please enter your Star's teacher's name.")],
  },
}

// Trims every field and upper-cases the state, so " tx " saves as "TX".
export function normalizeSection(key: SectionKey, values: SectionValues): SectionValues {
  const normalized: SectionValues = {}
  for (const [field, value] of Object.entries(values)) {
    const trimmed = value.trim()
    normalized[field] = key === 'address' && field === 'state' ? trimmed.toUpperCase() : trimmed
  }
  return normalized
}

// Returns one message per invalid field; an empty object means the section is valid.
// Expects values already passed through normalizeSection.
export function validateSection(key: SectionKey, values: SectionValues): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const [field, fieldRules] of Object.entries(rules[key])) {
    const value = values[field] ?? ''
    for (const rule of fieldRules) {
      const message = rule(value)
      if (message) {
        errors[field] = message
        break
      }
    }
  }
  return errors
}
