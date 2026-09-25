# NMS Parent Portal

A parent portal for National Math Stars (NMS), built as a 2-hour work-sample project.
Parents of "Stars" (NMS students) use it to keep their family info up to date, finish
required to-dos, follow their Star's progress, track their family budget, and RSVP to
events. The brief is `Founding Head of Technology -- take-home task.docx` (gitignored:
it's private and the repo will be public).

## Constraints

- **Timebox: 2 hours total.** A working feature beats a polished one. If something
  starts eating time, cut scope and note it for the write-up instead of pushing on.
- **Static site, no backend.** All data is dummy data bundled with the front end
  (real data lives in Zoho for CRM and Ramp/QuickBooks for finance; we don't touch
  them). Persist user changes in `localStorage` so they survive a page reload.
- **Deliverables:** deployed on Vercel, code on GitHub, plus a one-page write-up
  covering (A) key questions and answers, (B) the biggest architecture/design
  choice and why, (C) what's next. Keep track of cut scope and decisions as you go
  so the write-up is easy to assemble.

## Users

Parents of elementary-school Stars (some middle school; eventually through high
school). They come from a wide range of socioeconomic backgrounds and levels of tech
fluency. **Don't assume tech fluency:** plain language, no jargon, obvious buttons,
nothing that only works if you already know where to look.

## Feature priorities

**Need to have**
- **To-do checklist.** Each item should say what it's for and when it's due, and link
  to the part of the portal where it gets done. Log when to-dos are shown and
  completed (useful for A/B testing nudges later). Must not be overwhelming, and must
  scale to many items. This is also how the portal nudges parents who are behind.
- **Star's progress and history.** Math courses, competition results, summer camps.
- **Update basic info.** School, address, contact info; persisted in `localStorage`.
- **Budget tracker.** What the family budget went to and how much is left. Stretch:
  submit a reimbursement request that updates the progress bar.

**Want to have**
- Login (basic: hardcoded demo users/passwords).
- Upcoming events (virtual and in-person), RSVP, and reminders for RSVP'd events.
- FAQ (basic dummy Q&A is fine; don't spend time on the exact questions).
- Badgebook (dummy badges/pins).

**Nice to have / deferred:** real backend and auth, AI assistant, discussion forums,
opportunity finder, Sign in with Google, self-service resource hub, mobile-specific
features.

## Conventions

### UX priorities
1. **Organized.** A parent can tell where things live at a glance.
2. **Discoverable.** Every feature is reachable from obvious navigation. Nothing is
   hidden behind gestures, hover-only controls, or icons with no label.
3. **Self-explanatory.** The UI explains itself with no manual: clear labels, short
   helper text, and empty/success/error states that say what happened and what to do
   next.
4. **Welcoming and effective.** Warm, encouraging tone that gets parents to finish
   tasks. Surface the next action; don't bury it.
5. **Performant.** Fast first load on modest devices and slow connections.

### Engineering priorities (in order)
1. **Fully functional.** Every use case a parent can reach has to work end to end. A
   dead button or a flow that dead-ends can block a Star from something they'd love,
   and that's the worst failure here. Don't ship UI that looks interactive but isn't.
   If something is out of scope, leave it out or label it clearly as coming soon.
2. **Extensible.** A new feature, section, to-do type, or data field should mostly be
   a new data/config entry plus a small component that plugs into shared
   infrastructure (data layer, storage, navigation). Avoid one-off wiring.
3. **Legible to both AI and humans.** AI writes most of the code and a human reviews
   it. Prefer clear, conventional structure and naming, small focused files, and
   predictable patterns over clever ones.
4. **Performant.** No heavy dependencies without a clear payoff.

### Data & storage
- Keep dummy data in one clearly marked place, separate from UI code, shaped roughly
  like what a real API would return, so swapping in a backend later is a data-layer
  change and not a rewrite.
- All `localStorage` access goes through one small module (namespaced keys, safe
  JSON parse, a sensible default when the data is missing or corrupt). The UI should
  never call `localStorage` directly.

### Workflow
- **Each significant feature gets its own git worktree and branch.** Don't build
  features directly on the main branch, and don't put two features in one worktree.
  This keeps diffs reviewable one at a time and lets independent features run in
  parallel. Trivial fixes, like a typo or a one-line tweak, can skip this.
- **Plan for parallel work.** To get as much done as possible in 2 hours, split work
  into features that can be built at the same time, and run independent features as
  parallel subagents.
- **Split features by file to avoid merge conflicts.** Each feature should live in its
  own files, ideally its own folder with its component, data, and styles, so that
  parallel branches rarely touch the same file. Shared places like navigation,
  routing, and the list of features are where conflicts happen. Design them so that
  adding a feature means adding a new file, or at most one new line in a list.
  Never make edits scattered across shared files.
  Build the shared infrastructure (layout, nav, storage, data layer) first, before
  starting parallel feature work. When planning, list which files each feature
  touches, and flag any overlap before dispatching.
- Feature work is dispatched to this project's `feature-implementer` subagent
  (`.claude/agents/feature-implementer.md`). It's the same as the user-level agent but
  runs on **Opus**, because output quality matters more than cost in a 2-hour window.
