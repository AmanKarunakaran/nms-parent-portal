// Dummy FAQ, shaped like an API response.

export type FaqItem = {
  id: string
  question: string
  answer: string
  // Optional pointer to the tab where the parent can act on the answer.
  link?: { tabId: string; label: string }
}

export const faq: readonly FaqItem[] = [
  {
    id: 'what-is-a-star',
    question: 'What is a Star?',
    answer:
      "A Star is a student in the National Math Stars program. If your child is in NMS, they're a Star, and we think they shine pretty brightly.",
    link: { tabId: 'your-star', label: "See your Star's progress" },
  },
  {
    id: 'get-paid-back',
    question: 'How do I get paid back for something I bought?',
    answer:
      'Open the Budget tab and fill in the form with what you bought, when you paid, and how much. Your request shows up right away, and your budget bar updates too.',
    link: { tabId: 'budget', label: 'Go to Budget' },
  },
  {
    id: 'todos-red-mark',
    question: 'Why does the To-dos tab have a red !?',
    answer:
      "It means at least one to-do is past its due date. Don't worry, nobody's in trouble. Finish it and the ! goes away.",
    link: { tabId: 'todos', label: 'Go to To-dos' },
  },
  {
    id: 'sign-up-event',
    question: 'How do I sign up for an event?',
    answer:
      "Open the Events tab, find an event you like, and follow its sign-up link. Events you're going to show up in your \"You're going\" list so you won't forget.",
    link: { tabId: 'events', label: 'Go to Events' },
  },
  {
    id: 'change-address',
    question: 'Can I change my address?',
    answer:
      'Yes! Open Family info, edit the section you want to change, and save. That works for your school and contact details too.',
    link: { tabId: 'family', label: 'Go to Family info' },
  },
  {
    id: 'contact-help',
    question: 'Who do I contact for help?',
    answer:
      'Email us at help@example.org. A real person reads every message, and no question is too small.',
  },
  {
    id: 'missed-due-date',
    question: 'What happens if I miss a due date?',
    answer:
      "It's still worth finishing! Late beats never every time, and the to-do stays on your list until it's done.",
    link: { tabId: 'todos', label: 'Go to To-dos' },
  },
  {
    id: 'reset-demo-data',
    question: 'What does Reset demo data do?',
    answer:
      'This portal is a demo. Reset demo data clears the changes you made on this device (edits, sign-ups, finished to-dos) and puts everything back the way it started. A fresh start, no hard feelings.',
  },
]
