/**
 * Pseudo-localization Tests
 * 
 * Tests for the pseudo-localization utility that helps
 * detect untranslated text and layout issues.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  pseudoLocalize,
  isPseudoLocEnabled,
  pseudoLocalizeObject,
  setPseudoLocEnabled,
} from '@/utils/pseudoLocalization'

describe('Pseudo-localization', () => {
  // Save and restore localStorage
  let originalStorage: Storage

  beforeEach(() => {
    // Mock localStorage
    originalStorage = global.localStorage
    const mockStorage: Record<string, string> = {}
    global.localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value },
      removeItem: (key: string) => { delete mockStorage[key] },
      clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) },
      length: 0,
      key: () => null,
    }
  })

  afterEach(() => {
    global.localStorage = originalStorage
    vi.restoreAllMocks()
  })

  describe('pseudoLocalize', () => {
    it('should transform simple text with markers', () => {
      const result = pseudoLocalize('Hello')
      
      // Should have prefix and suffix markers
      expect(result).toMatch(/^\[!!! .*!!!]$/)
      
      // Should not be the original text
      expect(result).not.toBe('Hello')
    })

    it('should transform characters to accented versions', () => {
      const result = pseudoLocalize('ABC', { expand: false })
      
      // Should contain transformed characters
      expect(result).toContain('Ȧ') // A -> Ȧ
      expect(result).toContain('Ɓ') // B -> Ɓ
      expect(result).toContain('Ƈ') // C -> Ƈ
    })

    it('should add length expansion by default', () => {
      const original = 'Hello World'
      const result = pseudoLocalize(original, { markers: false, transform: false })
      
      // Should be longer than original (30% expansion)
      expect(result.length).toBeGreaterThan(original.length)
      // Expansion is ~30% of original length
      expect(result).toContain('~')
    })

    it('should preserve placeholders like {count}', () => {
      const result = pseudoLocalize('Found {count} items', { expand: false, markers: false })
      
      // Placeholder should be preserved
      expect(result).toContain('{count}')
    })

    it('should skip URLs', () => {
      const url = 'https://example.com/path'
      const result = pseudoLocalize(url)
      
      // URLs should not be transformed
      expect(result).toBe(url)
    })

    it('should skip paths', () => {
      const path = '/api/users/123'
      const result = pseudoLocalize(path)
      
      // Paths should not be transformed
      expect(result).toBe(path)
    })

    it('should handle empty strings', () => {
      expect(pseudoLocalize('')).toBe('')
    })

    it('should handle null/undefined', () => {
      expect(pseudoLocalize(null as unknown as string)).toBe(null)
      expect(pseudoLocalize(undefined as unknown as string)).toBe(undefined)
    })

    it('should respect options', () => {
      const result = pseudoLocalize('Test', {
        expand: false,
        markers: false,
        transform: false,
      })
      
      // With all options disabled, should be original text
      expect(result).toBe('Test')
    })
  })

  describe('pseudoLocalizeObject', () => {
    it('should transform all string values in an object', () => {
      const input = {
        title: 'Hello',
        description: 'World',
      }
      
      const result = pseudoLocalizeObject(input)
      
      // All string values should be transformed
      expect(result.title).not.toBe('Hello')
      expect(result.description).not.toBe('World')
      expect(result.title).toMatch(/^\[!!!/)
      expect(result.description).toMatch(/^\[!!!/)
    })

    it('should handle nested objects', () => {
      const input = {
        section: {
          title: 'Hello',
          content: {
            text: 'World',
          },
        },
      }
      
      const result = pseudoLocalizeObject(input)
      
      expect(result.section.title).toMatch(/^\[!!!/)
      expect(result.section.content.text).toMatch(/^\[!!!/)
    })

    it('should handle arrays', () => {
      const input = {
        items: ['Hello', 'World'],
      }
      
      const result = pseudoLocalizeObject(input)
      
      expect(result.items[0]).toMatch(/^\[!!!/)
      expect(result.items[1]).toMatch(/^\[!!!/)
    })

    it('should preserve non-string values', () => {
      const input = {
        count: 42,
        enabled: true,
        items: null,
      }
      
      const result = pseudoLocalizeObject(input)
      
      expect(result.count).toBe(42)
      expect(result.enabled).toBe(true)
      expect(result.items).toBeNull()
    })
  })

  describe('isPseudoLocEnabled', () => {
    it('should return false by default', () => {
      expect(isPseudoLocEnabled()).toBe(false)
    })

    it('should detect localStorage preference', () => {
      localStorage.setItem('pseudo-loc', 'true')
      expect(isPseudoLocEnabled()).toBe(true)
    })
  })

  describe('setPseudoLocEnabled', () => {
    it('should enable pseudo-loc via localStorage', () => {
      setPseudoLocEnabled(true)
      expect(localStorage.getItem('pseudo-loc')).toBe('true')
    })

    it('should disable pseudo-loc via localStorage', () => {
      localStorage.setItem('pseudo-loc', 'true')
      setPseudoLocEnabled(false)
      expect(localStorage.getItem('pseudo-loc')).toBeNull()
    })
  })
})

describe('Pseudo-localization UI Integration', () => {
  it('should make translated text visually distinct', () => {
    // Example UI strings
    const uiStrings = {
      button: {
        save: 'Save',
        cancel: 'Cancel',
      },
      labels: {
        email: 'Email Address',
        password: 'Password',
      },
    }
    
    const pseudoUI = pseudoLocalizeObject(uiStrings)
    
    // All strings should be marked
    expect(pseudoUI.button.save).toContain('[!!!')
    expect(pseudoUI.button.cancel).toContain('[!!!')
    expect(pseudoUI.labels.email).toContain('[!!!')
    expect(pseudoUI.labels.password).toContain('[!!!')
    
    // Each string should be expanded (longer than original)
    expect(pseudoUI.button.save.length).toBeGreaterThan('Save'.length + 10)
    expect(pseudoUI.labels.email.length).toBeGreaterThan('Email Address'.length + 10)
  })

  it('should help identify untranslated content', () => {
    // Simulate mixed content (some translated, some hardcoded)
    const mixedContent = {
      translated: pseudoLocalize('Welcome'),
      hardcoded: 'Welcome', // Oops, missed this one!
    }
    
    // Can easily identify hardcoded string by lack of markers
    expect(mixedContent.translated).toMatch(/^\[!!!/)
    expect(mixedContent.hardcoded).not.toMatch(/^\[!!!/)
    
    // In a real app, this makes it obvious in the UI
    // which strings are from the i18n system vs hardcoded
  })
})
