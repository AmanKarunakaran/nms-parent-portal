import type { FamilySections, SectionKey } from './familyEdits'

// Cards render in this order. A new field = one entry in `fields` plus a rule in
// familyValidation.ts.

export type FieldConfig<Name extends string = string> = {
  name: Name
  label: string
  // Shown under the label in the form only.
  hint?: string
  input: 'text' | 'email' | 'tel' | 'select'
  autoComplete?: string
  inputMode?: 'numeric'
  maxLength?: number
  options?: { value: string; label: string }[]
}

type SectionConfigFor<K extends SectionKey> = {
  key: K
  title: string
  editLabel: string
  fields: FieldConfig<keyof FamilySections[K] & string>[]
}

export type SectionConfig = { [K in SectionKey]: SectionConfigFor<K> }[SectionKey]

const gradeOptions = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1', label: '1st grade' },
  { value: '2', label: '2nd grade' },
  { value: '3', label: '3rd grade' },
  { value: '4', label: '4th grade' },
  { value: '5', label: '5th grade' },
  { value: '6', label: '6th grade' },
  { value: '7', label: '7th grade' },
  { value: '8', label: '8th grade' },
]

export const familySections: readonly SectionConfig[] = [
  {
    key: 'guardian',
    title: 'Parent or guardian',
    editLabel: 'Edit parent or guardian',
    fields: [
      { name: 'name', label: 'Full name', input: 'text', autoComplete: 'name' },
      { name: 'email', label: 'Email', input: 'email', autoComplete: 'email' },
      { name: 'phone', label: 'Phone number', input: 'tel', autoComplete: 'tel' },
    ],
  },
  {
    key: 'address',
    title: 'Home address',
    editLabel: 'Edit home address',
    fields: [
      { name: 'street', label: 'Street address', input: 'text', autoComplete: 'street-address' },
      { name: 'city', label: 'City', input: 'text', autoComplete: 'address-level2' },
      {
        name: 'state',
        label: 'State',
        hint: '2 letters, like TX',
        input: 'text',
        autoComplete: 'address-level1',
        maxLength: 2,
      },
      {
        name: 'zip',
        label: 'ZIP code',
        input: 'text',
        autoComplete: 'postal-code',
        inputMode: 'numeric',
      },
    ],
  },
  {
    key: 'school',
    title: "Your Star's school",
    editLabel: "Edit your Star's school",
    fields: [
      { name: 'schoolName', label: 'School name', input: 'text' },
      { name: 'grade', label: 'Grade', input: 'select', options: gradeOptions },
      { name: 'teacher', label: "Teacher's name", input: 'text' },
    ],
  },
]
