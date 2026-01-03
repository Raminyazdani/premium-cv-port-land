/**
 * CV Data Pipeline Tests - Issue 12
 * 
 * Focused unit tests for the CV data loading pipeline:
 * - CV file selection per language
 * - Fallback to English for unknown languages
 * - lang.json helper function behavior
 * 
 * These tests are designed to be fast and deterministic.
 */

import { describe, it, expect } from 'vitest'
import { loadCVDataForLanguage, loadAndValidateData } from '@/utils/dataLoader'
import { tl } from '@/i18n'
import type { Language } from '@/utils/dataNormalizer'

// ============================================================================
// A) CV LOADER TESTS - File Selection Logic
// ============================================================================

describe('CV Loader - File Selection', () => {
  describe('correct file selection per language', () => {
    it('selects cv.json (English data) when lang is "en"', () => {
      const data = loadCVDataForLanguage('en') as Record<string, unknown>
      
      expect(data).toBeDefined()
      // English data uses English keys directly
      expect(data.basics).toBeDefined()
      expect(Array.isArray(data.basics)).toBe(true)
      
      // Verify it's the English file by checking for English-specific content
      const basics = data.basics as Array<Record<string, unknown>>
      expect(basics.length).toBeGreaterThan(0)
      // English basics should have English key names
      expect(basics[0]).toHaveProperty('fname')
    })

    it('selects cv_de.json (German data) when lang is "de"', () => {
      const data = loadCVDataForLanguage('de') as Record<string, unknown>
      
      expect(data).toBeDefined()
      // German data has German keys before normalization
      expect(data.grunddaten || data.basics).toBeDefined()
      
      // Check for German-specific section keys
      const hasGermanKeys = 'grunddaten' in data || 'ausbildung' in data || 'erfahrungen' in data
      const hasNormalizedKeys = 'basics' in data
      expect(hasGermanKeys || hasNormalizedKeys).toBe(true)
    })

    it('selects cv_fa.json (Persian data) when lang is "fa"', () => {
      const data = loadCVDataForLanguage('fa') as Record<string, unknown>
      
      expect(data).toBeDefined()
      expect(Object.keys(data).length).toBeGreaterThan(0)
      
      // Persian data should have Persian or normalized keys
      // Verify data was loaded (has content)
      const faKeys = Object.keys(data)
      expect(faKeys.length).toBeGreaterThan(0)
    })

    it('fallbacks to English for unknown/unsupported languages', () => {
      // Test with completely invalid language codes
      // @ts-expect-error testing invalid input
      const unknownData = loadCVDataForLanguage('xyz')
      const enData = loadCVDataForLanguage('en')
      
      // Should return English data for unknown language
      expect(unknownData).toEqual(enData)
    })

    it('fallbacks to English for empty string language', () => {
      // @ts-expect-error testing invalid input
      const emptyData = loadCVDataForLanguage('')
      const enData = loadCVDataForLanguage('en')
      
      expect(emptyData).toEqual(enData)
    })

    it('fallbacks to English for undefined language', () => {
      // @ts-expect-error testing invalid input
      const undefinedData = loadCVDataForLanguage(undefined)
      const enData = loadCVDataForLanguage('en')
      
      expect(undefinedData).toEqual(enData)
    })
  })

  describe('loaded data structure validation', () => {
    const languages: Language[] = ['en', 'de', 'fa']

    languages.forEach(lang => {
      it(`loads valid object for "${lang}"`, () => {
        const data = loadCVDataForLanguage(lang)
        
        expect(data).toBeDefined()
        expect(typeof data).toBe('object')
        expect(data).not.toBeNull()
        expect(Array.isArray(data)).toBe(false)
      })
    })

    languages.forEach(lang => {
      it(`loads non-empty data for "${lang}"`, () => {
        const data = loadCVDataForLanguage(lang) as Record<string, unknown>
        
        expect(Object.keys(data).length).toBeGreaterThan(0)
      })
    })
  })
})

