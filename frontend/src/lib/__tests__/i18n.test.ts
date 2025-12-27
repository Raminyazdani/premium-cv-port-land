/**
 * i18n Dictionary Completeness Tests
 * 
 * Ensures all language dictionaries have the same keys
 */

import { describe, it, expect } from 'vitest'
import { getUIStrings, t, interpolate } from '../i18n'
import type { Language } from '@/utils/dataNormalizer'

describe('i18n Dictionary Completeness', () => {
  const languages: Language[] = ['en', 'de', 'fa']

  function getAllKeys(obj: any, prefix = ''): string[] {
    const keys: string[] = []
    
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      const value = obj[key]
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys.push(...getAllKeys(value, fullKey))
      } else if (typeof value === 'string') {
        keys.push(fullKey)
      }
    }
    
    return keys.sort()
  }

  it('should have identical key sets across all languages', () => {
    const enKeys = getAllKeys(getUIStrings('en'))
    const deKeys = getAllKeys(getUIStrings('de'))
    const faKeys = getAllKeys(getUIStrings('fa'))

    expect(enKeys).toEqual(deKeys)
    expect(enKeys).toEqual(faKeys)
    expect(deKeys).toEqual(faKeys)
  })

  it('should not have any missing translations', () => {
    const enStrings = getUIStrings('en')
    const deStrings = getUIStrings('de')
    const faStrings = getUIStrings('fa')

    const checkNoMissingTranslations = (obj: any, langCode: string, path = '') => {
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key
        const value = obj[key]
        
        if (typeof value === 'object' && value !== null) {
          checkNoMissingTranslations(value, langCode, fullPath)
        } else if (typeof value === 'string') {
          expect(value.trim()).not.toBe('')
          expect(value).not.toMatch(/TODO|FIXME|TRANSLATE/i)
        }
      }
    }

    checkNoMissingTranslations(enStrings, 'en')
    checkNoMissingTranslations(deStrings, 'de')
    checkNoMissingTranslations(faStrings, 'fa')
  })

  it('should return correct translations for valid keys', () => {
    expect(t('en', 'actions.download_cv')).toBe('Download CV')
    expect(t('de', 'actions.download_cv')).toBe('Lebenslauf herunterladen')
    expect(t('fa', 'actions.download_cv')).toBe('دانلود رزومه')
  })

  it('should return the key itself for invalid keys', () => {
    expect(t('en', 'invalid.key')).toBe('invalid.key')
    expect(t('de', 'nonexistent')).toBe('nonexistent')
  })

  it('should handle interpolation correctly', () => {
    const template = '© {year} {name}. All rights reserved.'
    const result = interpolate(template, { year: 2024, name: 'John Doe' })
    expect(result).toBe('© 2024 John Doe. All rights reserved.')
  })

  it('should handle missing interpolation variables gracefully', () => {
    const template = 'Hello {name}, you have {count} messages'
    const result = interpolate(template, { name: 'Alice' })
    expect(result).toBe('Hello Alice, you have  messages')
  })

  it('should return fallback language (en) for unsupported languages', () => {
    const strings = getUIStrings('unsupported' as Language)
    expect(strings).toEqual(getUIStrings('en'))
  })

  it('should have all navigation items translated', () => {
    languages.forEach(lang => {
      const strings = getUIStrings(lang)
      expect(strings.nav.home).toBeTruthy()
      expect(strings.nav.about).toBeTruthy()
      expect(strings.nav.education).toBeTruthy()
      expect(strings.nav.experience).toBeTruthy()
      expect(strings.nav.projects).toBeTruthy()
      expect(strings.nav.contact).toBeTruthy()
    })
  })

  it('should have all section headings translated', () => {
    languages.forEach(lang => {
      const strings = getUIStrings(lang)
      expect(strings.sections.education).toBeTruthy()
      expect(strings.sections.experiences).toBeTruthy()
      expect(strings.sections.projects).toBeTruthy()
      expect(strings.sections.publications).toBeTruthy()
      expect(strings.sections.skills).toBeTruthy()
    })
  })

  it('should have all action buttons translated', () => {
    languages.forEach(lang => {
      const strings = getUIStrings(lang)
      expect(strings.actions.download_cv).toBeTruthy()
      expect(strings.actions.contact_me).toBeTruthy()
      expect(strings.actions.send_message).toBeTruthy()
      expect(strings.actions.copy).toBeTruthy()
      expect(strings.actions.copied).toBeTruthy()
    })
  })

  it('should have all form labels translated', () => {
    languages.forEach(lang => {
      const strings = getUIStrings(lang)
      expect(strings.forms.name).toBeTruthy()
      expect(strings.forms.email).toBeTruthy()
      expect(strings.forms.subject).toBeTruthy()
      expect(strings.forms.message).toBeTruthy()
      expect(strings.forms.send).toBeTruthy()
    })
  })

  it('should have all empty state messages translated', () => {
    languages.forEach(lang => {
      const strings = getUIStrings(lang)
      expect(strings.empty.no_data).toBeTruthy()
      expect(strings.empty.no_results).toBeTruthy()
      expect(strings.empty.no_education).toBeTruthy()
      expect(strings.empty.no_projects).toBeTruthy()
    })
  })

  it('should have all accessibility labels translated', () => {
    languages.forEach(lang => {
      const strings = getUIStrings(lang)
      expect(strings.a11y.skip_to_content).toBeTruthy()
      expect(strings.a11y.menu).toBeTruthy()
      expect(strings.a11y.close_menu).toBeTruthy()
      expect(strings.a11y.select_language).toBeTruthy()
    })
  })
})
