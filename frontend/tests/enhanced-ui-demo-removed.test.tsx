import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { KonamiProvider } from '@/context/KonamiContext'
import { PWAProvider } from '@/context/PWAContext'
import { AccessibilityProvider } from '@/context/AccessibilityContext'
import { MicroFeedbackProvider } from '@/components/MicroFeedback'
import { SoundEffectsProvider } from '@/components/SoundEffects'
import App from '@/App'

function renderApp(lang: 'en' | 'de' | 'fa' = 'en') {
  return render(
    <LanguageProvider initialLang={lang}>
      <CVDataProvider>
        <FilterProvider>
          <KonamiProvider>
            <PWAProvider>
              <AccessibilityProvider>
                <SoundEffectsProvider>
                  <MicroFeedbackProvider>
                    <App />
                  </MicroFeedbackProvider>
                </SoundEffectsProvider>
              </AccessibilityProvider>
            </PWAProvider>
          </KonamiProvider>
        </FilterProvider>
      </CVDataProvider>
    </LanguageProvider>
  )
}

describe('EnhancedUIDemo Section Removal', () => {
  describe('EnhancedUIDemo is not rendered', () => {
    it('should not show "Premium Interactive Components" text (EN)', () => {
      renderApp('en')
      expect(screen.queryByText('Premium Interactive Components')).not.toBeInTheDocument()
    })

    it('should not show "3D Language Carousel" text (EN)', () => {
      renderApp('en')
      expect(screen.queryByText('3D Language Carousel')).not.toBeInTheDocument()
    })

    it('should not show "Animated Timeline" text (EN)', () => {
      renderApp('en')
      expect(screen.queryByText('Animated Timeline')).not.toBeInTheDocument()
    })

    it('should not show "Enhanced UI Features" badge (EN)', () => {
      renderApp('en')
      expect(screen.queryByText('Enhanced UI Features')).not.toBeInTheDocument()
    })
  })

  describe('EnhancedUIDemo is not rendered in German', () => {
    it('should not show demo section content (DE)', () => {
      renderApp('de')
      expect(screen.queryByText('Premium Interactive Components')).not.toBeInTheDocument()
      expect(screen.queryByText('3D Language Carousel')).not.toBeInTheDocument()
    })
  })

  describe('EnhancedUIDemo is not rendered in Persian', () => {
    it('should not show demo section content (FA)', () => {
      renderApp('fa')
      expect(screen.queryByText('Premium Interactive Components')).not.toBeInTheDocument()
      expect(screen.queryByText('3D Language Carousel')).not.toBeInTheDocument()
    })
  })
})