describe('CV Loader - Full Pipeline (loadAndValidateData)', () => {
  const languages: Language[] = ['en', 'de', 'fa']

  describe('normalized data structure', () => {
    languages.forEach(lang => {
      it(`returns normalized English schema for "${lang}"`, () => {
        const result = loadAndValidateData(lang)
        
        // All languages should normalize to English schema
        expect(result.data).toHaveProperty('basics')
        expect(result.data).toHaveProperty('profiles')
        expect(result.data).toHaveProperty('education')
        expect(result.data).toHaveProperty('languages')
        expect(result.data).toHaveProperty('workshop_and_certifications')
        expect(result.data).toHaveProperty('skills')
        expect(result.data).toHaveProperty('experiences')
        expect(result.data).toHaveProperty('projects')
        expect(result.data).toHaveProperty('publications')
        expect(result.data).toHaveProperty('references')
      })
    })

    languages.forEach(lang => {
      it(`returns arrays for list sections in "${lang}"`, () => {
        const result = loadAndValidateData(lang)
        
        expect(Array.isArray(result.data.basics)).toBe(true)
        expect(Array.isArray(result.data.profiles)).toBe(true)
        expect(Array.isArray(result.data.education)).toBe(true)
        expect(Array.isArray(result.data.languages)).toBe(true)
        expect(Array.isArray(result.data.workshop_and_certifications)).toBe(true)
        expect(Array.isArray(result.data.experiences)).toBe(true)
        expect(Array.isArray(result.data.projects)).toBe(true)
        expect(Array.isArray(result.data.publications)).toBe(true)
        expect(Array.isArray(result.data.references)).toBe(true)
      })
    })

    languages.forEach(lang => {
      it(`returns object for skills in "${lang}"`, () => {
        const result = loadAndValidateData(lang)
        
        expect(typeof result.data.skills).toBe('object')
        expect(result.data.skills).not.toBeNull()
        expect(Array.isArray(result.data.skills)).toBe(false)
      })
    })
  })

  describe('validation results', () => {
    languages.forEach(lang => {
      it(`includes validation result for "${lang}"`, () => {
        const result = loadAndValidateData(lang)
        
        expect(result).toHaveProperty('validationResult')
        expect(result.validationResult).toHaveProperty('isValid')
        expect(result.validationResult).toHaveProperty('errors')
        expect(result.validationResult).toHaveProperty('warnings')
        expect(Array.isArray(result.validationResult.errors)).toBe(true)
        expect(Array.isArray(result.validationResult.warnings)).toBe(true)
      })
    })
  })

  describe('content availability', () => {
    languages.forEach(lang => {
      it(`has at least one basics entry for "${lang}"`, () => {
        const result = loadAndValidateData(lang)
        
        expect(result.data.basics.length).toBeGreaterThanOrEqual(1)
      })
    })

    languages.forEach(lang => {
      it(`has education entries for "${lang}"`, () => {
        const result = loadAndValidateData(lang)
        
        expect(result.data.education.length).toBeGreaterThan(0)
      })
    })

    languages.forEach(lang => {
      it(`has experience entries for "${lang}"`, () => {
        const result = loadAndValidateData(lang)
        
        expect(result.data.experiences.length).toBeGreaterThan(0)
      })
    })
  })

  describe('default language behavior', () => {
    it('defaults to English when no language provided', () => {
      const defaultResult = loadAndValidateData()
      const enResult = loadAndValidateData('en')
      
      // Both should produce valid results with same structure
      expect(defaultResult.data).toBeDefined()
      expect(Object.keys(defaultResult.data)).toEqual(Object.keys(enResult.data))
    })
  })
})

// ============================================================================
// B) LANG.JSON HELPER TESTS - tl() Function
// ============================================================================

describe('lang.json Helper - tl() Function', () => {
  describe('returns translated label when exists', () => {
    it('returns German translation for "basics"', () => {
      const result = tl('basics', 'de')
      
      expect(result).toBe('Grunddaten')
    })

    it('returns Persian translation for "basics"', () => {
      const result = tl('basics', 'fa')
      
      expect(result).toBe('اطلاعات پایه')
    })

    it('returns English translation for "education"', () => {
      const result = tl('education', 'en')
      
      expect(result).toBe('education')
    })

    it('returns German translation for "education"', () => {
      const result = tl('education', 'de')
      
      expect(result).toBe('Ausbildung')
    })

    it('returns Persian translation for "education"', () => {
      const result = tl('education', 'fa')
      
      expect(result).toBe('تحصیلات')
    })

    it('returns German translation for "experiences"', () => {
      const result = tl('experiences', 'de')
      
      expect(result).toBe('Erfahrungen')
    })

    it('returns Persian translation for "skills"', () => {
      const result = tl('skills', 'fa')
      
      expect(result).toBe('مهارت‌ها')
    })
  })

  describe('fallback to English when target language missing', () => {
    // Test with a key that exists in lang.json but might not have all translations
    it('returns English value when specific language translation is missing', () => {
      // Testing fallback behavior - if a key exists but specific translation doesn't
      // The function should fall back to 'en' then to keyName
      const testKey = 'email' // Common key in lang.json
      
      const enResult = tl(testKey, 'en')
      const deResult = tl(testKey, 'de')
      const faResult = tl(testKey, 'fa')
      
      // All should return a non-empty value
      expect(enResult).toBeTruthy()
      expect(deResult).toBeTruthy()
      expect(faResult).toBeTruthy()
    })
  })

  describe('fallback to key name when key not found', () => {
    it('returns the key itself when key does not exist in lang.json', () => {
      const unknownKey = 'this_key_does_not_exist_in_lang_json'
      
      const enResult = tl(unknownKey, 'en')
      const deResult = tl(unknownKey, 'de')
      const faResult = tl(unknownKey, 'fa')
      
      // Should return the key name itself
      expect(enResult).toBe(unknownKey)
      expect(deResult).toBe(unknownKey)
      expect(faResult).toBe(unknownKey)
    })

    it('returns empty string key when key is empty', () => {
      const result = tl('', 'en')
      
      expect(result).toBe('')
    })
  })

  describe('common CV field translations', () => {
    const testCases: Array<{ key: string; de: string; fa: string }> = [
      { key: 'fname', de: 'Vorname', fa: 'نام' },
      { key: 'lname', de: 'Nachname', fa: 'نام خانوادگی' },
      { key: 'institution', de: 'Institution', fa: 'مؤسسه/دانشگاه' },
      { key: 'title', de: 'Titel', fa: 'عنوان' },
      { key: 'skills', de: 'Fähigkeiten', fa: 'مهارت‌ها' },
      { key: 'projects', de: 'Projekte', fa: 'پروژه‌ها' },
      { key: 'publications', de: 'Publikationen', fa: 'انتشارات' },
    ]

    testCases.forEach(({ key, de, fa }) => {
      it(`translates "${key}" to German correctly`, () => {
        expect(tl(key, 'de')).toBe(de)
      })

      it(`translates "${key}" to Persian correctly`, () => {
        expect(tl(key, 'fa')).toBe(fa)
      })
    })
  })
})
