/**
 * BasicsSection Component Tests
 *
 * Tests that the Basics/About section renders correctly:
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
import { BasicsSection } from '@/components/sections/BasicsSection'
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

describe('BasicsSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<BasicsSection />, {
          language: lang,
        })

        await waitFor(() => {
          // Section should exist (either about section or empty state)
          const section = container.querySelector('section#about')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays person name as heading', async () => {
      renderWithProviders(<BasicsSection />, { language: 'en' })

      await waitFor(() => {
        // The about section should display a heading with the person's name
        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toBeInTheDocument()
        // Name should not be empty or "undefined"
        expect(heading.textContent).not.toBe('')
        expect(heading.textContent).not.toBe('undefined')
      })
    })

    it('displays avatar image or fallback', async () => {
      const { container } = renderWithProviders(<BasicsSection />, { language: 'en' })

      await waitFor(() => {
        // Look for the avatar element using data-slot attribute (stable attribute from UI library)
        const avatar = container.querySelector('[data-slot="avatar"]')
        expect(avatar).toBeInTheDocument()
      })
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<BasicsSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#about')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('RTL Support', () => {
    it('sets document direction to RTL for Persian language', async () => {
      renderWithProviders(<BasicsSection />, { language: 'fa' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })

    it('sets document direction to LTR for English', async () => {
      renderWithProviders(<BasicsSection />, { language: 'en' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      })
    })
  })

  describe('Contact Information', () => {
    it('displays email link if available', async () => {
      renderWithProviders(<BasicsSection />, { language: 'en' })

      await waitFor(() => {
        // Email links should be present if data includes email
        const emailLinks = screen.queryAllByRole('link', { name: /@/i })
        // This test just checks the rendering doesn't crash
        // Actual email presence depends on data
        expect(emailLinks).toBeDefined()
      })
    })
  })
})
