// Dummy to-dos for the family, shaped like an API response. Due dates are set
// around DEMO_TODAY (2026-09-25) so every group has something in it. Entries are
// deliberately out of order: the UI sorts them.

import type { PortalAction } from '../lib/portalActions'

export type TodoLink = {
  tabId: string
  label: string
}

export type Todo = {
  id: string
  title: string
  why: string
  dueDate: string
  // Missing when the to-do is done outside the portal: the parent just checks it off.
  link?: TodoLink
  // Set when the to-do is done in the portal: it checks itself off once the parent
  // does `action`, and is never checked off by hand. `link` must be set too.
  completedBy?: { action: PortalAction; hint: string }
}

export const todos: Todo[] = [
  {
    id: 'todo-budget-plan',
    title: "Plan how you'll use this year's family budget",
    why: 'A quick plan helps you make the most of the money set aside for your Star.',
    dueDate: '2026-12-01',
    link: { tabId: 'budget', label: 'Budget' },
  },
  {
    id: 'todo-confirm-address',
    title: 'Confirm your home address for the 2026–27 school year',
    why: 'We mail certificates, prizes and camp packets to this address.',
    dueDate: '2026-09-15',
    link: { tabId: 'family', label: 'Family info' },
    completedBy: {
      action: 'family.address.confirmed',
      hint: 'This checks itself off when you confirm or update your address.',
    },
  },
  {
    id: 'todo-camp-receipt',
    title: 'Ask to be paid back for summer camp',
    why: 'Send a request and NMS will pay you back from your family budget.',
    dueDate: '2026-10-09',
    link: { tabId: 'budget', label: 'Budget' },
    completedBy: {
      action: 'budget.summer-camp.requested',
      hint: 'This checks itself off when you send a summer camp request.',
    },
  },
  {
    id: 'todo-photo-release',
    title: "Return the signed photo release form to your Star's teacher",
    why: 'This lets us share photos of your Star at NMS events with your family.',
    dueDate: '2026-09-30',
  },
  {
    id: 'todo-review-classes',
    title: 'Look over the classes your Star has taken',
    why: 'Knowing what your Star has finished helps you pick the right next class.',
    dueDate: '2026-11-06',
    link: { tabId: 'your-star', label: 'Your Star' },
    completedBy: {
      action: 'your-star.viewed',
      hint: 'This checks itself off when you open the Your Star tab.',
    },
  },
  {
    id: 'todo-confirm-contact',
    title: 'Confirm your phone number and email',
    why: 'We use these to reach you about classes, events, and your Star.',
    dueDate: '2026-10-20',
    link: { tabId: 'family', label: 'Family info' },
    completedBy: {
      action: 'family.guardian.confirmed',
      hint: 'This checks itself off when you confirm or update your phone number and email.',
    },
  },
  {
    id: 'todo-school-grade',
    title: "Check your Star's school and grade",
    why: 'We use this to place your Star in the right classes and events.',
    dueDate: '2026-11-02',
    link: { tabId: 'family', label: 'Family info' },
    completedBy: {
      action: 'family.school.confirmed',
      hint: "This checks itself off when you confirm or update your Star's school.",
    },
  },
]
