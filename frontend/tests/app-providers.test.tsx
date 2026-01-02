/**
 * Tests for AppProviders component
 * 
 * Verifies that the consolidated provider wrapper maintains correct behavior
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AppProviders } from '@/app/AppProviders'
import { useLanguage, useTranslation } from '@/context/LanguageContext'
import { useCVData } from '@/context/CVDataContext'
import { useFilter } from '@/context/FilterContext'
import { useKonami } from '@/context/KonamiContext'
import { usePWA } from '@/context/PWAContext'
import { useAccessibility } from '@/context/AccessibilityContext'

describe('AppProviders', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
    window.history.replaceState({}, '', '/')
  })

  it('should render children correctly', () => {
    render(
      <AppProviders>
        <div data-testid="test-child">Test Content</div>
      </AppProviders>
    )
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should provide LanguageContext', async () => {
    function LanguageConsumer() {
      const { language, isRTL } = useLanguage()
      return (
        <div>
          <span data-testid="language">{language}</span>
          <span data-testid="is-rtl">{String(isRTL)}</span>
        </div>
      )
    }
    
    render(
      <AppProviders>
        <LanguageConsumer />
      </AppProviders>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('en')
      expect(screen.getByTestId('is-rtl')).toHaveTextContent('false')
    })
  })

  it('should provide CVDataContext', async () => {
    function CVDataConsumer() {
      const { data, isValid } = useCVData()
      return (
        <div>
          <span data-testid="has-basics">{String(Array.isArray(data?.basics))}</span>
          <span data-testid="is-valid">{String(isValid)}</span>
        </div>
      )
    }
    
    render(
      <AppProviders>
        <CVDataConsumer />
      </AppProviders>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('has-basics')).toHaveTextContent('true')
      expect(screen.getByTestId('is-valid')).toHaveTextContent('true')
    })
  })

  it('should provide FilterContext', () => {
    function FilterConsumer() {
      const { selectedFocus, availableFocusOptions } = useFilter()
      return (
        <div>
          <span data-testid="focus">{selectedFocus}</span>
          <span data-testid="has-options">{String(Array.isArray(availableFocusOptions))}</span>
        </div>
      )
    }
    
    render(
      <AppProviders>
        <FilterConsumer />
      </AppProviders>
    )
    
    expect(screen.getByTestId('focus')).toHaveTextContent('Full CV')
    expect(screen.getByTestId('has-options')).toHaveTextContent('true')
  })

  it('should provide KonamiContext', () => {
    function KonamiConsumer() {
      const { isUnlocked, progress } = useKonami()
      return (
        <div>
          <span data-testid="unlocked">{String(isUnlocked)}</span>
          <span data-testid="progress">{progress}</span>
        </div>
      )
    }
    
    render(
      <AppProviders>
        <KonamiConsumer />
      </AppProviders>
    )
    
    expect(screen.getByTestId('unlocked')).toHaveTextContent('false')
    expect(screen.getByTestId('progress')).toHaveTextContent('0')
  })

  it('should provide PWAContext', () => {
    function PWAConsumer() {
      const { isOffline, isInstalled, hasUpdate } = usePWA()
      return (
        <div>
          <span data-testid="offline">{String(isOffline)}</span>
          <span data-testid="installed">{String(isInstalled)}</span>
          <span data-testid="has-update">{String(hasUpdate)}</span>
        </div>
      )
    }
    
    render(
      <AppProviders>
        <PWAConsumer />
      </AppProviders>
    )
    
    expect(screen.getByTestId('offline')).toHaveTextContent('false')
    expect(screen.getByTestId('installed')).toHaveTextContent('false')
    expect(screen.getByTestId('has-update')).toHaveTextContent('false')
  })

  it('should provide AccessibilityContext', () => {
    function AccessibilityConsumer() {
      const { fontSize, highContrast, dyslexiaFont, reducedMotion } = useAccessibility()
      return (
        <div>
          <span data-testid="font-size">{fontSize}</span>
          <span data-testid="high-contrast">{String(highContrast)}</span>
          <span data-testid="dyslexia-font">{String(dyslexiaFont)}</span>
          <span data-testid="reduced-motion">{String(reducedMotion)}</span>
        </div>
      )
    }
    
    render(
      <AppProviders>
        <AccessibilityConsumer />
      </AppProviders>
    )
    
    expect(screen.getByTestId('font-size')).toHaveTextContent('100')
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('false')
    expect(screen.getByTestId('dyslexia-font')).toHaveTextContent('false')
  })

  it('should provide useTranslation hook', () => {
    function TranslationConsumer() {
      const t = useTranslation()
      return <span data-testid="section-title">{t.sections.education}</span>
    }
    
    render(
      <AppProviders>
        <TranslationConsumer />
      </AppProviders>
    )
    
    expect(screen.getByTestId('section-title')).toHaveTextContent('Education')
  })

  it('should load German data when language is set via URL', async () => {
    // Set German language via URL
    const url = new URL(window.location.href)
    url.searchParams.set('lang', 'de')
    window.history.replaceState({}, '', url.toString())
    
    function TranslationConsumer() {
      const t = useTranslation()
      const { language } = useLanguage()
      return (
        <div>
          <span data-testid="language">{language}</span>
          <span data-testid="section-title">{t.sections.education}</span>
        </div>
      )
    }
    
    render(
      <AppProviders>
        <TranslationConsumer />
      </AppProviders>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('de')
      expect(screen.getByTestId('section-title')).toHaveTextContent('Ausbildung')
    })
  })

  it('should apply RTL for Persian', async () => {
    // Set Persian language via URL
    const url = new URL(window.location.href)
    url.searchParams.set('lang', 'fa')
    window.history.replaceState({}, '', url.toString())
    
    function RTLConsumer() {
      const { language, isRTL } = useLanguage()
      return (
        <div>
          <span data-testid="language">{language}</span>
          <span data-testid="is-rtl">{String(isRTL)}</span>
        </div>
      )
    }
    
    render(
      <AppProviders>
        <RTLConsumer />
      </AppProviders>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('fa')
      expect(screen.getByTestId('is-rtl')).toHaveTextContent('true')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    })
  })
})
