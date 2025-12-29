/**
 * SEO Translation Tests
 * 
 * Tests that verify SEO titles and descriptions are fully translated
 * per language without mixed scripts (especially for Persian).
 * 
 * Fixes: SEO-001
 */

import { describe, it, expect } from 'vitest'
import { getUIStrings } from '@/lib/i18n'
import { generatePageMeta, getLocale } from '@/utils/seo'
import type { Language } from '@/utils/dataNormalizer'
import type { CVData } from '@/types/cv'

const languages: Language[] = ['en', 'de', 'fa']

// Mock CV data for testing
const mockCVData: CVData = {
  basics: [{
    fname: 'Ramin',
    lname: 'Yazdani',
    email: 'test@example.com'
  }],
  profiles: [],
  education: [],
  languages: [],
  workshop_and_certifications: [],
  skills: {},
  experiences: [],
  projects: [],
  publications: [],
  references: []
}

describe('SEO Translations', () => {
  describe('All languages have SEO translations', () => {
    languages.forEach(lang => {
      it(`${lang.toUpperCase()} has SEO translations defined`, () => {
        const strings = getUIStrings(lang)
        expect(strings.seo).toBeDefined()
        expect(strings.seo?.name).toBeDefined()
        expect(strings.seo?.title).toBeDefined()
        expect(strings.seo?.description).toBeDefined()
        expect(strings.seo?.separator).toBeDefined()
      })
    })
  })

  describe('SEO titles are fully translated per language', () => {
    it('English SEO uses English text', () => {
      const strings = getUIStrings('en')
      expect(strings.seo?.name).toBe('Ramin Yazdani')
      expect(strings.seo?.title).toBe('Biotechnologist & Developer')
      expect(strings.seo?.description).toContain('Biotechnologist')
    })

    it('German SEO uses German text', () => {
      const strings = getUIStrings('de')
      expect(strings.seo?.name).toBe('Ramin Yazdani')
      expect(strings.seo?.title).toBe('Biotechnologe & Entwickler')
      expect(strings.seo?.description).toContain('Biotechnologe')
    })

    it('Persian SEO uses fully Persian text (no mixed scripts)', () => {
      const strings = getUIStrings('fa')
      
      // Name should be in Persian
      expect(strings.seo?.name).toBe('رامین یزدانی')
      
      // Title should be fully Persian (no Latin characters)
      expect(strings.seo?.title).toBe('زیست‌فناور و توسعه‌دهنده')
      
      // Title should not contain "&" (English ampersand)
      expect(strings.seo?.title).not.toContain('&')
      
      // Title should use Persian "و" (and)
      expect(strings.seo?.title).toContain('و')
      
      // Description should be fully Persian
      expect(strings.seo?.description).toBe('رزومه رامین یزدانی - زیست‌فناور و توسعه‌دهنده نرم‌افزار')
      expect(strings.seo?.description).not.toContain('&')
    })
  })

  describe('generatePageMeta uses translated SEO strings', () => {
    it('generates English title from SEO translations', () => {
      const meta = generatePageMeta(mockCVData, 'en')
      expect(meta.title).toBe('Ramin Yazdani - Biotechnologist & Developer')
      expect(meta.description).toContain('Biotechnologist')
    })

    it('generates German title from SEO translations', () => {
      const meta = generatePageMeta(mockCVData, 'de')
      expect(meta.title).toBe('Ramin Yazdani - Biotechnologe & Entwickler')
      expect(meta.description).toContain('Biotechnologe')
    })

    it('generates fully Persian title from SEO translations', () => {
      const meta = generatePageMeta(mockCVData, 'fa')
      
      // Should be fully Persian, no mixed scripts
      expect(meta.title).toBe('رامین یزدانی - زیست‌فناور و توسعه‌دهنده')
      expect(meta.title).not.toContain('&')
      
      // Description should also be fully Persian
      expect(meta.description).toBe('رزومه رامین یزدانی - زیست‌فناور و توسعه‌دهنده نرم‌افزار')
    })

    it('uses translated author name', () => {
      const enMeta = generatePageMeta(mockCVData, 'en')
      expect(enMeta.author).toBe('Ramin Yazdani')

      const faMeta = generatePageMeta(mockCVData, 'fa')
      expect(faMeta.author).toBe('رامین یزدانی')
    })
  })

  describe('getLocale returns correct locale', () => {
    it('returns en_US for English', () => {
      expect(getLocale('en')).toBe('en_US')
    })

    it('returns de_DE for German', () => {
      expect(getLocale('de')).toBe('de_DE')
    })

    it('returns fa_IR for Persian', () => {
      expect(getLocale('fa')).toBe('fa_IR')
    })
  })
})
