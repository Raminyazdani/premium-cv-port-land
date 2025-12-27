/**
 * Data Normalization Tests
 * 
 * Ensures that DE and FA JSON files are correctly normalized to English schema
 */

import { describe, it, expect } from 'vitest'
import { normalizeCVData, validateNormalizedData } from '../src/utils/dataNormalizer'
import cvDataEN from '../src/data/cv.json'
import cvDataDE from '../src/data/ramin_de.json'
import cvDataFA from '../src/data/ramin_fa.json'

describe('Data Normalization', () => {
  describe('English (no normalization)', () => {
    it('should pass through English data unchanged', () => {
      const normalized = normalizeCVData(cvDataEN, 'en')
      expect(normalized).toEqual(cvDataEN)
    })

    it('should have valid structure', () => {
      const normalized = normalizeCVData(cvDataEN, 'en')
      const validation = validateNormalizedData(normalized)
      expect(validation.isValid).toBe(true)
      expect(validation.missingKeys).toHaveLength(0)
    })
  })

  describe('German normalization', () => {
    it('should normalize German data to English schema', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      // Check top-level keys are English
      expect(normalized).toHaveProperty('basics')
      expect(normalized).toHaveProperty('profiles')
      expect(normalized).toHaveProperty('education')
      expect(normalized).toHaveProperty('skills')
      
      // Should not have German keys
      expect(normalized).not.toHaveProperty('grunddaten')
      expect(normalized).not.toHaveProperty('ausbildung')
    })

    it('should normalize basics section', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      const basics = normalized.basics?.[0]
      
      expect(basics).toHaveProperty('fname')
      expect(basics).toHaveProperty('lname')
      expect(basics).toHaveProperty('email')
      expect(basics).toHaveProperty('phone')
      
      // Should not have German keys
      expect(basics).not.toHaveProperty('vorname')
      expect(basics).not.toHaveProperty('nachname')
      expect(basics).not.toHaveProperty('e_mail')
      expect(basics).not.toHaveProperty('telefon')
    })

    it('should normalize nested phone structure', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      const phone = normalized.basics?.[0]?.phone
      
      if (phone) {
        expect(phone).toHaveProperty('countryCode')
        expect(phone).toHaveProperty('number')
        expect(phone).toHaveProperty('formatted')
        
        expect(phone).not.toHaveProperty('landesvorwahl')
        expect(phone).not.toHaveProperty('nummer')
        expect(phone).not.toHaveProperty('formatiert')
      }
    })

    it('should have valid structure after normalization', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      const validation = validateNormalizedData(normalized)
      expect(validation.isValid).toBe(true)
      expect(validation.missingKeys).toHaveLength(0)
    })
  })

  describe('Persian normalization', () => {
    it('should normalize Persian data to English schema', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      // Check top-level keys are English
      expect(normalized).toHaveProperty('basics')
      expect(normalized).toHaveProperty('profiles')
      expect(normalized).toHaveProperty('education')
      expect(normalized).toHaveProperty('skills')
      
      // Should not have Persian keys
      expect(normalized).not.toHaveProperty('اطلاعات_پایه')
      expect(normalized).not.toHaveProperty('تحصیلات')
    })

    it('should normalize basics section', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      const basics = normalized.basics?.[0]
      
      expect(basics).toHaveProperty('fname')
      expect(basics).toHaveProperty('lname')
      expect(basics).toHaveProperty('email')
      expect(basics).toHaveProperty('phone')
      
      // Should not have Persian keys
      expect(basics).not.toHaveProperty('نام_کوچک')
      expect(basics).not.toHaveProperty('نام_خانوادگی')
      expect(basics).not.toHaveProperty('ایمیل')
      expect(basics).not.toHaveProperty('تلفن')
    })

    it('should normalize nested location structure', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      const location = normalized.basics?.[0]?.location?.[0]
      
      if (location) {
        expect(location).toHaveProperty('city')
        expect(location).toHaveProperty('country')
        expect(location).toHaveProperty('postalCode')
        
        expect(location).not.toHaveProperty('شهر')
        expect(location).not.toHaveProperty('کشور')
        expect(location).not.toHaveProperty('کد_پستی')
      }
    })

    it('should have valid structure after normalization', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      const validation = validateNormalizedData(normalized)
      expect(validation.isValid).toBe(true)
      expect(validation.missingKeys).toHaveLength(0)
    })
  })

  describe('Data consistency across languages', () => {
    it('should have same structure for all languages', () => {
      const normalizedEN = normalizeCVData(cvDataEN, 'en')
      const normalizedDE = normalizeCVData(cvDataDE, 'de')
      const normalizedFA = normalizeCVData(cvDataFA, 'fa')
      
      const keysEN = Object.keys(normalizedEN).sort()
      const keysDE = Object.keys(normalizedDE).sort()
      const keysFA = Object.keys(normalizedFA).sort()
      
      expect(keysDE).toEqual(keysEN)
      expect(keysFA).toEqual(keysEN)
    })

    it('should preserve URLs across languages', () => {
      const normalizedEN = normalizeCVData(cvDataEN, 'en')
      const normalizedDE = normalizeCVData(cvDataDE, 'de')
      const normalizedFA = normalizeCVData(cvDataFA, 'fa')
      
      const profileUrlEN = normalizedEN.profiles?.[0]?.url
      const profileUrlDE = normalizedDE.profiles?.[0]?.url
      const profileUrlFA = normalizedFA.profiles?.[0]?.url
      
      if (profileUrlEN && profileUrlDE && profileUrlFA) {
        expect(profileUrlDE).toBe(profileUrlEN)
        expect(profileUrlFA).toBe(profileUrlEN)
      }
    })
  })
})
