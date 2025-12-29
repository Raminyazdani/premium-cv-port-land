/**
 * I18N Completeness Tests
 * 
 * Tests that verify all i18n keys are complete across EN/DE/FA
 * and that previously hardcoded strings are now translated.
 */

import { describe, it, expect } from 'vitest'
import { getUIStrings } from '@/lib/i18n'
import type { Language } from '@/utils/dataNormalizer'

const languages: Language[] = ['en', 'de', 'fa']

/**
 * Recursively get all keys from a nested object
 */
function getAllKeys(obj: unknown, prefix = ''): string[] {
  const keys: string[] = []
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        keys.push(...getAllKeys(value, fullKey))
      } else {
        keys.push(fullKey)
      }
    }
  }
  return keys
}

describe('I18N Completeness Tests', () => {
  describe('All languages have the same keys', () => {
    const enStrings = getUIStrings('en')
    const enKeys = getAllKeys(enStrings)

    languages.forEach(lang => {
      it(`${lang.toUpperCase()} has all keys present in EN`, () => {
        const langStrings = getUIStrings(lang)
        const langKeys = getAllKeys(langStrings)
        
        // Check that all EN keys exist in this language
        const missingKeys = enKeys.filter(key => !langKeys.includes(key))
        expect(missingKeys, `Missing keys in ${lang.toUpperCase()}: ${missingKeys.join(', ')}`).toHaveLength(0)
      })
    })
  })

  describe('Previously hardcoded strings are now translated', () => {
    it('should have "Connect With Me" translated in sections.profiles', () => {
      const en = getUIStrings('en')
      const de = getUIStrings('de')
      const fa = getUIStrings('fa')
      
      // EN should have the value
      expect(en.sections.profiles).toBeDefined()
      expect(en.sections.profiles).not.toBe('')
      
      // DE should have a different value (not the English one)
      expect(de.sections.profiles).toBeDefined()
      expect(de.sections.profiles).not.toBe('')
      
      // FA should have a different value (not the English one)
      expect(fa.sections.profiles).toBeDefined()
      expect(fa.sections.profiles).not.toBe('')
    })

    it('should have skills section texts translated', () => {
      const en = getUIStrings('en')
      const de = getUIStrings('de')
      const fa = getUIStrings('fa')
      
      // Check skills.skills_across_domains
      expect(en.skills.skills_across_domains).toBeDefined()
      expect(de.skills.skills_across_domains).toBeDefined()
      expect(fa.skills.skills_across_domains).toBeDefined()
      
      // Check skills.no_skills_matching
      expect(en.skills.no_skills_matching).toBeDefined()
      expect(de.skills.no_skills_matching).toBeDefined()
      expect(fa.skills.no_skills_matching).toBeDefined()
      
      // Check skills.search_placeholder
      expect(en.skills.search_placeholder).toBeDefined()
      expect(de.skills.search_placeholder).toBeDefined()
      expect(fa.skills.search_placeholder).toBeDefined()
    })

    it('should have action buttons translated', () => {
      const en = getUIStrings('en')
      const de = getUIStrings('de')
      const fa = getUIStrings('fa')
      
      // Check actions.expand_all
      expect(en.actions.expand_all).toBe('Expand All')
      expect(de.actions.expand_all).toBe('Alle erweitern')
      expect(fa.actions.expand_all).toBe('گسترش همه')
      
      // Check actions.collapse_all
      expect(en.actions.collapse_all).toBe('Collapse All')
      expect(de.actions.collapse_all).toBe('Alle einklappen')
      expect(fa.actions.collapse_all).toBe('جمع کردن همه')
      
      // Check actions.back_to_top
      expect(en.actions.back_to_top).toBe('Back to top')
      expect(de.actions.back_to_top).toBe('Nach oben')
      expect(fa.actions.back_to_top).toBe('بازگشت به بالا')
    })

    it('should have aria-labels translated', () => {
      const en = getUIStrings('en')
      const de = getUIStrings('de')
      const fa = getUIStrings('fa')
      
      // Check a11y.previous_skill_category
      expect(en.a11y.previous_skill_category).toBe('Previous skill category')
      expect(de.a11y.previous_skill_category).toBe('Vorherige Fähigkeitskategorie')
      expect(fa.a11y.previous_skill_category).toBe('دسته مهارت قبلی')
      
      // Check a11y.social_profiles
      expect(en.a11y.social_profiles).toBe('Social media profiles')
      expect(de.a11y.social_profiles).toBe('Social-Media-Profile')
      expect(fa.a11y.social_profiles).toBe('پروفایل‌های شبکه‌های اجتماعی')
    })

    it('should have media modal texts translated', () => {
      const en = getUIStrings('en')
      const de = getUIStrings('de')
      const fa = getUIStrings('fa')
      
      // Check media.failed_to_load
      expect(en.media?.failed_to_load).toBe('Failed to load image')
      expect(de.media?.failed_to_load).toBe('Bild konnte nicht geladen werden')
      expect(fa.media?.failed_to_load).toBe('بارگذاری تصویر ناموفق بود')
      
      // Check media.pdf_document
      expect(en.media?.pdf_document).toBe('PDF Document')
      expect(de.media?.pdf_document).toBe('PDF-Dokument')
      expect(fa.media?.pdf_document).toBe('سند PDF')
    })

    it('should have profile section texts translated', () => {
      const en = getUIStrings('en')
      const de = getUIStrings('de')
      const fa = getUIStrings('fa')
      
      // Check profiles.right_click_to_copy
      expect(en.profiles?.right_click_to_copy).toBe('Right-click to copy link')
      expect(de.profiles?.right_click_to_copy).toBe('Rechtsklick zum Kopieren des Links')
      expect(fa.profiles?.right_click_to_copy).toBe('راست‌کلیک برای کپی لینک')
      
      // Check profiles.no_profiles
      expect(en.profiles?.no_profiles).toBe('No profiles available')
      expect(de.profiles?.no_profiles).toBe('Keine Profile verfügbar')
      expect(fa.profiles?.no_profiles).toBe('پروفایلی موجود نیست')
    })

    it('should have languages section description translated', () => {
      const en = getUIStrings('en')
      const de = getUIStrings('de')
      const fa = getUIStrings('fa')
      
      // Check languages_section.description
      expect(en.languages_section.description).toBe('Communication skills across multiple languages')
      expect(de.languages_section.description).toBe('Kommunikationsfähigkeiten in mehreren Sprachen')
      expect(fa.languages_section.description).toBe('مهارت‌های ارتباطی در چند زبان')
    })
  })

  describe('German strings are not English', () => {
    it('should have German-specific text (not English) for key UI strings', () => {
      const de = getUIStrings('de')
      
      // These should be German, not English
      expect(de.sections.skills).not.toBe('Skills & Expertise')
      expect(de.sections.languages).not.toBe('Languages')
      expect(de.sections.profiles).not.toBe('Connect With Me')
      expect(de.actions.expand_all).not.toBe('Expand All')
      expect(de.actions.collapse_all).not.toBe('Collapse All')
    })
  })

  describe('Persian strings are not English', () => {
    it('should have Persian-specific text (not English) for key UI strings', () => {
      const fa = getUIStrings('fa')
      
      // These should be Persian, not English
      expect(fa.sections.skills).not.toBe('Skills & Expertise')
      expect(fa.sections.languages).not.toBe('Languages')
      expect(fa.sections.profiles).not.toBe('Connect With Me')
      expect(fa.actions.expand_all).not.toBe('Expand All')
      expect(fa.actions.collapse_all).not.toBe('Collapse All')
    })
  })
})
