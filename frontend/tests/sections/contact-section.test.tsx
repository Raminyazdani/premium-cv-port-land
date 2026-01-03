/**
 * ContactSection Component Tests
 *
 * Tests that the Contact section renders correctly:
 * - For each language (en/de/fa)
 * - Tab switching between Message and Booking
 * - RTL layout for Persian
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { EmptySectionsProvider } from '@/context/EmptySectionsContext'
import { ContactSection } from '@/components/sections/ContactSection'
import type { Language } from '@/utils/dataNormalizer'

// Helper to render with all required providers
function renderWithProviders(
  ui: React.ReactElement,
  { language = 'en' as Language, showEmpty = false } = {}
) {
  // Set language via URL parameter
  const url = new URL(window.location.href)
  url.searchParams.set('lang', language)
  window.history.replaceState({}, '', url.toString())

  return render(
    <LanguageProvider>
      <CVDataProvider>
        <FilterProvider>
          <EmptySectionsProvider initialShowEmpty={showEmpty}>
            {ui}
          </EmptySectionsProvider>
        </FilterProvider>
      </CVDataProvider>
    </LanguageProvider>
  )
}

const languages: Language[] = ['en', 'de', 'fa']

describe('ContactSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<ContactSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#contact')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays contact section heading in English', async () => {
      renderWithProviders(<ContactSection />, { language: 'en' })

      await waitFor(() => {
        // Contact section heading - look for any h2 heading
        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toBeInTheDocument()
      })
    })
  })

  describe('Tab switching', () => {
    it('has message and booking tabs', async () => {
      renderWithProviders(<ContactSection />, { language: 'en' })

      await waitFor(() => {
        const tabs = screen.getAllByRole('tab')
        expect(tabs.length).toBeGreaterThanOrEqual(2)
      })
    })

    it('allows switching between tabs', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ContactSection />, { language: 'en' })

      await waitFor(() => {
        const tabs = screen.getAllByRole('tab')
        expect(tabs.length).toBeGreaterThanOrEqual(2)
      })

      // Find and click the second tab
      const tabs = screen.getAllByRole('tab')
      if (tabs.length > 1 && tabs[1]) {
        await user.click(tabs[1])
        // Tab should now be selected
        await waitFor(() => {
          expect(tabs[1].getAttribute('data-state')).toBe('active')
        })
      }
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<ContactSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#contact')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('RTL Support', () => {
    it('sets document direction to RTL for Persian language', async () => {
      renderWithProviders(<ContactSection />, { language: 'fa' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })
  })
})
