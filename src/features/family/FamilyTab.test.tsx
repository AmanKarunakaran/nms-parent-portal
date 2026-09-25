import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadJson } from '../../lib/storage'
import { FamilyTab } from './FamilyTab'

function card(name: string) {
  return screen.getByRole('region', { name })
}

function editAddress() {
  fireEvent.click(screen.getByRole('button', { name: 'Edit home address' }))
  return card('Home address')
}

describe('FamilyTab', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the Star, the three sections, and the saved seed values', () => {
    render(<FamilyTab />)
    expect(screen.getByRole('heading', { level: 2, name: 'Family info' })).toBeInTheDocument()
    expect(screen.getByText('Starry McStarface')).toBeInTheDocument()
    expect(screen.getByText("To change your Star's name, contact NMS.")).toBeInTheDocument()
    expect(within(card('Parent or guardian')).getByText('Jordan McStarface')).toBeInTheDocument()
    expect(within(card('Home address')).getByText('Austin')).toBeInTheDocument()
    expect(within(card("Your Star's school")).getByText('4th grade')).toBeInTheDocument()
  })

  it('saves an edited city, shows a confirmation, and keeps it after a remount', () => {
    const { unmount } = render(<FamilyTab />)
    const address = editAddress()
    expect(within(address).getByLabelText('Street address')).toHaveFocus()

    fireEvent.change(within(address).getByLabelText('City'), { target: { value: 'Round Rock' } })
    fireEvent.click(within(address).getByRole('button', { name: 'Save' }))

    expect(within(address).queryByRole('textbox')).not.toBeInTheDocument()
    expect(within(address).getByText('Round Rock')).toBeInTheDocument()
    expect(within(address).getByRole('status')).toHaveTextContent(
      'Saved! NMS will use this from now on.',
    )
    expect(screen.getByRole('button', { name: 'Edit home address' })).toHaveFocus()
    expect(loadJson('family.edits', null)).toEqual({ address: { city: 'Round Rock' } })

    unmount()
    render(<FamilyTab />)
    expect(within(card('Home address')).getByText('Round Rock')).toBeInTheDocument()
  })

  it('hides the confirmation after about 4 seconds', () => {
    vi.useFakeTimers()
    render(<FamilyTab />)
    const address = editAddress()
    fireEvent.click(within(address).getByRole('button', { name: 'Save' }))
    expect(within(address).getByRole('status')).toHaveTextContent('Saved!')

    act(() => vi.advanceTimersByTime(4000))
    expect(within(address).getByRole('status')).toBeEmptyDOMElement()
  })

  it('shows an inline error for an invalid ZIP code and saves nothing', () => {
    render(<FamilyTab />)
    const address = editAddress()
    const zip = within(address).getByLabelText('ZIP code')

    fireEvent.change(zip, { target: { value: '787' } })
    fireEvent.change(within(address).getByLabelText('City'), { target: { value: 'Round Rock' } })
    fireEvent.click(within(address).getByRole('button', { name: 'Save' }))

    expect(zip).toHaveAttribute('aria-invalid', 'true')
    expect(zip).toHaveAccessibleDescription('Please enter a 5-digit ZIP code.')
    expect(zip).toHaveFocus()
    expect(within(address).getByRole('status')).toBeEmptyDOMElement()
    expect(loadJson('family.edits', null)).toEqual({})
  })

  it('keeps the State hint and adds the error to its description', () => {
    render(<FamilyTab />)
    const address = editAddress()
    const state = within(address).getByLabelText('State')
    expect(state).toHaveAccessibleDescription('2 letters, like TX')

    fireEvent.change(state, { target: { value: 'T' } })
    fireEvent.click(within(address).getByRole('button', { name: 'Save' }))
    expect(state).toHaveAccessibleDescription(
      '2 letters, like TX Please enter your state as 2 letters, like TX.',
    )
  })

  it('moves focus to the first invalid field', () => {
    render(<FamilyTab />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit parent or guardian' }))
    const guardian = card('Parent or guardian')
    fireEvent.change(within(guardian).getByLabelText('Email'), { target: { value: 'nope' } })
    fireEvent.change(within(guardian).getByLabelText('Phone number'), { target: { value: '123' } })
    fireEvent.click(within(guardian).getByRole('button', { name: 'Save' }))

    expect(within(guardian).getByLabelText('Email')).toHaveFocus()
    expect(within(guardian).getByText('Please enter a 10-digit phone number.')).toBeInTheDocument()
  })

  it('throws away the draft on Cancel', () => {
    render(<FamilyTab />)
    let address = editAddress()
    fireEvent.change(within(address).getByLabelText('City'), { target: { value: 'Round Rock' } })
    fireEvent.click(within(address).getByRole('button', { name: 'Cancel' }))

    expect(within(address).getByText('Austin')).toBeInTheDocument()
    expect(within(address).queryByText('Round Rock')).not.toBeInTheDocument()
    expect(loadJson('family.edits', null)).toEqual({})

    address = editAddress()
    expect(within(address).getByLabelText('City')).toHaveValue('Austin')
  })

  it('lets only one card be edited at a time', () => {
    render(<FamilyTab />)
    editAddress()
    expect(screen.getByRole('button', { name: 'Edit parent or guardian' })).toBeDisabled()
    expect(screen.getByRole('button', { name: "Edit your Star's school" })).toBeDisabled()
  })

  it('saves a new grade from the dropdown', () => {
    render(<FamilyTab />)
    fireEvent.click(screen.getByRole('button', { name: "Edit your Star's school" }))
    const school = card("Your Star's school")
    fireEvent.change(within(school).getByLabelText('Grade'), { target: { value: 'K' } })
    fireEvent.click(within(school).getByRole('button', { name: 'Save' }))

    expect(within(school).getByText('Kindergarten')).toBeInTheDocument()
    expect(loadJson('family.edits', null)).toEqual({ school: { grade: 'K' } })
  })

  it('records a confirmation and swaps the button for Confirmed', () => {
    render(<FamilyTab />)
    const address = card('Home address')
    fireEvent.click(within(address).getByRole('button', { name: 'Yes, this is correct' }))
    expect(loadJson('actions.done', {})).toHaveProperty(['family.address.confirmed'])
    expect(within(address).getByRole('status')).toHaveTextContent('✓ Thanks for confirming!')
    expect(within(address).getByText('✓ Confirmed')).toBeInTheDocument()
    expect(within(address).queryByRole('button', { name: 'Yes, this is correct' })).not.toBeInTheDocument()
    expect(within(address).getByRole('button', { name: 'Edit home address' })).toBeEnabled()
    expect(loadJson('actions.done', {})).not.toHaveProperty(['family.school.confirmed'])
  })

  it('records the confirmation when an edit is saved', () => {
    render(<FamilyTab />)
    const school = card("Your Star's school")
    fireEvent.click(screen.getByRole('button', { name: "Edit your Star's school" }))
    expect(
      within(card('Home address')).getByRole('button', { name: 'Yes, this is correct' }),
    ).toBeDisabled()
    fireEvent.click(within(school).getByRole('button', { name: 'Save' }))
    expect(loadJson('actions.done', {})).toHaveProperty(['family.school.confirmed'])
    expect(within(school).getByText('✓ Confirmed')).toBeInTheDocument()
  })
})
