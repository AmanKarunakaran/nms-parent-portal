// Dummy family record, shaped like an API response. Read-only: the parent's edits
// are saved separately (see src/features/family/familyEdits.ts).

export const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8'] as const
export type Grade = (typeof GRADES)[number]

export type Guardian = {
  name: string
  email: string
  phone: string
}

export type Address = {
  street: string
  city: string
  state: string
  zip: string
}

export type School = {
  schoolName: string
  grade: Grade
  teacher: string
}

export type Family = {
  id: string
  guardian: Guardian
  address: Address
  school: School
}

export const family: Family = {
  id: 'family-mcstarface',
  guardian: {
    name: 'Jordan McStarface',
    email: 'jordan.mcstarface@example.com',
    phone: '(512) 555-0147',
  },
  address: {
    street: '1427 Bluebonnet Lane',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
  },
  school: {
    schoolName: 'Oak Hollow Elementary',
    grade: '4',
    teacher: 'Ms. Alvarez',
  },
}
