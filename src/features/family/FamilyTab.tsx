import { useEffect, useState } from 'react'
import { family } from '../../data/family'
import { star } from '../../data/star'
import { usePersistentState } from '../../lib/usePersistentState'
import {
  applySectionEdit,
  mergeFamily,
  type FamilyEdits,
  type SectionKey,
  type SectionValues,
} from './familyEdits'
import { familySections } from './familySections'
import { SectionCard } from './SectionCard'
import './FamilyTab.css'

const SAVED_MESSAGE = 'Saved! NMS will use this from now on.'
const SAVED_MESSAGE_MS = 4000

export function FamilyTab() {
  const [edits, setEdits] = usePersistentState<FamilyEdits>('family.edits', {})
  const [editing, setEditing] = useState<SectionKey | null>(null)
  // A fresh object per save, so saving the same card twice restarts the timer.
  const [justSaved, setJustSaved] = useState<{ key: SectionKey } | null>(null)
  const current = mergeFamily(family, edits)

  useEffect(() => {
    if (!justSaved) return
    const timer = window.setTimeout(() => setJustSaved(null), SAVED_MESSAGE_MS)
    return () => window.clearTimeout(timer)
  }, [justSaved])

  function startEditing(key: SectionKey) {
    setJustSaved(null)
    setEditing(key)
  }

  function save(key: SectionKey, values: SectionValues) {
    setEdits((previous) => applySectionEdit(family, previous, key, values))
    setEditing(null)
    setJustSaved({ key })
  }

  return (
    <section className="family">
      <h2 className="family__title">Family info</h2>
      <p className="family__subtitle">Keep this up to date so NMS can reach you and your Star.</p>

      <div className="family__cards">
        <div className="family-card">
          <p className="family-card__label">Your Star</p>
          <p className="family__star-name">{star.name}</p>
          <p className="family__note">To change your Star's name, contact NMS.</p>
        </div>

        {familySections.map((section) => (
          <SectionCard
            key={section.key}
            section={section}
            values={current[section.key]}
            isEditing={editing === section.key}
            canEdit={editing === null}
            statusMessage={justSaved?.key === section.key ? SAVED_MESSAGE : ''}
            onEdit={() => startEditing(section.key)}
            onCancel={() => setEditing(null)}
            onSave={(values) => save(section.key, values)}
          />
        ))}
      </div>
    </section>
  )
}
