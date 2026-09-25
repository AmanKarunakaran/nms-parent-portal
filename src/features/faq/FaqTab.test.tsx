import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { faq } from '../../data/faq'
import { FaqTab } from './FaqTab'

describe('FaqTab', () => {
  it('renders every question and links to the relevant tab', () => {
    render(<FaqTab />)
    expect(screen.getByRole('heading', { name: 'Questions & answers' })).toBeInTheDocument()
    for (const item of faq) {
      expect(screen.getByText(item.question)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: 'Go to Budget' })).toHaveAttribute('href', '#/budget')
  })
})
