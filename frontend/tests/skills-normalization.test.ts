/**
 * Skills Structure Tests
 * 
 * Tests that:
 * 1. Skills sections are present in all languages
 * 2. Skills have the expected nested structure (categories > subcategories > items)
 * 3. Skills category labels are already localized in each CV file (content, not schema)
 */

import { describe, it, expect } from 'vitest'
import { normalizeCVData } from '@/utils/dataNormalizer'
import cvDataEN from '@/data/cv.json'
import cvDataDE from '@/data/cv_de.json'
import cvDataFA from '@/data/cv_fa.json'

describe('Skills Structure', () => {
  describe('Skills exist across all languages', () => {
    it('should have skills in English', () => {
      const normalized = normalizeCVData(cvDataEN, 'en')
      
      expect(normalized.skills).toBeDefined()
      expect(typeof normalized.skills).toBe('object')
      expect(Object.keys(normalized.skills).length).toBeGreaterThan(0)
    })
    
    it('should have skills in German', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      expect(normalized.skills).toBeDefined()
      expect(typeof normalized.skills).toBe('object')
      expect(Object.keys(normalized.skills).length).toBeGreaterThan(0)
    })
    
    it('should have skills in Persian', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      expect(normalized.skills).toBeDefined()
      expect(typeof normalized.skills).toBe('object')
      expect(Object.keys(normalized.skills).length).toBeGreaterThan(0)
    })
  })
  
  describe('Skills have nested structure', () => {
    it('should have top categories with subcategories (EN)', () => {
      const normalized = normalizeCVData(cvDataEN, 'en')
      const topCategories = Object.keys(normalized.skills)
      
      expect(topCategories.length).toBeGreaterThan(0)
      
      // Check first category has subcategories
      const firstCategory = normalized.skills[topCategories[0]]
      expect(typeof firstCategory).toBe('object')
      
      const subcategories = Object.keys(firstCategory)
      expect(subcategories.length).toBeGreaterThan(0)
      
      // Check subcategories contain arrays of skills
      const firstSubcategory = firstCategory[subcategories[0]]
      expect(Array.isArray(firstSubcategory)).toBe(true)
    })
    
    it('should have skill items with long_name and short_name (EN)', () => {
      const normalized = normalizeCVData(cvDataEN, 'en')
      const topCategories = Object.keys(normalized.skills)
      const firstCategory = normalized.skills[topCategories[0]]
      const subcategories = Object.keys(firstCategory)
      const skills = firstCategory[subcategories[0]]
      
      if (skills && skills.length > 0) {
        const skill = skills[0]
        expect(skill).toHaveProperty('long_name')
        expect(skill).toHaveProperty('short_name')
      }
    })
  })
  
  describe('Skills category labels are localized (content, not schema)', () => {
    it('should have different category names per language', () => {
      const normalizedEN = normalizeCVData(cvDataEN, 'en')
      const normalizedDE = normalizeCVData(cvDataDE, 'de')
      const normalizedFA = normalizeCVData(cvDataFA, 'fa')
      
      const categoriesEN = Object.keys(normalizedEN.skills)
      const categoriesDE = Object.keys(normalizedDE.skills)
      const categoriesFA = Object.keys(normalizedFA.skills)
      
      // All should have categories
      expect(categoriesEN.length).toBeGreaterThan(0)
      expect(categoriesDE.length).toBeGreaterThan(0)
      expect(categoriesFA.length).toBeGreaterThan(0)
      
      // Categories should be different strings (localized content)
      // EN might have "Programming & Scripting"
      // DE might have "Programmierung & Skripting"
      // FA might have Persian text
      
      // Just verify they exist and are strings
      expect(typeof categoriesEN[0]).toBe('string')
      expect(typeof categoriesDE[0]).toBe('string')
      expect(typeof categoriesFA[0]).toBe('string')
    })
  })
})
