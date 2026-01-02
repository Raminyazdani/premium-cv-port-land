/**
 * Skills Category Normalization Tests (F-02 + F-10)
 * 
 * Tests that:
 * 1. Skills categories are normalized to canonical English keys
 * 2. Display labels are correct for each language
 */

import { describe, it, expect } from 'vitest'
import { normalizeCVData } from '@/utils/dataNormalizer'
import { 
  getCanonicalSkillCategoryKey, 
  getSkillCategoryDisplayLabel,
  SKILL_TOP_CATEGORY_MAPPINGS,
  SKILL_SUB_CATEGORY_MAPPINGS
} from '@/config/skillCategoryMappings'
import cvDataEN from '@/data/cv.json'
import cvDataDE from '@/data/cv_de.json'
import cvDataFA from '@/data/cv_fa.json'

describe('Skills Category Normalization (F-02)', () => {
  describe('Canonical key mapping', () => {
    it('should normalize German skill categories to English canonical keys', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      
      // Get the normalized skill categories
      const topCategories = Object.keys(normalized.skills || {})
      
      // Should have canonical English keys, not German keys
      expect(topCategories).toContain('Programming & Scripting')
      expect(topCategories).not.toContain('programmierung_und_skripting')
      
      expect(topCategories).toContain('DevOps & Infrastructure')
      expect(topCategories).not.toContain('devops_und_infrastruktur')
      
      expect(topCategories).toContain('Soft Skills')
      expect(topCategories).not.toContain('soft_skills')
    })
    
    it('should normalize Persian skill categories to English canonical keys', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      
      const topCategories = Object.keys(normalized.skills || {})
      
      // Should have canonical English keys, not Persian keys
      expect(topCategories).toContain('Programming & Scripting')
      expect(topCategories).not.toContain('برنامه‌نویسی_و_اسکریپت‌نویسی')
      
      expect(topCategories).toContain('Bioinformatics Domains')
      expect(topCategories).not.toContain('حوزه‌های_بیوانفورماتیک')
    })
    
    it('should normalize German subcategories to English canonical keys', () => {
      const normalized = normalizeCVData(cvDataDE, 'de')
      const skills = normalized.skills || {}
      
      // Check Programming & Scripting subcategories
      const programmingSubcats = Object.keys(skills['Programming & Scripting'] || {})
      
      expect(programmingSubcats).toContain('Programming Languages')
      expect(programmingSubcats).not.toContain('programmiersprachen')
      
      expect(programmingSubcats).toContain('Machine Learning & Data Science')
      expect(programmingSubcats).not.toContain('maschinelles_lernen_und_data_science')
    })
    
    it('should normalize Persian subcategories to English canonical keys', () => {
      const normalized = normalizeCVData(cvDataFA, 'fa')
      const skills = normalized.skills || {}
      
      const programmingSubcats = Object.keys(skills['Programming & Scripting'] || {})
      
      expect(programmingSubcats).toContain('Programming Languages')
      expect(programmingSubcats).not.toContain('زبان‌های_برنامه‌نویسی')
    })
    
    it('should preserve English skills unchanged', () => {
      const normalized = normalizeCVData(cvDataEN, 'en')
      
      // English should pass through unchanged
      const topCategories = Object.keys(normalized.skills || {})
      
      expect(topCategories).toContain('Programming & Scripting')
      expect(topCategories).toContain('DevOps & Infrastructure')
      expect(topCategories).toContain('Soft Skills')
    })
    
    it('should preserve all skill items during normalization', () => {
      const normalizedDE = normalizeCVData(cvDataDE, 'de')
      const normalizedFA = normalizeCVData(cvDataFA, 'fa')
      const normalizedEN = normalizeCVData(cvDataEN, 'en')
      
      // Count total skills in each normalized version
      const countSkills = (skills: Record<string, any>) => {
        let count = 0
        Object.values(skills || {}).forEach((category: any) => {
          Object.values(category || {}).forEach((items: any) => {
            if (Array.isArray(items)) {
              count += items.length
            }
          })
        })
        return count
      }
      
      const deCount = countSkills(normalizedDE.skills || {})
      const faCount = countSkills(normalizedFA.skills || {})
      const enCount = countSkills(normalizedEN.skills || {})
      
      // All should have the same number of skills
      expect(deCount).toBe(enCount)
      expect(faCount).toBe(enCount)
      expect(deCount).toBeGreaterThan(0)
    })
  })
  
  describe('getCanonicalSkillCategoryKey', () => {
    it('should return English key for German top category', () => {
      expect(getCanonicalSkillCategoryKey('programmierung_und_skripting', 'de', true))
        .toBe('Programming & Scripting')
      
      expect(getCanonicalSkillCategoryKey('soft_skills', 'de', true))
        .toBe('Soft Skills')
    })
    
    it('should return English key for Persian top category', () => {
      expect(getCanonicalSkillCategoryKey('برنامه‌نویسی_و_اسکریپت‌نویسی', 'fa', true))
        .toBe('Programming & Scripting')
      
      expect(getCanonicalSkillCategoryKey('مهارت‌های_نرم', 'fa', true))
        .toBe('Soft Skills')
    })
    
    it('should return same key for English', () => {
      expect(getCanonicalSkillCategoryKey('Programming & Scripting', 'en', true))
        .toBe('Programming & Scripting')
    })
    
    it('should return English key for German subcategory', () => {
      expect(getCanonicalSkillCategoryKey('programmiersprachen', 'de', false))
        .toBe('Programming Languages')
    })
    
    it('should return English key for Persian subcategory', () => {
      expect(getCanonicalSkillCategoryKey('زبان‌های_برنامه‌نویسی', 'fa', false))
        .toBe('Programming Languages')
    })
    
    it('should return original key if mapping not found', () => {
      expect(getCanonicalSkillCategoryKey('unmapped_category', 'de', true))
        .toBe('unmapped_category')
    })
  })
})

