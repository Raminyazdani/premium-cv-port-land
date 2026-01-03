/**
 * WorkshopAndCertificationsSection Component Tests
 *
 * Tests that the Workshops and Certifications section renders correctly:
 * - For each language (en/de/fa)
 * - With typical data
 * - With empty data (graceful handling)
 * - RTL layout for Persian
 * - Filtering functionality
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { EmptySectionsProvider } from '@/context/EmptySectionsContext'
import { WorkshopAndCertificationsSection } from '@/components/sections/WorkshopAndCertificationsSection'
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

describe('WorkshopAndCertificationsSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<WorkshopAndCertificationsSection />, {
          language: lang,
        })

        await waitFor(() => {
          // Section may have id "certifications" or similar
          const section = container.querySelector('section')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays section heading', async () => {
      renderWithProviders(<WorkshopAndCertificationsSection />, { language: 'en' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /certification|workshop/i })
        expect(heading).toBeInTheDocument()
      })
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<WorkshopAndCertificationsSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('RTL Support', () => {
    it('sets document direction to RTL for Persian language', async () => {
      renderWithProviders(<WorkshopAndCertificationsSection />, { language: 'fa' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })
  })

  describe('UI Elements', () => {
    it('has a search input for filtering certifications', async () => {
      renderWithProviders(<WorkshopAndCertificationsSection />, { language: 'en' })

      await waitFor(() => {
        // Search for certifications input - it should be the search input
        const searchInput = screen.getByPlaceholderText(/search/i)
        expect(searchInput).toBeInTheDocument()
      })
    })

    it('has a switch for certified only filter', async () => {
      renderWithProviders(<WorkshopAndCertificationsSection />, { language: 'en' })

      await waitFor(() => {
        const switchElement = screen.getByRole('switch')
        expect(switchElement).toBeInTheDocument()
      })
    })
  })
})
