import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import type { SectionValues } from './familyEdits'
import type { FieldConfig, SectionConfig } from './familySections'
import { normalizeSection, validateSection } from './familyValidation'

type SectionFormProps = {
  section: SectionConfig
  values: SectionValues
  onSave: (values: SectionValues) => void
  onCancel: () => void
}

type FieldElement = HTMLInputElement | HTMLSelectElement

// Mounted only while editing, so the draft is thrown away on Cancel or Save.
export function SectionForm({ section, values, onSave, onCancel }: SectionFormProps) {
  const idPrefix = useId()
  const [draft, setDraft] = useState<SectionValues>(values)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fieldRefs = useRef<Record<string, FieldElement | null>>({})
  const fields: FieldConfig[] = section.fields

  useEffect(() => {
    fieldRefs.current[fields[0].name]?.focus()
  }, [fields])

  function handleChange(name: string, value: string) {
    setDraft((current) => ({ ...current, [name]: value }))
    if (errors[name]) {
      setErrors(({ [name]: _cleared, ...rest }) => rest)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = normalizeSection(section.key, draft)
    const nextErrors = validateSection(section.key, normalized)
    setErrors(nextErrors)
    const firstInvalid = fields.find((field) => nextErrors[field.name])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid.name]?.focus()
      return
    }
    onSave(normalized)
  }

  return (
    <form className="family-card__form" noValidate onSubmit={handleSubmit}>
      {fields.map((field) => {
        const inputId = `${idPrefix}-${field.name}`
        const hintId = `${inputId}-hint`
        const errorId = `${inputId}-error`
        const error = errors[field.name]
        const describedBy = [field.hint && hintId, error && errorId].filter(Boolean).join(' ')
        const shared = {
          id: inputId,
          name: field.name,
          className: 'family-card__input',
          value: draft[field.name] ?? '',
          'aria-invalid': error ? true : undefined,
          'aria-describedby': describedBy || undefined,
          ref: (element: FieldElement | null) => {
            fieldRefs.current[field.name] = element
          },
        }
        return (
          <div key={field.name} className="family-card__field">
            <label htmlFor={inputId} className="family-card__label">
              {field.label}
            </label>
            {field.hint && (
              <p id={hintId} className="family-card__hint">
                {field.hint}
              </p>
            )}
            {field.input === 'select' ? (
              <select {...shared} onChange={(event) => handleChange(field.name, event.target.value)}>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...shared}
                type={field.input}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                maxLength={field.maxLength}
                onChange={(event) => handleChange(field.name, event.target.value)}
              />
            )}
            {error && (
              <p id={errorId} className="family-card__error">
                {error}
              </p>
            )}
          </div>
        )
      })}
      <div className="family-card__actions">
        <button type="submit" className="family-card__button family-card__button--primary">
          Save
        </button>
        <button type="button" className="family-card__button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
