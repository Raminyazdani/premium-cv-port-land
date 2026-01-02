/**
 * Test Utilities
 *
 * Provides helper functions for testing components with React context providers.
 * This centralizes provider setup and ensures tests use consistent configuration.
 *
 * @example
 * // Basic usage:
 * import { renderWithProviders } from '../test-utils'
 * const { getByText } = renderWithProviders(<MyComponent />)
 *
 * @example
 * // With specific language:
 * renderWithProviders(<MyComponent />, { language: 'de' })
 *
 * @example
 * // With custom renderOptions:
 * renderWithProviders(<MyComponent />, { language: 'fa' }, { container: customContainer })
 */

import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { KonamiProvider } from '@/context/KonamiContext'
import { PWAProvider } from '@/context/PWAContext'
import { AccessibilityProvider } from '@/context/AccessibilityContext'
import { SoundEffectsProvider } from '@/components/SoundEffects'
import { MicroFeedbackProvider } from '@/components/MicroFeedback'
import type { Language } from '@/utils/dataNormalizer'

/**
 * Options for configuring the test providers
 */
interface ProviderOptions {
  /**
   * Initial language for the LanguageProvider.
   * This will be set via URL parameter before rendering.
   * @default 'en'
   */
  language?: Language
}

/**
 * Creates a wrapper component with all application providers.
 * Uses the same provider ordering as AppProviders for consistency.
 */
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CVDataProvider>
        <FilterProvider>
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
        </FilterProvider>
      </CVDataProvider>
    </LanguageProvider>
  )
}

/**
 * Creates a minimal wrapper with only essential providers.
 * Use this for tests that don't need all providers (faster execution).
 */
function MinimalProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CVDataProvider>
        <FilterProvider>
          {children}
        </FilterProvider>
      </CVDataProvider>
    </LanguageProvider>
  )
}

/**
 * Renders a component wrapped in all application providers.
 *
 * This function sets up the language via URL parameter before rendering,
 * ensuring the LanguageProvider detects the correct initial language.
 *
 * @param ui - The React element to render
 * @param providerOptions - Options for configuring providers (e.g., language)
 * @param renderOptions - Additional options passed to @testing-library/react render
 * @returns The render result from @testing-library/react
 *
 * @example
 * // Test with default English:
 * const { getByText } = renderWithProviders(<EducationSection />)
 *
 * @example
 * // Test with German:
 * const { getByText } = renderWithProviders(<EducationSection />, { language: 'de' })
 *
 * @example
 * // Test with Persian (RTL):
 * const { container } = renderWithProviders(<EducationSection />, { language: 'fa' })
 * expect(document.documentElement.getAttribute('dir')).toBe('rtl')
 */
export function renderWithProviders(
  ui: ReactElement,
  providerOptions: ProviderOptions = {},
  renderOptions?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  const { language = 'en' } = providerOptions

  // Set language via URL parameter before rendering
  // This ensures LanguageProvider detects the correct initial language
  const url = new URL(window.location.href)
  url.searchParams.set('lang', language)
  window.history.replaceState({}, '', url.toString())

  return render(ui, {
    wrapper: AllProviders,
    ...renderOptions,
  })
}

/**
 * Renders a component with minimal providers (Language, CVData, Filter only).
 * Use this for simpler tests that don't need PWA, Accessibility, Sound, etc.
 *
 * @param ui - The React element to render
 * @param providerOptions - Options for configuring providers (e.g., language)
 * @param renderOptions - Additional options passed to @testing-library/react render
 * @returns The render result from @testing-library/react
 */
export function renderWithMinimalProviders(
  ui: ReactElement,
  providerOptions: ProviderOptions = {},
  renderOptions?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  const { language = 'en' } = providerOptions

  // Set language via URL parameter
  const url = new URL(window.location.href)
  url.searchParams.set('lang', language)
  window.history.replaceState({}, '', url.toString())

  return render(ui, {
    wrapper: MinimalProviders,
    ...renderOptions,
  })
}

/**
 * Creates a custom wrapper component for use with renderHook or custom render setups.
 * Useful when you need to compose additional providers around the standard ones.
 *
 * @param language - The language to set via URL parameter
 * @returns A wrapper component that provides all application context
 *
 * @example
 * import { renderHook } from '@testing-library/react'
 * import { createWrapper } from '../test-utils'
 *
 * const { result } = renderHook(
 *   () => useMyHook(),
 *   { wrapper: createWrapper('de') }
 * )
 */
export function createWrapper(language: Language = 'en') {
  // Set language via URL parameter
  const url = new URL(window.location.href)
  url.searchParams.set('lang', language)
  window.history.replaceState({}, '', url.toString())

  return AllProviders
}

// Re-export everything from @testing-library/react for convenience
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
