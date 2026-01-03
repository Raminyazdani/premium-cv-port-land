/**
 * Language Context Split Tests - Issue 17
 * 
 * Tests for the modular language context system:
 * - LanguageStateContext: Core language state and persistence
 * - DirectionContext: RTL/LTR detection and DOM updates
 * - TranslationContext: UI translations
 * - FormatterContext: Locale-aware formatting
 * 
 * These tests verify that the split SRP-compliant contexts
 * maintain the same behavior as the original monolithic context.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, waitFor, act } from '@testing-library/react'
import React from 'react'

// Import from modular language system
import {
  LanguageStateProvider,
  useLanguageState,
  DirectionProvider,
  useDirection,
  LanguageProviders,
  LANGUAGE_METADATA,
  SUPPORTED_LANGUAGES,
  getAvailableLanguages,
  getLanguageDirection,
  isLanguageRTL
} from '@/context/language'

// Import from backward-compatible wrapper
import {
  LanguageProvider,
  useLanguage,
  useTranslation,
  useFormatters
} from '@/context/LanguageContext'

import type { Language } from '@/utils/dataNormalizer'

// ============================================================================
// Helper Components
// ============================================================================

function LanguageStateConsumer({ 
  onMount 
}: { 
  onMount?: (api: { language: Language; setLanguage: (lang: Language) => void }) => void 
}) {
  const api = useLanguageState()
  
  React.useEffect(() => {
    if (onMount) {
      onMount(api)
    }
  }, [api, onMount])
  
  return <div data-testid="language">{api.language}</div>
}

function DirectionConsumer({ onMount }: { onMount?: (api: { isRTL: boolean; direction: 'ltr' | 'rtl' }) => void }) {
  const api = useDirection()
  
  React.useEffect(() => {
    if (onMount) {
      onMount(api)
    }
  }, [api, onMount])
  
  return <div data-testid="direction" data-rtl={String(api.isRTL)}>{api.direction}</div>
}

function CombinedConsumer({ 
  onMount 
}: { 
  onMount?: (api: { language: Language; setLanguage: (lang: Language) => void; isRTL: boolean }) => void 
}) {
  const api = useLanguage()
  
  React.useEffect(() => {
    if (onMount) {
      onMount(api)
    }
  }, [api, onMount])
  
  return <div data-testid="combined">{api.language}</div>
}

// ============================================================================
// A) Language Configuration Tests
// ============================================================================

describe('Language Configuration', () => {
  it('should have correct metadata for all languages', () => {
    expect(LANGUAGE_METADATA['en']).toEqual({ displayName: 'English', direction: 'ltr' })
    expect(LANGUAGE_METADATA['de']).toEqual({ displayName: 'Deutsch', direction: 'ltr' })
    expect(LANGUAGE_METADATA['fa']).toEqual({ displayName: 'فارسی', direction: 'rtl' })
  })

  it('should have correct supported languages', () => {
    expect(SUPPORTED_LANGUAGES).toContain('en')
    expect(SUPPORTED_LANGUAGES).toContain('de')
    expect(SUPPORTED_LANGUAGES).toContain('fa')
    expect(SUPPORTED_LANGUAGES).toHaveLength(3)
  })

  it('getAvailableLanguages should return all languages with metadata', () => {
    const languages = getAvailableLanguages()
    
    expect(languages).toHaveLength(3)
    
    const en = languages.find(l => l.code === 'en')
    expect(en).toEqual({ code: 'en', displayName: 'English', direction: 'ltr' })
    
    const fa = languages.find(l => l.code === 'fa')
    expect(fa).toEqual({ code: 'fa', displayName: 'فارسی', direction: 'rtl' })
  })

  it('getLanguageDirection should return correct direction', () => {
    expect(getLanguageDirection('en')).toBe('ltr')
    expect(getLanguageDirection('de')).toBe('ltr')
    expect(getLanguageDirection('fa')).toBe('rtl')
  })

  it('isLanguageRTL should return correct boolean', () => {
    expect(isLanguageRTL('en')).toBe(false)
    expect(isLanguageRTL('de')).toBe(false)
    expect(isLanguageRTL('fa')).toBe(true)
  })
})

// ============================================================================
// B) LanguageStateContext Tests
// ============================================================================

describe('LanguageStateContext', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('should provide language state', async () => {
    let capturedApi: { language: Language } | null = null
    
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <LanguageStateConsumer onMount={(api) => { capturedApi = api }} />
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(capturedApi).not.toBeNull()
      expect(capturedApi!.language).toBe('en')
    })
  })

  it('should update language when setLanguage is called', async () => {
    let capturedApi: { language: Language; setLanguage: (lang: Language) => void } | null = null
    
    const TestComponent = () => {
      const api = useLanguageState()
      capturedApi = api
      return <div>{api.language}</div>
    }
    
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <TestComponent />
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(capturedApi).not.toBeNull()
    })
    
    act(() => {
      capturedApi!.setLanguage('de')
    })
    
    await waitFor(() => {
      expect(capturedApi!.language).toBe('de')
    })
  })

  it('should persist language to localStorage', async () => {
    let setLang: ((lang: Language) => void) | null = null
    
    const TestComponent = () => {
      const { setLanguage } = useLanguageState()
      setLang = setLanguage
      return null
    }
    
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <TestComponent />
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(setLang).not.toBeNull()
    })
    
    act(() => {
      setLang!('fa')
    })
    
    await waitFor(() => {
      expect(localStorage.getItem('cv-language')).toBe('fa')
    })
  })

  it('should read language from URL parameter', async () => {
    window.history.replaceState({}, '', '?lang=de')
    
    let capturedLang: Language = 'en'
    
    const TestComponent = () => {
      const { language } = useLanguageState()
      capturedLang = language
      return null
    }
    
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <TestComponent />
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(capturedLang).toBe('de')
    })
  })

  it('should handle unsupported language gracefully', async () => {
    let capturedApi: { language: Language; setLanguage: (lang: Language) => void } | null = null
    
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const TestComponent = () => {
      const api = useLanguageState()
      capturedApi = api
      return null
    }
    
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <TestComponent />
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(capturedApi).not.toBeNull()
    })
    
    act(() => {
      // @ts-expect-error testing invalid input
      capturedApi!.setLanguage('invalid')
    })
    
    await waitFor(() => {
      expect(capturedApi!.language).toBe('en')
    })
    
    warnSpy.mockRestore()
  })
})

// ============================================================================
// C) DirectionContext Tests
// ============================================================================

describe('DirectionContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
    window.history.replaceState({}, '', '/')
  })

  it('should derive isRTL from language', async () => {
    let capturedDirection: { isRTL: boolean } | null = null
    
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <DirectionConsumer onMount={(api) => { capturedDirection = api }} />
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(capturedDirection).not.toBeNull()
      expect(capturedDirection!.isRTL).toBe(false) // English is LTR
    })
  })

  it('should update document lang attribute', async () => {
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <div>Test</div>
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('en')
    })
  })

  it('should update document dir attribute', async () => {
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <div>Test</div>
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    })
  })

  it('should set RTL for Persian', async () => {
    localStorage.setItem('cv-language', 'fa')
    
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <div>Test</div>
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('fa')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    })
  })

  it('should toggle direction when language changes', async () => {
    let setLang: ((lang: Language) => void) | null = null
    
    const TestComponent = () => {
      const { setLanguage } = useLanguageState()
      setLang = setLanguage
      return null
    }
    
    render(
      <LanguageStateProvider>
        <DirectionProvider>
          <TestComponent />
        </DirectionProvider>
      </LanguageStateProvider>
    )
    
    // Start with LTR
    await waitFor(() => {
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    })
    
    // Switch to RTL (Persian)
    act(() => { setLang!('fa') })
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    })
    
    // Back to LTR (German)
    act(() => { setLang!('de') })
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    })
  })
})

// ============================================================================
// D) Backward Compatibility Tests
// ============================================================================

describe('Backward Compatibility (LanguageContext wrapper)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
    window.history.replaceState({}, '', '/')
  })

  it('should provide language, setLanguage, and isRTL through useLanguage', async () => {
    let capturedApi: { language: Language; setLanguage: (lang: Language) => void; isRTL: boolean } | null = null
    
    render(
      <LanguageProvider>
        <CombinedConsumer onMount={(api) => { capturedApi = api }} />
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(capturedApi).not.toBeNull()
      expect(capturedApi!.language).toBe('en')
      expect(capturedApi!.isRTL).toBe(false)
      expect(typeof capturedApi!.setLanguage).toBe('function')
    })
  })

  it('should update document attributes when using LanguageProvider', async () => {
    render(
      <LanguageProvider>
        <div>Test</div>
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('en')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    })
  })

  it('should work with useTranslation hook', async () => {
    let translations: ReturnType<typeof useTranslation> | null = null
    
    const TestComponent = () => {
      translations = useTranslation()
      return null
    }
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(translations).not.toBeNull()
      expect(translations!.sections.education).toBe('Education')
    })
  })

  it('should work with useFormatters hook', async () => {
    let formatters: ReturnType<typeof useFormatters> | null = null
    
    const TestComponent = () => {
      formatters = useFormatters()
      return null
    }
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(formatters).not.toBeNull()
      expect(formatters!.language).toBe('en')
      expect(typeof formatters!.formatNumber).toBe('function')
      expect(typeof formatters!.formatDate).toBe('function')
    })
  })

  it('should update isRTL when switching to Persian through wrapper', async () => {
    let capturedApi: { language: Language; setLanguage: (lang: Language) => void; isRTL: boolean } | null = null
    
    const TestComponent = () => {
      const api = useLanguage()
      capturedApi = api
      return null
    }
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(capturedApi).not.toBeNull()
    })
    
    // Switch to Persian
    act(() => {
      capturedApi!.setLanguage('fa')
    })
    
    await waitFor(() => {
      expect(capturedApi!.language).toBe('fa')
      expect(capturedApi!.isRTL).toBe(true)
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    })
  })
})

// ============================================================================
// E) LanguageProviders Combined Tests
// ============================================================================

describe('LanguageProviders (combined provider)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
    window.history.replaceState({}, '', '/')
  })

  it('should compose LanguageStateProvider and DirectionProvider correctly', async () => {
    let languageApi: { language: Language } | null = null
    let directionApi: { isRTL: boolean } | null = null
    
    const TestComponent = () => {
      languageApi = useLanguageState()
      directionApi = useDirection()
      return null
    }
    
    render(
      <LanguageProviders>
        <TestComponent />
      </LanguageProviders>
    )
    
    await waitFor(() => {
      expect(languageApi).not.toBeNull()
      expect(directionApi).not.toBeNull()
      expect(languageApi!.language).toBe('en')
      expect(directionApi!.isRTL).toBe(false)
    })
  })

  it('should maintain consistency between state and direction', async () => {
    let languageApi: { language: Language; setLanguage: (lang: Language) => void } | null = null
    let directionApi: { isRTL: boolean; direction: 'ltr' | 'rtl' } | null = null
    
    const TestComponent = () => {
      languageApi = useLanguageState()
      directionApi = useDirection()
      return null
    }
    
    render(
      <LanguageProviders>
        <TestComponent />
      </LanguageProviders>
    )
    
    await waitFor(() => {
      expect(languageApi).not.toBeNull()
      expect(directionApi).not.toBeNull()
    })
    
    // English: LTR
    expect(directionApi!.isRTL).toBe(false)
    expect(directionApi!.direction).toBe('ltr')
    
    // Switch to Persian
    act(() => {
      languageApi!.setLanguage('fa')
    })
    
    await waitFor(() => {
      expect(languageApi!.language).toBe('fa')
      expect(directionApi!.isRTL).toBe(true)
      expect(directionApi!.direction).toBe('rtl')
    })
  })
})
