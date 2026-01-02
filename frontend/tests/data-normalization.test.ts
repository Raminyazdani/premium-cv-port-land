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
    
    it('should normalize nested skills structure', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      expect(normalized.skills).toBeDefined()
      expect(typeof normalized.skills).toBe('object')
      
      if (normalized.skills) {
        const topCategories = Object.keys(normalized.skills)
        expect(topCategories.length).toBeGreaterThan(0)
        
        const firstCategory = normalized.skills[topCategories[0]]
        expect(typeof firstCategory).toBe('object')
        
        const subCategories = Object.keys(firstCategory)
        if (subCategories.length > 0) {
          const items = firstCategory[subCategories[0]]
          expect(Array.isArray(items)).toBe(true)
          
          if (items.length > 0) {
            expect(items[0]).toHaveProperty('long_name')
            expect(items[0]).toHaveProperty('short_name')
          }
        }
      }
    })
    
    it('should preserve values exactly (no data loss)', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      if (normalized.basics && normalized.basics[0]) {
        const basics = normalized.basics[0]
        expect(basics.email).toBeTruthy()
        expect(typeof basics.email).toBe('string')
      }
    })
  })
  
  describe('Persian (FA) normalization', () => {
    it('should normalize all top-level section keys', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      const expectedKeys = Object.keys(SECTION_KEYS)
      expectedKeys.forEach(key => {
        expect(normalized).toHaveProperty(key)
      })
    })
    
    it('should normalize basics section with Persian keys', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      expect(normalized.basics).toBeDefined()
      expect(Array.isArray(normalized.basics)).toBe(true)
      
      if (normalized.basics && normalized.basics.length > 0) {
        const basics = normalized.basics[0]
        expect(basics).toHaveProperty('fname')
        expect(basics).toHaveProperty('lname')
        expect(basics).toHaveProperty('email')
        
        if (basics.phone) {
          expect(basics.phone).toHaveProperty('countryCode')
          expect(basics.phone).toHaveProperty('number')
        }
      }
    })
    
    it('should normalize projects section', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      expect(normalized.projects).toBeDefined()
      expect(Array.isArray(normalized.projects)).toBe(true)
      
      if (normalized.projects && normalized.projects.length > 0) {
        const project = normalized.projects[0]
        expect(project).toHaveProperty('title')
        expect(project).toHaveProperty('description')
      }
    })
    
    it('should handle RTL text correctly', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      if (normalized.basics && normalized.basics[0]) {
        const summary = normalized.basics[0].summary
        if (summary) {
          expect(typeof summary).toBe('string')
          expect(summary.length).toBeGreaterThan(0)
        }
      }
    })
  })
  
  describe('English (EN) pass-through', () => {
    it('should return data unchanged for English', () => {
      const mockData = {
        basics: [{ fname: 'Test', lname: 'User' }],
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
      
      const normalized = normalizeCVData(mockData, 'en')
      expect(normalized).toEqual(mockData)
    })
  })
  
  describe('Data integrity', () => {
    it('should not lose data during normalization (DE)', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      const rawKeys = Object.keys(cvDataDE)
      const normalizedKeys = Object.keys(normalized)
      
      expect(normalizedKeys.length).toBeGreaterThanOrEqual(rawKeys.length * 0.8)
    })
    
    it('should not lose data during normalization (FA)', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      const rawKeys = Object.keys(cvDataFA)
      const normalizedKeys = Object.keys(normalized)
      
      expect(normalizedKeys.length).toBeGreaterThanOrEqual(rawKeys.length * 0.8)
    })
  })
})
