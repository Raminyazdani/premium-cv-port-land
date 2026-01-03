/**
 * Language Switching Integration Tests - Issue 12
 * 
 * Focused integration tests for the language switching pipeline:
 * - Language context state updates
 * - HTML lang/dir attribute updates
 * - localStorage persistence
 * - URL parameter detection
 * - RTL safety for Persian
 * 
 * These tests are designed to be fast and deterministic.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, waitFor, act } from '@testing-library/react'
import { LanguageProvider, useLanguage, LANGUAGE_METADATA, getAvailableLanguages } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import type { Language } from '@/utils/dataNormalizer'
import React from 'react'

// ============================================================================
// HELPER: Test Component for accessing language context
// ============================================================================

function TestLanguageConsumer({ onMount }: { onMount?: (api: { language: Language; setLanguage: (lang: Language) => void; isRTL: boolean }) => void }) {
  const { language, setLanguage, isRTL } = useLanguage()
  
  React.useEffect(() => {
    if (onMount) {
      onMount({ language, setLanguage, isRTL })
    }
  }, [language, setLanguage, isRTL, onMount])
  
  return (
    <div data-testid="language-info" data-language={language} data-rtl={String(isRTL)}>
      {language}
    </div>
  )
}

// ============================================================================
// B) INTEGRATION TESTS - Language Switching
// ============================================================================

describe('Language Switching Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
    window.history.replaceState({}, '', '/')
  })

  describe('context state updates', () => {
    it('initializes with default language (en) when no preference set', async () => {
      let capturedApi: { language: Language; isRTL: boolean } | null = null
      
      render(
        <LanguageProvider>
          <CVDataProvider>
            <TestLanguageConsumer onMount={(api) => { capturedApi = api }} />
          </CVDataProvider>
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedApi).not.toBeNull()
        expect(capturedApi!.language).toBe('en')
        expect(capturedApi!.isRTL).toBe(false)
      })
    })

    it('updates context state when setLanguage is called', async () => {
      let capturedSetLanguage: ((lang: Language) => void) | null = null
      let capturedLanguage: Language = 'en'
      
      const TestComponent = () => {
        const { language, setLanguage } = useLanguage()
        capturedSetLanguage = setLanguage
        capturedLanguage = language
        return <div>{language}</div>
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedSetLanguage).not.toBeNull()
      })
      
      // Switch to German
      act(() => {
        capturedSetLanguage!('de')
      })
      
      await waitFor(() => {
        expect(capturedLanguage).toBe('de')
      })
      
      // Switch to Persian
      act(() => {
        capturedSetLanguage!('fa')
      })
      
      await waitFor(() => {
        expect(capturedLanguage).toBe('fa')
      })
    })

    it('updates isRTL flag correctly for each language', async () => {
      let capturedApi: { language: Language; setLanguage: (lang: Language) => void; isRTL: boolean } | null = null
      
      const TestComponent = () => {
        const api = useLanguage()
        capturedApi = api
        return <div>{api.language}</div>
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedApi).not.toBeNull()
      })
      
      // English: LTR
      expect(capturedApi!.isRTL).toBe(false)
      
      // German: LTR
      act(() => { capturedApi!.setLanguage('de') })
      await waitFor(() => {
        expect(capturedApi!.isRTL).toBe(false)
      })
      
      // Persian: RTL
      act(() => { capturedApi!.setLanguage('fa') })
      await waitFor(() => {
        expect(capturedApi!.isRTL).toBe(true)
      })
      
      // Back to English: LTR
      act(() => { capturedApi!.setLanguage('en') })
      await waitFor(() => {
        expect(capturedApi!.isRTL).toBe(false)
      })
    })
  })

  describe('HTML lang attribute updates', () => {
    it('sets html lang="en" for English', async () => {
      render(
        <LanguageProvider>
          <div>Test</div>
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('lang')).toBe('en')
      })
    })

    it('sets html lang="de" for German', async () => {
      localStorage.setItem('cv-language', 'de')
      
      render(
        <LanguageProvider>
          <div>Test</div>
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('lang')).toBe('de')
      })
    })

    it('sets html lang="fa" for Persian', async () => {
      localStorage.setItem('cv-language', 'fa')
      
      render(
        <LanguageProvider>
          <div>Test</div>
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('lang')).toBe('fa')
      })
    })

    it('updates lang attribute when language changes', async () => {
      let setLang: ((lang: Language) => void) | null = null
      
      const TestComponent = () => {
        const { setLanguage } = useLanguage()
        setLang = setLanguage
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('lang')).toBe('en')
      })
      
      act(() => { setLang!('de') })
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('lang')).toBe('de')
      })
      
      act(() => { setLang!('fa') })
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('lang')).toBe('fa')
      })
    })
  })

  describe('HTML dir attribute updates', () => {
    it('sets dir="ltr" for English', async () => {
      render(
        <LanguageProvider>
          <div>Test</div>
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      })
    })

    it('sets dir="ltr" for German', async () => {
      localStorage.setItem('cv-language', 'de')
      
      render(
        <LanguageProvider>
          <div>Test</div>
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      })
    })

    it('sets dir="rtl" for Persian', async () => {
      localStorage.setItem('cv-language', 'fa')
      
      render(
        <LanguageProvider>
          <div>Test</div>
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })

    it('toggles dir attribute correctly when switching languages', async () => {
      let setLang: ((lang: Language) => void) | null = null
      
      const TestComponent = () => {
        const { setLanguage } = useLanguage()
        setLang = setLanguage
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      // Start with LTR (English)
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
      
      // Back to RTL (Persian)
      act(() => { setLang!('fa') })
      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
      
      // Back to LTR (English)
      act(() => { setLang!('en') })
      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      })
    })
  })

  describe('localStorage persistence', () => {
    it('persists language selection to localStorage', async () => {
      let setLang: ((lang: Language) => void) | null = null
      
      const TestComponent = () => {
        const { setLanguage } = useLanguage()
        setLang = setLanguage
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(setLang).not.toBeNull()
      })
      
      act(() => { setLang!('de') })
      
      await waitFor(() => {
        expect(localStorage.getItem('cv-language')).toBe('de')
      })
    })

    it('reads language from localStorage on init', async () => {
      localStorage.setItem('cv-language', 'fa')
      
      let capturedLang: Language = 'en'
      
      const TestComponent = () => {
        const { language } = useLanguage()
        capturedLang = language
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedLang).toBe('fa')
      })
    })

    it('ignores invalid localStorage value and defaults to en', async () => {
      localStorage.setItem('cv-language', 'invalid-lang')
      
      let capturedLang: Language = 'de'  // Initialize with non-default
      
      const TestComponent = () => {
        const { language } = useLanguage()
        capturedLang = language
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedLang).toBe('en')
      })
    })
  })

  describe('URL parameter detection', () => {
    it('reads language from URL parameter on init', async () => {
      window.history.replaceState({}, '', '?lang=de')
      
      let capturedLang: Language = 'en'
      
      const TestComponent = () => {
        const { language } = useLanguage()
        capturedLang = language
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedLang).toBe('de')
      })
    })

    it('URL parameter takes priority over localStorage', async () => {
      localStorage.setItem('cv-language', 'de')
      window.history.replaceState({}, '', '?lang=fa')
      
      let capturedLang: Language = 'en'
      
      const TestComponent = () => {
        const { language } = useLanguage()
        capturedLang = language
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedLang).toBe('fa')
      })
    })

    it('ignores invalid URL parameter and checks localStorage', async () => {
      localStorage.setItem('cv-language', 'de')
      window.history.replaceState({}, '', '?lang=invalid')
      
      let capturedLang: Language = 'en'
      
      const TestComponent = () => {
        const { language } = useLanguage()
        capturedLang = language
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedLang).toBe('de')
      })
    })

    it('updates URL when language changes', async () => {
      let setLang: ((lang: Language) => void) | null = null
      
      const TestComponent = () => {
        const { setLanguage } = useLanguage()
        setLang = setLanguage
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(setLang).not.toBeNull()
      })
      
      act(() => { setLang!('fa') })
      
      await waitFor(() => {
        expect(window.location.search).toContain('lang=fa')
      })
    })
  })

  describe('unsupported language handling', () => {
    it('defaults to en when setLanguage is called with unsupported language', async () => {
      let capturedApi: { language: Language; setLanguage: (lang: Language) => void } | null = null
      
      const TestComponent = () => {
        const api = useLanguage()
        capturedApi = api
        return null
      }
      
      // Suppress console.warn for this test
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      await waitFor(() => {
        expect(capturedApi).not.toBeNull()
      })
      
      // Try to set an unsupported language
      act(() => {
        // @ts-expect-error testing invalid input
        capturedApi!.setLanguage('xyz')
      })
      
      await waitFor(() => {
        expect(capturedApi!.language).toBe('en')
      })
      
      warnSpy.mockRestore()
    })
  })
})

// ============================================================================
// RTL SAFETY TESTS
// ============================================================================

describe('RTL Safety Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
    window.history.replaceState({}, '', '/')
  })

  describe('LANGUAGE_METADATA configuration', () => {
    it('defines correct direction for English (ltr)', () => {
      expect(LANGUAGE_METADATA['en']).toBeDefined()
      expect(LANGUAGE_METADATA['en'].direction).toBe('ltr')
    })

    it('defines correct direction for German (ltr)', () => {
      expect(LANGUAGE_METADATA['de']).toBeDefined()
      expect(LANGUAGE_METADATA['de'].direction).toBe('ltr')
    })

    it('defines correct direction for Persian (rtl)', () => {
      expect(LANGUAGE_METADATA['fa']).toBeDefined()
      expect(LANGUAGE_METADATA['fa'].direction).toBe('rtl')
    })

    it('includes display names for all languages', () => {
      expect(LANGUAGE_METADATA['en'].displayName).toBe('English')
      expect(LANGUAGE_METADATA['de'].displayName).toBe('Deutsch')
      expect(LANGUAGE_METADATA['fa'].displayName).toBe('فارسی')
    })
  })

  describe('getAvailableLanguages()', () => {
    it('returns all supported languages', () => {
      const languages = getAvailableLanguages()
      
      expect(languages.length).toBe(3)
      
      const codes = languages.map(l => l.code)
      expect(codes).toContain('en')
      expect(codes).toContain('de')
      expect(codes).toContain('fa')
    })

    it('includes direction info for each language', () => {
      const languages = getAvailableLanguages()
      
      const enLang = languages.find(l => l.code === 'en')
      const deLang = languages.find(l => l.code === 'de')
      const faLang = languages.find(l => l.code === 'fa')
      
      expect(enLang?.direction).toBe('ltr')
      expect(deLang?.direction).toBe('ltr')
      expect(faLang?.direction).toBe('rtl')
    })
  })

  describe('direction toggle integrity', () => {
    it('only Persian should have RTL direction', () => {
      // Verify that only fa has RTL
      const rtlLanguages = Object.entries(LANGUAGE_METADATA)
        .filter(([, meta]) => meta.direction === 'rtl')
        .map(([code]) => code)
      
      expect(rtlLanguages).toEqual(['fa'])
    })

    it('EN and DE should have LTR direction', () => {
      const ltrLanguages = Object.entries(LANGUAGE_METADATA)
        .filter(([, meta]) => meta.direction === 'ltr')
        .map(([code]) => code)
      
      expect(ltrLanguages).toContain('en')
      expect(ltrLanguages).toContain('de')
    })
  })

  describe('DOM direction application', () => {
    it('applies rtl direction to document when Persian is active', async () => {
      window.history.replaceState({}, '', '?lang=fa')
      
      render(
        <LanguageProvider>
          <div>Test</div>
        </LanguageProvider>
      )
      
      await waitFor(() => {
        const dir = document.documentElement.getAttribute('dir')
        expect(dir).toBe('rtl')
      })
    })

    it('maintains ltr direction after switching from fa to de', async () => {
      localStorage.setItem('cv-language', 'fa')
      
      let setLang: ((lang: Language) => void) | null = null
      
      const TestComponent = () => {
        const { setLanguage } = useLanguage()
        setLang = setLanguage
        return null
      }
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      )
      
      // Start with RTL (Persian)
      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
      
      // Switch to German (LTR)
      act(() => { setLang!('de') })
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      })
    })
  })
})

// ============================================================================
// LANGUAGE DETECTION PRIORITY TESTS
// ============================================================================

describe('Language Detection Priority', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
    window.history.replaceState({}, '', '/')
  })

  it('priority 1: URL parameter takes highest priority', async () => {
    localStorage.setItem('cv-language', 'de')
    window.history.replaceState({}, '', '?lang=fa')
    
    // Mock browser language
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true })
    
    let capturedLang: Language = 'en'
    
    const TestComponent = () => {
      const { language } = useLanguage()
      capturedLang = language
      return null
    }
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(capturedLang).toBe('fa')
    })
  })

  it('priority 2: localStorage when no URL parameter', async () => {
    localStorage.setItem('cv-language', 'de')
    // No URL parameter
    
    let capturedLang: Language = 'en'
    
    const TestComponent = () => {
      const { language } = useLanguage()
      capturedLang = language
      return null
    }
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(capturedLang).toBe('de')
    })
  })

  it('priority 3: browser language when no URL or localStorage', async () => {
    // No localStorage set
    // No URL parameter
    
    // Mock German browser language
    Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true })
    
    let capturedLang: Language = 'en'
    
    const TestComponent = () => {
      const { language } = useLanguage()
      capturedLang = language
      return null
    }
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(capturedLang).toBe('de')
    })
  })

  it('priority 4: defaults to English when nothing matches', async () => {
    // No localStorage
    // No URL parameter
    // Mock unsupported browser language
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    
    let capturedLang: Language = 'de'  // Initialize with non-default
    
    const TestComponent = () => {
      const { language } = useLanguage()
      capturedLang = language
      return null
    }
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )
    
    await waitFor(() => {
      expect(capturedLang).toBe('en')
    })
  })
})
