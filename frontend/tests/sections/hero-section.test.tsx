/**
 * HeroSection Component Tests
 *
 * Tests that the Hero section renders correctly:
 * - For each language (en/de/fa)
 * - With typical data
 * - Displays profile image and name
 * - RTL layout for Persian
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { EmptySectionsProvider } from '@/context/EmptySectionsContext'
import { HeroSection } from '@/components/sections/HeroSection'
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

describe('HeroSection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  describe('Rendering without crashing', () => {
    languages.forEach((lang) => {
      it(`renders without crashing in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<HeroSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#hero')
          expect(section).toBeInTheDocument()
        })
      })
    })
  })

  describe('Content rendering', () => {
    it('displays the person name', async () => {
      renderWithProviders(<HeroSection />, { language: 'en' })

      await waitFor(() => {
        // The hero section should display a heading with the person's name
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
        // Name should not be empty or "undefined"
        expect(heading.textContent).not.toBe('')
        expect(heading.textContent).not.toBe('undefined')
      })
    })

    it('displays profile image or fallback avatar', async () => {
      const { container } = renderWithProviders(<HeroSection />, { language: 'en' })

      await waitFor(() => {
        // Look for the profile image container
        const avatar = container.querySelector('[data-profile-image]')
        expect(avatar).toBeInTheDocument()
      })
    })
  })

  describe('No undefined or null strings', () => {
    languages.forEach((lang) => {
      it(`should not display "undefined" or "null" in ${lang.toUpperCase()}`, async () => {
        const { container } = renderWithProviders(<HeroSection />, {
          language: lang,
        })

        await waitFor(() => {
          const section = container.querySelector('section#hero')
          expect(section).toBeInTheDocument()
        })

        expect(container.textContent).not.toContain('undefined')
        expect(container.textContent).not.toContain('null')
      })
    })
  })

  describe('RTL Support', () => {
    it('sets document direction to RTL for Persian language', async () => {
      renderWithProviders(<HeroSection />, { language: 'fa' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })

    it('sets document direction to LTR for English', async () => {
      renderWithProviders(<HeroSection />, { language: 'en' })

      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      })
    })
  })

  describe('Interactive Elements', () => {
    it('has a scroll button', async () => {
      renderWithProviders(<HeroSection />, { language: 'en' })

      await waitFor(() => {
        // Look for scroll to about button
        const scrollButton = screen.getByRole('button', { name: /scroll/i })
        expect(scrollButton).toBeInTheDocument()
      })
    })
  })
})
