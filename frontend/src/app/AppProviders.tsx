/**
 * AppProviders: Consolidated provider wrapper for the application
 *
 * This component encapsulates all React context providers in the correct order,
 * reducing deep nesting in App.tsx and standardizing provider initialization.
 *
 * ## Provider Ordering Rationale:
 *
 * 1. **LanguageProvider** (outermost)
 *    - Must be first because CVDataProvider depends on the current language
 *    - Provides language state, RTL detection, and i18n utilities
 *
 * 2. **CVDataProvider**
 *    - Depends on LanguageProvider for loading language-specific CV data
 *    - Must come before FilterProvider which filters CV data
 *
 * 3. **FilterProvider**
 *    - Depends on CV data being available for focus area extraction
 *    - Used by many UI components for filtering displayed entries
 *
 * 4. **EmptySectionsProvider**
 *    - Controls whether empty sections are hidden or show empty states
 *    - Used by SectionWrapper for consistent empty state behavior
 *
 * 5. **KonamiProvider**
 *    - Easter egg feature, no strict dependencies
 *    - Provides Konami code unlock state for UI effects
 *
 * 6. **PWAProvider**
 *    - Progressive Web App features (install prompt, offline status)
 *    - Independent of other providers
 *
 * 7. **AccessibilityProvider**
 *    - Manages a11y preferences (font size, high contrast, reduced motion)
 *    - Contains ARIA live regions for announcements
 *
 * 8. **SoundEffectsProvider**
 *    - Optional sound feedback system
 *    - Independent, but should be near the end as it's an enhancement
 *
 * 9. **MicroFeedbackProvider** (innermost)
 *    - Visual feedback animations for user interactions
 *    - Should be last as it renders overlay elements
 *
 * @example
 * // In App.tsx:
 * function App() {
 *   return (
 *     <ErrorBoundary FallbackComponent={ErrorFallback}>
 *       <AppProviders>
 *         <AppContent />
 *       </AppProviders>
 *     </ErrorBoundary>
 *   )
 * }
 */

import { ReactNode } from 'react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { EmptySectionsProvider } from '@/context/EmptySectionsContext'
import { KonamiProvider } from '@/context/KonamiContext'
import { PWAProvider } from '@/context/PWAContext'
import { AccessibilityProvider } from '@/context/AccessibilityContext'
import { SoundEffectsProvider } from '@/components/SoundEffects'
import { MicroFeedbackProvider } from '@/components/MicroFeedback'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Consolidated provider wrapper that composes all application providers
 * in the correct dependency order.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <CVDataProvider>
        <FilterProvider>
          <EmptySectionsProvider>
            <KonamiProvider>
              <PWAProvider>
                <AccessibilityProvider>
                  <SoundEffectsProvider>
                    <MicroFeedbackProvider>
                      {children}
                    </MicroFeedbackProvider>
                  </SoundEffectsProvider>
                </AccessibilityProvider>
              </PWAProvider>
            </KonamiProvider>
          </EmptySectionsProvider>
        </FilterProvider>
      </CVDataProvider>
    </LanguageProvider>
  )
}
