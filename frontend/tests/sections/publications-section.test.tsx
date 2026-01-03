/**
 * PublicationsSection Component Tests
 *
 * Tests that the Publications section renders correctly:
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
import { PublicationsSection } from '@/components/sections/PublicationsSection'
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

describe('PublicationsSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<PublicationsSection />, {
          language: lang,
        })

        await waitFor(() => {
          // Section should exist (either with content or empty state)
          const section = container.querySelector('section#publications')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays publications section heading', async () => {
      renderWithProviders(<PublicationsSection />, { language: 'en' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /publications/i })
        expect(heading).toBeInTheDocument()
      })
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<PublicationsSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#publications')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('RTL Support', () => {
    it('sets document direction to RTL for Persian language', async () => {
      renderWithProviders(<PublicationsSection />, { language: 'fa' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })
  })

  describe('UI Elements', () => {
    it('has a search input for filtering publications', async () => {
      renderWithProviders(<PublicationsSection />, { language: 'en' })

      await waitFor(() => {
        const searchInput = screen.getByRole('textbox')
        expect(searchInput).toBeInTheDocument()
      })
    })

    it('has filter tabs', async () => {
      renderWithProviders(<PublicationsSection />, { language: 'en' })

      await waitFor(() => {
        const tabs = screen.getAllByRole('tab')
        expect(tabs.length).toBeGreaterThan(0)
      })
    })
  })
})
