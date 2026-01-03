/**
 * LanguagesSection Component Tests
 *
 * Tests that the Languages section renders correctly:
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
import { LanguagesSection } from '@/components/sections/LanguagesSection'
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

describe('LanguagesSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<LanguagesSection />, {
          language: lang,
        })

        await waitFor(() => {
          // Section should exist
          const section = container.querySelector('section#languages')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays languages section heading in English', async () => {
      renderWithProviders(<LanguagesSection />, { language: 'en' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /languages/i })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays languages section heading in German', async () => {
      renderWithProviders(<LanguagesSection />, { language: 'de' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /sprachen/i })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays languages section heading in Persian', async () => {
      renderWithProviders(<LanguagesSection />, { language: 'fa' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /زبان/i })
        expect(heading).toBeInTheDocument()
      })
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<LanguagesSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#languages')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper section structure with aria-labelledby', async () => {
      const { container } = renderWithProviders(<LanguagesSection />, {
        language: 'en',
      })

      await waitFor(() => {
        const section = container.querySelector('section#languages')
        expect(section).toBeInTheDocument()
        expect(section?.getAttribute('aria-labelledby')).toBe('languages-heading')
      })
    })
  })

  describe('RTL Support', () => {
    it('applies RTL class for Persian language', async () => {
      const { container } = renderWithProviders(<LanguagesSection />, {
        language: 'fa',
      })

      await waitFor(() => {
        const section = container.querySelector('section#languages')
        expect(section).toBeInTheDocument()
        expect(section?.className).toContain('rtl')
      })
    })

    it('does not apply RTL class for English', async () => {
      const { container } = renderWithProviders(<LanguagesSection />, {
        language: 'en',
      })

      await waitFor(() => {
        const section = container.querySelector('section#languages')
        expect(section).toBeInTheDocument()
        expect(section?.className).not.toContain('rtl')
      })
    })
  })
})
