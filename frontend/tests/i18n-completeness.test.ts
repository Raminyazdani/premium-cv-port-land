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

  describe('New i18n keys from Issue 06', () => {
    describe('Fallback strings', () => {
      it('should have fallbacks translated in all languages', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        // English
        expect(en.fallbacks.untitled_role).toBe('Untitled Role')
        expect(en.fallbacks.untitled_project).toBe('Untitled Project')
        expect(en.fallbacks.untitled_publication).toBe('Untitled Publication')
        expect(en.fallbacks.unknown_institution).toBe('Unknown Institution')
        
        // German
        expect(de.fallbacks.untitled_role).toBe('Unbenannte Rolle')
        expect(de.fallbacks.untitled_project).toBe('Unbenanntes Projekt')
        expect(de.fallbacks.untitled_publication).toBe('Unbenannte Veröffentlichung')
        expect(de.fallbacks.unknown_institution).toBe('Unbekannte Institution')
        
        // Persian
        expect(fa.fallbacks.untitled_role).toBe('نقش بدون عنوان')
        expect(fa.fallbacks.untitled_project).toBe('پروژه بدون عنوان')
        expect(fa.fallbacks.untitled_publication).toBe('انتشار بدون عنوان')
        expect(fa.fallbacks.unknown_institution).toBe('موسسه ناشناخته')
      })
    })

    describe('Section subtitles', () => {
      it('should have section subtitles translated', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        expect(en.sectionSubtitles.education).toBeDefined()
        expect(de.sectionSubtitles.education).toBeDefined()
        expect(fa.sectionSubtitles.education).toBeDefined()
        
        expect(en.sectionSubtitles.experiences).toBeDefined()
        expect(de.sectionSubtitles.experiences).toBeDefined()
        expect(fa.sectionSubtitles.experiences).toBeDefined()
        
        expect(en.sectionSubtitles.projects).toBeDefined()
        expect(de.sectionSubtitles.projects).toBeDefined()
        expect(fa.sectionSubtitles.projects).toBeDefined()
        
        expect(en.sectionSubtitles.references).toBeDefined()
        expect(de.sectionSubtitles.references).toBeDefined()
        expect(fa.sectionSubtitles.references).toBeDefined()
      })
    })

    describe('Domain labels', () => {
      it('should have domain labels translated', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        // Programming
        expect(en.domains.programming).toBe('Programming')
        expect(de.domains.programming).toBe('Programmierung')
        expect(fa.domains.programming).toBe('برنامه‌نویسی')
        
        // Bioinformatics
        expect(en.domains.bioinformatics).toBe('Bioinformatics')
        expect(de.domains.bioinformatics).toBe('Bioinformatik')
        expect(fa.domains.bioinformatics).toBe('بیوانفورماتیک')
        
        // Industry/Academic
        expect(en.domains.industry).toBe('Industry')
        expect(de.domains.industry).toBe('Industrie')
        expect(fa.domains.industry).toBe('صنعت')
        
        expect(en.domains.academic).toBe('Academic')
        expect(de.domains.academic).toBe('Akademisch')
        expect(fa.domains.academic).toBe('آکادمیک')
      })
    })

    describe('UI action strings', () => {
      it('should have Show/Hide Contact translated', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        expect(en.actions.show_contact).toBe('Show Contact')
        expect(de.actions.show_contact).toBe('Kontakt anzeigen')
        expect(fa.actions.show_contact).toBe('نمایش اطلاعات تماس')
        
        expect(en.actions.hide_contact).toBe('Hide Contact')
        expect(de.actions.hide_contact).toBe('Kontakt ausblenden')
        expect(fa.actions.hide_contact).toBe('مخفی کردن اطلاعات تماس')
      })

      it('should have Timeline/By Category translated', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        expect(en.actions.timeline).toBe('Timeline')
        expect(de.actions.timeline).toBe('Zeitleiste')
        expect(fa.actions.timeline).toBe('جدول زمانی')
        
        expect(en.actions.by_category).toBe('By Category')
        expect(de.actions.by_category).toBe('Nach Kategorie')
        expect(fa.actions.by_category).toBe('بر اساس دسته‌بندی')
      })

      it('should have Has Link translated', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        expect(en.actions.has_link).toBe('Has Link')
        expect(de.actions.has_link).toBe('Mit Link')
        expect(fa.actions.has_link).toBe('دارای لینک')
      })
    })

    describe('Toast messages', () => {
      it('should have toast messages with interpolation', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        expect(en.toasts.copied_to_clipboard).toContain('{label}')
        expect(de.toasts.copied_to_clipboard).toContain('{label}')
        expect(fa.toasts.copied_to_clipboard).toContain('{label}')
        
        expect(en.toasts.link_copied).toContain('{network}')
        expect(de.toasts.link_copied).toContain('{network}')
        expect(fa.toasts.link_copied).toContain('{network}')
      })
    })

    describe('Count displays', () => {
      it('should have count display strings with interpolation', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        expect(en.counts.showing_x_of_y_projects).toContain('{current}')
        expect(en.counts.showing_x_of_y_projects).toContain('{total}')
        
        expect(de.counts.showing_x_of_y_projects).toContain('{current}')
        expect(de.counts.showing_x_of_y_projects).toContain('{total}')
        
        expect(fa.counts.showing_x_of_y_projects).toContain('{current}')
        expect(fa.counts.showing_x_of_y_projects).toContain('{total}')
      })
    })

    describe('References section', () => {
      it('should have privacy notice translated', () => {
        const en = getUIStrings('en')
        const de = getUIStrings('de')
        const fa = getUIStrings('fa')
        
        expect(en.references.privacy_notice).toBeDefined()
        expect(en.references.privacy_notice.length).toBeGreaterThan(20)
        
        expect(de.references.privacy_notice).toBeDefined()
        expect(de.references.privacy_notice.length).toBeGreaterThan(20)
        
        expect(fa.references.privacy_notice).toBeDefined()
        expect(fa.references.privacy_notice.length).toBeGreaterThan(20)
      })
    })
  })
})
