/**
 * Data Normalization Tests
 * 
 * Tests that all CV files (EN/DE/FA) use canonical English schema
 * and normalize correctly (validation only, no key transformation)
 */

import { describe, it, expect } from 'vitest'
import { normalizeCVData } from '@/utils/dataNormalizer'
import cvDataEN from '@/data/cv.json'
import cvDataDE from '@/data/cv_de.json'
import cvDataFA from '@/data/cv_fa.json'

// Expected canonical section keys (all languages use these)
const EXPECTED_SECTIONS = [
  'basics',
  'profiles',
  'education',
  'languages',
  'workshop_and_certifications',
  'skills',
  'experiences',
  'projects',
  'publications',
  'references'
]

describe('Data Normalization', () => {
  describe('English (EN) normalization', () => {
    it('should have all canonical section keys', () => {
      const normalized = normalizeCVData(cvDataEN, 'en')
      
      EXPECTED_SECTIONS.forEach(key => {
        expect(normalized).toHaveProperty(key)
      })
    })
    
    it('should have basics section with required fields', () => {
      const normalized = normalizeCVData(cvDataEN, 'en')
      
      expect(normalized.basics).toBeDefined()
      expect(Array.isArray(normalized.basics)).toBe(true)
      
      if (normalized.basics && normalized.basics.length > 0) {
        const basics = normalized.basics[0]
        expect(basics).toHaveProperty('fname')
        expect(basics).toHaveProperty('lname')
        expect(basics).toHaveProperty('email')
      }
    })
  })
  
  describe('German (DE) normalization', () => {
    it('should have all canonical section keys (no transformation needed)', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      EXPECTED_SECTIONS.forEach(key => {
        expect(normalized).toHaveProperty(key)
      })
    })
    
    it('should have basics section with required fields', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      expect(normalized.basics).toBeDefined()
      expect(Array.isArray(normalized.basics)).toBe(true)
      
      if (normalized.basics && normalized.basics.length > 0) {
        const basics = normalized.basics[0]
        expect(basics).toHaveProperty('fname')
        expect(basics).toHaveProperty('lname')
        expect(basics).toHaveProperty('email')
      }
    })
    
    it('should have education section', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      expect(normalized.education).toBeDefined()
      expect(Array.isArray(normalized.education)).toBe(true)
      
      if (normalized.education && normalized.education.length > 0) {
        const edu = normalized.education[0]
        expect(edu).toHaveProperty('institution')
        expect(edu).toHaveProperty('studyType')
      }
    })
  })
  
  describe('Persian (FA) normalization', () => {
    it('should have all canonical section keys (no transformation needed)', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      EXPECTED_SECTIONS.forEach(key => {
        expect(normalized).toHaveProperty(key)
      })
    })
    
    it('should have basics section with required fields', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      expect(normalized.basics).toBeDefined()
      expect(Array.isArray(normalized.basics)).toBe(true)
      
      if (normalized.basics && normalized.basics.length > 0) {
        const basics = normalized.basics[0]
        expect(basics).toHaveProperty('fname')
        expect(basics).toHaveProperty('lname')
        expect(basics).toHaveProperty('email')
      }
    })
    
    it('should have education section', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      expect(normalized.education).toBeDefined()
      expect(Array.isArray(normalized.education)).toBe(true)
      
      if (normalized.education && normalized.education.length > 0) {
        const edu = normalized.education[0]
        expect(edu).toHaveProperty('institution')
        expect(edu).toHaveProperty('studyType')
      }
    })
  })
  
  describe('Skills structure', () => {
    it('should preserve skills object structure across languages', () => {
      const normalizedEN = normalizeCVData(cvDataEN, 'en')
      const normalizedDE = normalizeCVData(cvDataDE, 'de')
      const normalizedFA = normalizeCVData(cvDataFA, 'fa')
      
      expect(typeof normalizedEN.skills).toBe('object')
      expect(typeof normalizedDE.skills).toBe('object')
      expect(typeof normalizedFA.skills).toBe('object')
      
      // Skills should have top-level categories
      expect(Object.keys(normalizedEN.skills).length).toBeGreaterThan(0)
      expect(Object.keys(normalizedDE.skills).length).toBeGreaterThan(0)
      expect(Object.keys(normalizedFA.skills).length).toBeGreaterThan(0)
    })
  })
})
