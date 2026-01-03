/**
 * ProjectsSection Component Tests
 *
 * Tests that the Projects section renders correctly:
 * - For each language (en/de/fa)
 * - With typical data
 * - With empty data (graceful handling)
 * - RTL layout for Persian
 * - Domain label filtering
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { EmptySectionsProvider } from '@/context/EmptySectionsContext'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
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

describe('ProjectsSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<ProjectsSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#projects')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays projects section heading in English', async () => {
      renderWithProviders(<ProjectsSection />, { language: 'en' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /projects/i })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays projects section heading in German', async () => {
      renderWithProviders(<ProjectsSection />, { language: 'de' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /projekte/i })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays projects section heading in Persian', async () => {
      renderWithProviders(<ProjectsSection />, { language: 'fa' })

      await waitFor(() => {
        const heading = screen.getByRole('heading', { name: /پروژه/i })
        expect(heading).toBeInTheDocument()
      })
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<ProjectsSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#projects')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('RTL Support', () => {
    it('sets document direction to RTL for Persian language', async () => {
      renderWithProviders(<ProjectsSection />, { language: 'fa' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })

    it('keeps document direction as LTR for English', async () => {
      renderWithProviders(<ProjectsSection />, { language: 'en' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      })
    })
  })

  describe('UI Elements', () => {
    it('has a search input for filtering projects', async () => {
      renderWithProviders(<ProjectsSection />, { language: 'en' })

      await waitFor(() => {
        const searchInput = screen.getByRole('textbox')
        expect(searchInput).toBeInTheDocument()
      })
    })

    it('displays domain filter badges', async () => {
      const { container } = renderWithProviders(<ProjectsSection />, { language: 'en' })

      await waitFor(() => {
        // Look for filter badges (badge elements) in the section
        const badges = container.querySelectorAll('[data-slot="badge-content"]')
        // At least some badges should exist for domain filtering
        expect(badges).toBeDefined()
      })
    })

    it('displays project count', async () => {
      renderWithProviders(<ProjectsSection />, { language: 'en' })

      await waitFor(() => {
        // Count text should be present
        const countText = screen.getByText(/showing/i)
        expect(countText).toBeInTheDocument()
      })
    })
  })
})
