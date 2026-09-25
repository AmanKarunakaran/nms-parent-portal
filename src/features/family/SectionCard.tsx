import { useEffect, useId, useRef } from 'react'
import type { SectionValues } from './familyEdits'
import type { FieldConfig, SectionConfig } from './familySections'
import { SectionForm } from './SectionForm'
import './SectionCard.css'

type SectionCardProps = {
  section: SectionConfig
  values: SectionValues
  isEditing: boolean
  // False while another card is being edited: only one card is edited at a time.
  canEdit: boolean
  statusMessage: string
  confirmed: boolean
  onConfirm: () => void
  onEdit: () => void
  onCancel: () => void
  onSave: (values: SectionValues) => void
}

function displayValue(field: FieldConfig, value: string): string {
  return field.options?.find((option) => option.value === value)?.label ?? value
}

export function SectionCard({
  section,
  values,
  isEditing,
  canEdit,
  statusMessage,
  confirmed,
  onConfirm,
  onEdit,
  onCancel,
  onSave,
}: SectionCardProps) {
  const headingId = useId()
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const wasEditing = useRef(isEditing)
  const fields: FieldConfig[] = section.fields

  // Return focus to the Edit button after Save or Cancel so keyboard users aren't lost.
  useEffect(() => {
    if (wasEditing.current && !isEditing) editButtonRef.current?.focus()
    wasEditing.current = isEditing
  }, [isEditing])

  return (
    <section className="family-card" aria-labelledby={headingId}>
      <div className="family-card__header">
        <h3 id={headingId} className="family-card__title">
          {section.title}
        </h3>
        {!isEditing && (
          <div className="family-card__actions">
            {confirmed ? (
              <span className="family-card__confirmed">✓ Confirmed</span>
            ) : (
              <button type="button" className="family-card__button" disabled={!canEdit} onClick={onConfirm}>
                Yes, this is correct
              </button>
            )}
            <button
              ref={editButtonRef}
              type="button"
              className="family-card__button"
              aria-label={section.editLabel}
              disabled={!canEdit}
              onClick={onEdit}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <SectionForm section={section} values={values} onSave={onSave} onCancel={onCancel} />
      ) : (
        <dl className="family-card__values">
          {fields.map((field) => (
            <div key={field.name} className="family-card__row">
              <dt className="family-card__label">{field.label}</dt>
              <dd className="family-card__value">{displayValue(field, values[field.name])}</dd>
            </div>
          ))}
        </dl>
      )}

      <p role="status" className="family-card__status">
        {statusMessage}
      </p>
    </section>
  )
}
