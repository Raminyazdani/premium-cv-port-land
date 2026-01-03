/**
 * Accessibility Focus Management Tests
 * 
 * Tests for modal focus management, keyboard navigation, and accessibility features.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MediaModal } from '@/components/MediaModal'
import { renderWithMinimalProviders } from './test-utils'

// MediaModal tests
describe('MediaModal - Focus Management', () => {
  it('should have proper ARIA attributes when open', () => {
    renderWithMinimalProviders(
      <MediaModal
        url="https://example.com/image.jpg"
        alt="Test image"
        isOpen={true}
        onClose={() => {}}
      />
    )

    // Check for dialog role and modal attribute
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('should close on Escape key press', async () => {
    const onClose = vi.fn()
    
    renderWithMinimalProviders(
      <MediaModal
        url="https://example.com/image.jpg"
        alt="Test image"
        isOpen={true}
        onClose={onClose}
      />
    )

    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(onClose).toHaveBeenCalled()
  })

  it('should have a close button with accessible label', () => {
    renderWithMinimalProviders(
      <MediaModal
        url="https://example.com/image.jpg"
        alt="Test image"
        isOpen={true}
        onClose={() => {}}
      />
    )

    // Check for close button with aria-label
    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toBeInTheDocument()
  })

  it('should have navigation buttons with accessible labels when gallery mode', () => {
    const mediaList = [
      { url: 'https://example.com/image1.jpg', alt: 'Image 1' },
      { url: 'https://example.com/image2.jpg', alt: 'Image 2' },
    ]

    renderWithMinimalProviders(
      <MediaModal
        url="https://example.com/image1.jpg"
        alt="Image 1"
        isOpen={true}
        onClose={() => {}}
        mediaList={mediaList}
        currentIndex={0}
        onNavigate={() => {}}
      />
    )

    // Check for navigation buttons with aria-labels
    const prevButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('should navigate with arrow keys in gallery mode', () => {
    const onNavigate = vi.fn()
    const mediaList = [
      { url: 'https://example.com/image1.jpg', alt: 'Image 1' },
      { url: 'https://example.com/image2.jpg', alt: 'Image 2' },
      { url: 'https://example.com/image3.jpg', alt: 'Image 3' },
    ]

    renderWithMinimalProviders(
      <MediaModal
        url="https://example.com/image2.jpg"
        alt="Image 2"
        isOpen={true}
        onClose={() => {}}
        mediaList={mediaList}
        currentIndex={1}
        onNavigate={onNavigate}
      />
    )

    // Press ArrowRight to go to next
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(onNavigate).toHaveBeenCalledWith(2)

    // Press ArrowLeft to go to previous
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(onNavigate).toHaveBeenCalledWith(0)
  })

  it('should have live region for announcements', () => {
    renderWithMinimalProviders(
      <MediaModal
        url="https://example.com/image.jpg"
        alt="Test image"
        isOpen={true}
        onClose={() => {}}
      />
    )

    // Check for live region - there may be multiple status elements (including loading spinner)
    const liveRegions = screen.getAllByRole('status')
    // At least one should have aria-live="polite" for announcements
    const politeRegion = liveRegions.find(
      region => region.getAttribute('aria-live') === 'polite'
    )
    expect(politeRegion).toBeInTheDocument()
  })
})

// Icon-only button tests
describe('Icon-only controls accessibility', () => {
  it('should verify aria-labels are localized in i18n', async () => {
    // Import translations
    const { en } = await import('@/i18n/translations/en')
    const { de } = await import('@/i18n/translations/de')
    const { fa } = await import('@/i18n/translations/fa')
    
    // Check that key accessibility labels exist in all languages
    const keysToCheck = [
      'close_modal',
      'previous_slide',
      'next_slide',
      'close',
    ]

    for (const key of keysToCheck) {
      expect(en.a11y[key as keyof typeof en.a11y]).toBeDefined()
      expect(de.a11y[key as keyof typeof de.a11y]).toBeDefined()
      expect(fa.a11y[key as keyof typeof fa.a11y]).toBeDefined()
    }
  })
})

// Required field indicator tests
describe('Required field indicators', () => {
  it('should have screen-reader text for required fields', async () => {
    // Import ContactForm component
    const { ContactForm } = await import('@/components/ContactForm')
    
    renderWithMinimalProviders(<ContactForm />)

    // Check for required field indicators
    const requiredIndicators = screen.getAllByText('*')
    expect(requiredIndicators.length).toBeGreaterThan(0)

    // Each required indicator should have aria-label
    for (const indicator of requiredIndicators) {
      expect(indicator).toHaveAttribute('aria-label', 'required')
    }
  })
})
