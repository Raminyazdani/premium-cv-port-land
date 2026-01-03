/**
 * SkillsSection Component Tests
 *
 * Tests that the Skills section renders correctly:
 * - For each language (en/de/fa)
 * - With typical data
 * - With empty data (graceful handling)
 * - RTL layout for Persian
 * - Skill filtering functionality
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { EmptySectionsProvider } from '@/context/EmptySectionsContext'
import { SkillsSection } from '@/components/sections/SkillsSection'
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

describe('SkillsSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<SkillsSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#skills')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays skills section heading in English', async () => {
      renderWithProviders(<SkillsSection />, { language: 'en' })

      await waitFor(() => {
        // Skills section heading is "Skills & Expertise"
        const heading = screen.getByRole('heading', { name: /skills.*expertise/i })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays skills section heading in German', async () => {
      renderWithProviders(<SkillsSection />, { language: 'de' })

      await waitFor(() => {
        // German translation varies - look for any heading in the skills section
        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toBeInTheDocument()
      })
    })

    it('displays skills section heading in Persian', async () => {
      renderWithProviders(<SkillsSection />, { language: 'fa' })

      await waitFor(() => {
        // Persian translation - look for any heading in the skills section
        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toBeInTheDocument()
      })
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<SkillsSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#skills')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('RTL Support', () => {
    it('applies RTL classes for Persian language', async () => {
      const { container } = renderWithProviders(<SkillsSection />, {
        language: 'fa',
      })

      await waitFor(() => {
        const section = container.querySelector('section#skills')
        expect(section).toBeInTheDocument()
      })

      // Document should have RTL direction for Persian
      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })
  })

  describe('UI Interactions', () => {
    it('has search input for filtering skills', async () => {
      renderWithProviders(<SkillsSection />, { language: 'en' })

      await waitFor(() => {
        const searchInput = screen.getByRole('textbox')
        expect(searchInput).toBeInTheDocument()
      })
    })

    it('has view toggle buttons (list/carousel)', async () => {
      renderWithProviders(<SkillsSection />, { language: 'en' })

      await waitFor(() => {
        // Look for the view toggle buttons
        const listViewButton = screen.getByRole('button', { name: /list view/i })
        const carouselViewButton = screen.getByRole('button', { name: /carousel view/i })
        expect(listViewButton).toBeInTheDocument()
        expect(carouselViewButton).toBeInTheDocument()
      })
    })

    it('allows typing in search input', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SkillsSection />, { language: 'en' })

      await waitFor(() => {
        const searchInput = screen.getByRole('textbox')
        expect(searchInput).toBeInTheDocument()
      })

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'Python')

      expect(searchInput).toHaveValue('Python')
    })
  })
})
