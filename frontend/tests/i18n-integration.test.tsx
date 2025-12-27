/**
 * I18N Integration Tests
 * 
 * Tests that verify language switching updates both UI and data correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import App from '@/App'
import { getUIStrings } from '@/lib/i18n'
import type { Language } from '@/utils/dataNormalizer'

describe('I18N Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('should render with default language (English)', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('en')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    })
  })

  it('should switch to German and update UI strings', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // May have multiple language buttons (mobile/desktop) - use the first one
    const languageButtons = await screen.findAllByLabelText(/select language/i)
    await user.click(languageButtons[0])
    
    const germanOption = await screen.findByText(/Deutsch/i)
    await user.click(germanOption)
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('de')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    })
    
    const strings = getUIStrings('de')
    
    await waitFor(() => {
      expect(screen.getByText(strings.sections.education)).toBeInTheDocument()
    })
  })

  it('should switch to Persian and update UI strings with RTL', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // May have multiple language buttons (mobile/desktop) - use the first one
    const languageButtons = await screen.findAllByLabelText(/select language/i)
    await user.click(languageButtons[0])
    
    const persianOption = await screen.findByText(/فارسی/i)
    await user.click(persianOption)
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('fa')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    })
    
    const strings = getUIStrings('fa')
    
    await waitFor(() => {
      expect(screen.getByText(strings.sections.education)).toBeInTheDocument()
    })
  })

  it('should persist language selection in localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // May have multiple language buttons (mobile/desktop) - use the first one
    const languageButtons = await screen.findAllByLabelText(/select language/i)
    await user.click(languageButtons[0])
    
    const germanOption = await screen.findByText(/Deutsch/i)
    await user.click(germanOption)
    
    await waitFor(() => {
      expect(localStorage.getItem('cv-language')).toBe('de')
    })
  })

  it('should update URL parameter when language changes', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // May have multiple language buttons (mobile/desktop) - use the first one
    const languageButtons = await screen.findAllByLabelText(/select language/i)
    await user.click(languageButtons[0])
    
    const persianOption = await screen.findByText(/فارسی/i)
    await user.click(persianOption)
    
    await waitFor(() => {
      expect(window.location.search).toContain('lang=fa')
    })
  })

  it('should load CV data in the selected language', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    
    await waitFor(() => {
      const educationSection = container.querySelector('[id="education"]')
      expect(educationSection).toBeInTheDocument()
    })
    
    // May have multiple language buttons (mobile/desktop) - use the first one
    const languageButtons = await screen.findAllByLabelText(/select language/i)
    await user.click(languageButtons[0])
    
    const germanOption = await screen.findByText(/Deutsch/i)
    await user.click(germanOption)
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('de')
    })
    
    const educationSection = container.querySelector('[id="education"]')
    expect(educationSection).toBeInTheDocument()
  })

  it('should not show mixed language content', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const enStrings = getUIStrings('en')
    const deStrings = getUIStrings('de')
    
    await waitFor(() => {
      expect(screen.getByText(enStrings.nav.education)).toBeInTheDocument()
    })
    
    // May have multiple language buttons (mobile/desktop) - use the first one
    const languageButtons = await screen.findAllByLabelText(/select language/i)
    await user.click(languageButtons[0])
    
    const germanOption = await screen.findByText(/Deutsch/i)
    await user.click(germanOption)
    
    await waitFor(() => {
      expect(screen.queryByText(enStrings.nav.education)).not.toBeInTheDocument()
      expect(screen.getByText(deStrings.nav.education)).toBeInTheDocument()
    })
  })

  const languages: Language[] = ['en', 'de', 'fa']
  
  languages.forEach(lang => {
    it(`should render complete ${lang.toUpperCase()} UI`, async () => {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', lang)
      window.history.replaceState({}, '', url.toString())
      
      render(<App />)
      
      const strings = getUIStrings(lang)
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('lang')).toBe(lang)
      })
      
      await waitFor(() => {
        expect(screen.getByText(strings.nav.education)).toBeInTheDocument()
      })
    })
  })

  it('should handle invalid language gracefully', () => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', 'invalid')
    window.history.replaceState({}, '', url.toString())
    
    render(<App />)
    
    expect(document.documentElement.getAttribute('lang')).toBe('en')
  })

  it('should detect browser language', () => {
    Object.defineProperty(window.navigator, 'language', {
      value: 'de-DE',
      configurable: true
    })
    
    render(<App />)
    
    waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('de')
    })
  })
})
