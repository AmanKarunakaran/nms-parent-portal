import { useId, useRef, useState, type FormEvent } from 'react'
import { budgetCategories, type BudgetCategory, type ReimbursementRequest } from '../../data/budget'
import { DEMO_TODAY } from '../../data/demoDate'
import { toCents } from './budgetMath'
import {
  parseAmount,
  reimbursementFields,
  validateReimbursement,
  type ReimbursementErrors,
  type ReimbursementField,
  type ReimbursementForm as FormValues,
} from './validateReimbursement'
import './ReimbursementForm.css'

const EMPTY_FORM: FormValues = { description: '', category: '', date: '', amount: '' }

const SUCCESS_MESSAGE = 'Request sent. NMS usually reviews requests within 5 business days.'

type ReimbursementFormProps = {
  left: number
  onSubmit: (request: ReimbursementRequest) => void
}

export function ReimbursementForm({ left, onSubmit }: ReimbursementFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<ReimbursementErrors>({})
  const [statusMessage, setStatusMessage] = useState('')
  const fieldRefs = useRef<Partial<Record<ReimbursementField, HTMLElement | null>>>({})
  const baseId = useId()
  const headingId = `${baseId}-heading`

  const fieldId = (field: ReimbursementField) => `${baseId}-${field}`
  const errorId = (field: ReimbursementField) => `${baseId}-${field}-error`

  function update(field: ReimbursementField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateReimbursement(values, left, DEMO_TODAY)
    setErrors(nextErrors)

    const firstInvalid = reimbursementFields.find((field) => nextErrors[field])
    if (firstInvalid) {
      setStatusMessage('')
      fieldRefs.current[firstInvalid]?.focus()
      return
    }

    onSubmit({
      id: `reimbursement-${crypto.randomUUID()}`,
      submittedAt: new Date().toISOString(),
      description: values.description.trim(),
      // Validation passed, so this is one of the listed categories.
      category: values.category as BudgetCategory,
      date: values.date,
      amount: toCents(parseAmount(values.amount)) / 100,
    })
    setValues(EMPTY_FORM)
    setStatusMessage(SUCCESS_MESSAGE)
  }

  // Props shared by every field: id, aria wiring, and a ref for focusing.
  function fieldProps(field: ReimbursementField) {
    const error = errors[field]
    return {
      id: fieldId(field),
      name: field,
      value: values[field],
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? errorId(field) : undefined,
      ref: (element: HTMLElement | null) => {
        fieldRefs.current[field] = element
      },
    }
  }

  function errorFor(field: ReimbursementField) {
    const error = errors[field]
    if (!error) return null
    return (
      <p id={errorId(field)} className="reimbursement-form__error">
        {error}
      </p>
    )
  }

  return (
    <section className="reimbursement-form" aria-labelledby={headingId}>
      <h3 id={headingId} className="budget-tab__section-title">
        Ask to be paid back
      </h3>
      <p className="budget-tab__section-hint">
        Paid for something yourself? Tell us about it and NMS will pay you back from your
        budget.
      </p>

      <form className="reimbursement-form__card" onSubmit={handleSubmit} noValidate>
        <div className="reimbursement-form__field">
          <label htmlFor={fieldId('description')}>What did you buy?</label>
          <input
            type="text"
            autoComplete="off"
            placeholder="For example: math workbook"
            {...fieldProps('description')}
            onChange={(event) => update('description', event.target.value)}
          />
          {errorFor('description')}
        </div>

        <div className="reimbursement-form__field">
          <label htmlFor={fieldId('category')}>Category</label>
          <select
            {...fieldProps('category')}
            onChange={(event) => update('category', event.target.value)}
          >
            <option value="">Choose one…</option>
            {budgetCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errorFor('category')}
        </div>

        <div className="reimbursement-form__field">
          <label htmlFor={fieldId('date')}>Date you paid</label>
          <input
            type="date"
            max={DEMO_TODAY}
            {...fieldProps('date')}
            onChange={(event) => update('date', event.target.value)}
          />
          {errorFor('date')}
        </div>

        <div className="reimbursement-form__field">
          <label htmlFor={fieldId('amount')}>Amount ($)</label>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="For example: 25.50"
            {...fieldProps('amount')}
            onChange={(event) => update('amount', event.target.value)}
          />
          {errorFor('amount')}
        </div>

        <p className="reimbursement-form__helper">NMS will email you if we need a receipt.</p>

        <button type="submit" className="reimbursement-form__submit">
          Send request
        </button>

        <p role="status" className="reimbursement-form__status">
          {statusMessage}
        </p>
      </form>
    </section>
  )
}
