/**
 * i18n Dictionary Completeness Tests
 * 
 * Ensures all language dictionaries have identical key structures
 */

import { describe, it, expect } from 'vitest'
import { getUIStrings, t } from '../i18n'
import type { Language } from '@/utils/dataNormalizer'

const LANGUAGES: Language[] = ['en', 'de', 'fa']

/**
 * Recursively get all keys from an object
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = []
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  
  return keys.sort()
}

describe('i18n Dictionary Completeness', () => {
  it('should have identical key structures across all languages', () => {
    const enKeys = getAllKeys(getUIStrings('en'))
    const deKeys = getAllKeys(getUIStrings('de'))
    const faKeys = getAllKeys(getUIStrings('fa'))
    
    expect(deKeys).toEqual(enKeys)
    expect(faKeys).toEqual(enKeys)
  })
  
  it('should have no missing keys in DE', () => {
    const enKeys = getAllKeys(getUIStrings('en'))
    const deKeys = getAllKeys(getUIStrings('de'))
    
    const missingInDE = enKeys.filter(key => !deKeys.includes(key))
    expect(missingInDE).toEqual([])
  })
  
  it('should have no missing keys in FA', () => {
    const enKeys = getAllKeys(getUIStrings('en'))
    const faKeys = getAllKeys(getUIStrings('fa'))
    
    const missingInFA = enKeys.filter(key => !faKeys.includes(key))
    expect(missingInFA).toEqual([])
  })
  
  it('should have no extra keys in DE', () => {
    const enKeys = getAllKeys(getUIStrings('en'))
    const deKeys = getAllKeys(getUIStrings('de'))
    
    const extraInDE = deKeys.filter(key => !enKeys.includes(key))
    expect(extraInDE).toEqual([])
  })
  
  it('should have no extra keys in FA', () => {
    const enKeys = getAllKeys(getUIStrings('en'))
    const faKeys = getAllKeys(getUIStrings('fa'))
    
    const extraInFA = faKeys.filter(key => !enKeys.includes(key))
    expect(extraInFA).toEqual([])
  })
  
  it('should return string values for all valid keys', () => {
    const testKeys = [
      'nav.home',
      'sections.education',
      'actions.download_cv',
      'forms.name',
      'empty.no_data',
      'a11y.skip_to_content'
    ]
    
    LANGUAGES.forEach(lang => {
      testKeys.forEach(key => {
        const value = t(lang, key)
        expect(typeof value).toBe('string')
        expect(value.length).toBeGreaterThan(0)
        expect(value).not.toBe(key)  // Should not return the key itself
      })
    })
  })
  
  it('should return the key itself for invalid keys', () => {
    const invalidKey = 'invalid.nonexistent.key'
    
    LANGUAGES.forEach(lang => {
      const value = t(lang, invalidKey)
      expect(value).toBe(invalidKey)
    })
  })
  
  it('should have all required section headings', () => {
    const requiredSections = [
      'hero',
      'basics',
      'profiles',
      'education',
      'languages',
      'certifications',
      'skills',
      'experiences',
      'projects',
      'publications',
      'references',
      'contact'
    ]
    
    LANGUAGES.forEach(lang => {
      const strings = getUIStrings(lang)
      requiredSections.forEach(section => {
        expect(strings.sections).toHaveProperty(section)
        expect(typeof strings.sections[section]).toBe('string')
        expect(strings.sections[section].length).toBeGreaterThan(0)
      })
    })
  })
  
  it('should have all required action labels', () => {
    const requiredActions = [
      'download_cv',
      'view_more',
      'view_less',
      'contact_me',
      'send_message',
      'copy',
      'copied',
      'close',
      'expand',
      'collapse',
      'filter',
      'search',
      'clear'
    ]
    
    LANGUAGES.forEach(lang => {
      const strings = getUIStrings(lang)
      requiredActions.forEach(action => {
        expect(strings.actions).toHaveProperty(action)
        expect(typeof strings.actions[action]).toBe('string')
        expect(strings.actions[action].length).toBeGreaterThan(0)
      })
    })
  })
  
  it('should have all required form labels', () => {
    const requiredFormFields = [
      'name',
      'email',
      'subject',
      'message',
      'send',
      'sending',
      'sent',
      'error'
    ]
    
    LANGUAGES.forEach(lang => {
      const strings = getUIStrings(lang)
      requiredFormFields.forEach(field => {
        expect(strings.forms).toHaveProperty(field)
        expect(typeof strings.forms[field]).toBe('string')
        expect(strings.forms[field].length).toBeGreaterThan(0)
      })
    })
  })
  
  it('should have all required empty state messages', () => {
    const requiredEmptyStates = [
      'no_data',
      'no_results',
      'no_education',
      'no_experience',
      'no_projects',
      'no_publications',
      'no_skills',
      'no_languages',
      'no_certifications',
      'no_references'
    ]
    
    LANGUAGES.forEach(lang => {
      const strings = getUIStrings(lang)
      requiredEmptyStates.forEach(state => {
        expect(strings.empty).toHaveProperty(state)
        expect(typeof strings.empty[state]).toBe('string')
        expect(strings.empty[state].length).toBeGreaterThan(0)
      })
    })
  })
  
  it('should have all required accessibility labels', () => {
    const requiredA11yLabels = [
      'skip_to_content',
      'menu',
      'close_menu',
      'select_language',
      'select_theme',
      'select_focus',
      'open_modal',
      'close_modal'
    ]
    
    LANGUAGES.forEach(lang => {
      const strings = getUIStrings(lang)
      requiredA11yLabels.forEach(label => {
        expect(strings.a11y).toHaveProperty(label)
        expect(typeof strings.a11y[label]).toBe('string')
        expect(strings.a11y[label].length).toBeGreaterThan(0)
      })
    })
  })
})
