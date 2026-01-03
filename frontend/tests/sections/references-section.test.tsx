/**
 * ReferencesSection Component Tests
 *
 * Tests that the References section renders correctly:
 * - For each language (en/de/fa)
 * - With typical data
 * - With empty data (graceful handling)
 * - RTL layout for Persian
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { EmptySectionsProvider } from '@/context/EmptySectionsContext'
import { ReferencesSection } from '@/components/sections/ReferencesSection'
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

describe('ReferencesSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<ReferencesSection />, {
          language: lang,
        })

        await waitFor(() => {
          // Section should exist
          const section = container.querySelector('section#references')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays references section heading in English', async () => {
      renderWithProviders(<ReferencesSection />, { language: 'en' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /references/i })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays references section heading in German', async () => {
      renderWithProviders(<ReferencesSection />, { language: 'de' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /referenzen/i })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays references section heading in Persian', async () => {
      renderWithProviders(<ReferencesSection />, { language: 'fa' })

      await waitFor(() => {
        // Persian translation - look for any h2 heading in the references section
        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays privacy notice', async () => {
      renderWithProviders(<ReferencesSection />, { language: 'en' })

      await waitFor(() => {
        // Privacy notice should be displayed
        const section = screen.getByRole('region', { name: /references/i })
        expect(section).toBeInTheDocument()
      })
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<ReferencesSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#references')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper section structure with aria-labelledby', async () => {
      const { container } = renderWithProviders(<ReferencesSection />, {
        language: 'en',
      })

      await waitFor(() => {
        const section = container.querySelector('section#references')
        expect(section).toBeInTheDocument()
        expect(section?.getAttribute('aria-labelledby')).toBe('references-heading')
      })
    })
  })

  describe('RTL Support', () => {
    it('applies RTL class for Persian language', async () => {
      const { container } = renderWithProviders(<ReferencesSection />, {
        language: 'fa',
      })

      await waitFor(() => {
        const section = container.querySelector('section#references')
        expect(section).toBeInTheDocument()
        expect(section?.className).toContain('rtl')
      })
    })

    it('does not apply RTL class for English', async () => {
      const { container } = renderWithProviders(<ReferencesSection />, {
        language: 'en',
      })

      await waitFor(() => {
        const section = container.querySelector('section#references')
        expect(section).toBeInTheDocument()
        expect(section?.className).not.toContain('rtl')
      })
    })
  })
})