describe('Skills Display Labels (F-10)', () => {
  describe('getSkillCategoryDisplayLabel', () => {
    it('should return English display label for EN', () => {
      expect(getSkillCategoryDisplayLabel('Programming & Scripting', 'en'))
        .toBe('Programming & Scripting')
      
      expect(getSkillCategoryDisplayLabel('Soft Skills', 'en'))
        .toBe('Soft Skills')
    })
    
    it('should return German display label for DE', () => {
      expect(getSkillCategoryDisplayLabel('Programming & Scripting', 'de'))
        .toBe('Programmierung & Skripting')
      
      expect(getSkillCategoryDisplayLabel('Soft Skills', 'de'))
        .toBe('Soft Skills')
    })
    
    it('should return Persian display label for FA', () => {
      expect(getSkillCategoryDisplayLabel('Programming & Scripting', 'fa'))
        .toBe('برنامه‌نویسی و اسکریپت‌نویسی')
      
      expect(getSkillCategoryDisplayLabel('Soft Skills', 'fa'))
        .toBe('مهارت‌های نرم')
    })
    
    it('should return German subcategory display labels', () => {
      expect(getSkillCategoryDisplayLabel('Programming Languages', 'de'))
        .toBe('Programmiersprachen')
      
      expect(getSkillCategoryDisplayLabel('Machine Learning & Data Science', 'de'))
        .toBe('Maschinelles Lernen & Data Science')
    })
    
    it('should return Persian subcategory display labels', () => {
      expect(getSkillCategoryDisplayLabel('Programming Languages', 'fa'))
        .toBe('زبان‌های برنامه‌نویسی')
    })
    
    it('should return humanized key if display label not found', () => {
      expect(getSkillCategoryDisplayLabel('unknown_category', 'en'))
        .toBe('unknown category')
    })
  })
  
  describe('Display labels are language-appropriate', () => {
    it('should not show raw technical keys with underscores', () => {
      // Test all top category display labels
      Object.keys(SKILL_TOP_CATEGORY_MAPPINGS).forEach((canonicalKey) => {
        const deLabel = getSkillCategoryDisplayLabel(canonicalKey, 'de')
        const faLabel = getSkillCategoryDisplayLabel(canonicalKey, 'fa')
        
        // Display labels should NOT contain underscores (technical key format)
        expect(deLabel).not.toContain('_')
        expect(faLabel).not.toContain('_')
      })
    })
    
    it('should not show raw technical keys for subcategories', () => {
      Object.keys(SKILL_SUB_CATEGORY_MAPPINGS).forEach((canonicalKey) => {
        const deLabel = getSkillCategoryDisplayLabel(canonicalKey, 'de')
        const faLabel = getSkillCategoryDisplayLabel(canonicalKey, 'fa')
        
        // Display labels should NOT contain underscores
        expect(deLabel).not.toContain('_')
        expect(faLabel).not.toContain('_')
      })
    })
  })
  
  describe('Schema invariants', () => {
    it('should have at least one top category mapping', () => {
      const topCategoryCount = Object.keys(SKILL_TOP_CATEGORY_MAPPINGS).length
      expect(topCategoryCount).toBeGreaterThan(0)
    })
    
    it('should have all top category mappings with EN/DE/FA keys', () => {
      Object.entries(SKILL_TOP_CATEGORY_MAPPINGS).forEach(([key, mapping]) => {
        expect(mapping.en).toBeDefined()
        expect(mapping.de).toBeDefined()
        expect(mapping.fa).toBeDefined()
      })
    })
    
    it('should have all subcategory mappings with EN/DE/FA keys', () => {
      Object.entries(SKILL_SUB_CATEGORY_MAPPINGS).forEach(([key, mapping]) => {
        expect(mapping.en).toBeDefined()
        expect(mapping.de).toBeDefined()
        expect(mapping.fa).toBeDefined()
      })
    })
  })
})
