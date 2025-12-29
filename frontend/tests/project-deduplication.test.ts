/**
 * Tests for project deduplication
 * 
 * Verifies:
 * - Deterministic behavior (same result every run)
 * - Exact duplicates are removed
 * - Near-duplicates (similar but not identical) are preserved
 * - First occurrence is kept (FIRST_WINS policy)
 * - Transparent reporting of removed items
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { deduplicateArray, deduplicateArrayWithDetails } from '../src/utils/dataValidator'

// Type definition for project items
interface Project {
  title: string
  url?: string
  description?: string
  type_key?: string[]
}

describe('Project Deduplication', () => {
  describe('deduplicateArray - Basic Functionality', () => {
    it('removes exact duplicates', () => {
      const projects: Project[] = [
        { title: 'Project A', url: 'https://example.com/a' },
        { title: 'Project B', url: 'https://example.com/b' },
        { title: 'Project A', url: 'https://example.com/a' }, // Exact duplicate
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Project A')
      expect(result[1].title).toBe('Project B')
    })

    it('keeps first occurrence (FIRST_WINS policy)', () => {
      const projects: Project[] = [
        { title: 'Duplicate', url: 'https://example.com', description: 'First version' },
        { title: 'Unique', url: 'https://unique.com', description: 'Unique project' },
        { title: 'Duplicate', url: 'https://example.com', description: 'Second version' },
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(2)
      expect(result[0].description).toBe('First version')
      expect(result[1].description).toBe('Unique project')
    })

    it('preserves near-duplicates with different URLs', () => {
      const projects: Project[] = [
        { title: 'Same Title', url: 'https://example.com/v1' },
        { title: 'Same Title', url: 'https://example.com/v2' }, // Different URL, should be kept
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(2)
      expect(result[0].url).toBe('https://example.com/v1')
      expect(result[1].url).toBe('https://example.com/v2')
    })

    it('preserves near-duplicates with different titles', () => {
      const projects: Project[] = [
        { title: 'Project Alpha', url: 'https://example.com' },
        { title: 'Project Beta', url: 'https://example.com' }, // Same URL, different title
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Project Alpha')
      expect(result[1].title).toBe('Project Beta')
    })

    it('handles projects with null/undefined URLs consistently', () => {
      const projects: Project[] = [
        { title: 'No URL Project' },
        { title: 'Different Project' },
        { title: 'No URL Project' }, // Same title, both have undefined URL - duplicate
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('No URL Project')
      expect(result[1].title).toBe('Different Project')
    })
  })

  describe('deduplicateArrayWithDetails - Detailed Reporting', () => {
    it('returns both deduplicated items and removed items', () => {
      const projects: Project[] = [
        { title: 'A', url: 'https://a.com' },
        { title: 'B', url: 'https://b.com' },
        { title: 'A', url: 'https://a.com' }, // Duplicate at index 2
        { title: 'C', url: 'https://c.com' },
        { title: 'B', url: 'https://b.com' }, // Duplicate at index 4
      ]

      const result = deduplicateArrayWithDetails(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result.items).toHaveLength(3)
      expect(result.removedItems).toHaveLength(2)
      
      // Verify removed items have correct indexes
      expect(result.removedItems[0].index).toBe(2)
      expect(result.removedItems[0].item.title).toBe('A')
      
      expect(result.removedItems[1].index).toBe(4)
      expect(result.removedItems[1].item.title).toBe('B')
    })

    it('returns empty removedItems array when no duplicates', () => {
      const projects: Project[] = [
        { title: 'A', url: 'https://a.com' },
        { title: 'B', url: 'https://b.com' },
        { title: 'C', url: 'https://c.com' },
      ]

      const result = deduplicateArrayWithDetails(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result.items).toHaveLength(3)
      expect(result.removedItems).toHaveLength(0)
    })

    it('includes the deduplication key in removedItems', () => {
      const projects: Project[] = [
        { title: 'Test', url: 'https://test.com' },
        { title: 'Test', url: 'https://test.com' }, // Duplicate
      ]

      const result = deduplicateArrayWithDetails(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result.removedItems[0].key).toBe(
        JSON.stringify({ title: 'Test', url: 'https://test.com' })
      )
    })
  })

  describe('Determinism', () => {
    it('produces the same result for multiple runs', () => {
      const projects: Project[] = [
        { title: 'A', url: 'https://a.com' },
        { title: 'B', url: 'https://b.com' },
        { title: 'A', url: 'https://a.com' },
        { title: 'C', url: 'https://c.com' },
        { title: 'B', url: 'https://b.com' },
        { title: 'D', url: 'https://d.com' },
      ]

      const getKey = (item: Project) => JSON.stringify({ title: item.title, url: item.url })

      // Run deduplication multiple times
      const results = Array.from({ length: 10 }, () =>
        deduplicateArray([...projects], getKey, 'projects')
      )

      // All results should be identical
      const firstResult = JSON.stringify(results[0])
      results.forEach((result, index) => {
        expect(JSON.stringify(result), `Run ${index + 1} should match`).toBe(firstResult)
      })

      // Verify expected output
      expect(results[0]).toHaveLength(4)
      expect(results[0].map(p => p.title)).toEqual(['A', 'B', 'C', 'D'])
    })

    it('maintains order of first occurrences', () => {
      const projects: Project[] = [
        { title: 'Z', url: 'https://z.com' },
        { title: 'A', url: 'https://a.com' },
        { title: 'M', url: 'https://m.com' },
        { title: 'A', url: 'https://a.com' }, // Duplicate
        { title: 'Z', url: 'https://z.com' }, // Duplicate
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      // Order should be Z, A, M (order of first occurrences)
      expect(result.map(p => p.title)).toEqual(['Z', 'A', 'M'])
    })
  })

  describe('Edge Cases', () => {
    it('handles empty array', () => {
      const result = deduplicateArray(
        [],
        item => JSON.stringify(item),
        'projects'
      )

      expect(result).toHaveLength(0)
    })

    it('handles single item array', () => {
      const projects: Project[] = [{ title: 'Only One', url: 'https://only.com' }]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Only One')
    })

    it('handles all duplicates', () => {
      const projects: Project[] = [
        { title: 'Same', url: 'https://same.com' },
        { title: 'Same', url: 'https://same.com' },
        { title: 'Same', url: 'https://same.com' },
        { title: 'Same', url: 'https://same.com' },
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Same')
    })

    it('handles case-sensitive comparison', () => {
      const projects: Project[] = [
        { title: 'Project', url: 'https://example.com' },
        { title: 'project', url: 'https://example.com' }, // Different case - not a duplicate
        { title: 'PROJECT', url: 'https://example.com' }, // Different case - not a duplicate
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      // All three are different because comparison is case-sensitive
      expect(result).toHaveLength(3)
    })

    it('handles special characters in titles and URLs', () => {
      const projects: Project[] = [
        { title: 'Test & Demo <script>', url: 'https://example.com/?a=1&b=2' },
        { title: 'Test & Demo <script>', url: 'https://example.com/?a=1&b=2' }, // Exact duplicate
        { title: 'Test & Demo', url: 'https://example.com/?a=1&b=2' }, // Different title - not duplicate
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(2)
    })

    it('handles unicode characters correctly', () => {
      const projects: Project[] = [
        { title: 'مشروع العربية', url: 'https://arabic.com' },
        { title: 'مشروع العربية', url: 'https://arabic.com' }, // Duplicate
        { title: 'Projet Français', url: 'https://french.com' },
        { title: 'プロジェクト', url: 'https://japanese.com' },
      ]

      const result = deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      expect(result).toHaveLength(3)
    })
  })

  describe('Logging Behavior', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>
    
    beforeEach(() => {
      // Mock console.log to capture debug output
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    })
    
    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    it('logs when DEBUG_CV is enabled', () => {
      // Enable debug mode
      process.env.DEBUG_CV = 'true'
      
      const projects: Project[] = [
        { title: 'A', url: 'https://a.com' },
        { title: 'A', url: 'https://a.com' }, // Duplicate
      ]

      deduplicateArray(
        projects,
        item => JSON.stringify({ title: item.title, url: item.url }),
        'projects'
      )

      // Check that debug logging was called - logger uses two arguments: prefix and message
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '🔍 [DEBUG]',
        expect.stringContaining('[Deduplication]')
      )
      
      // Clean up
      delete process.env.DEBUG_CV
    })
  })

  describe('Integration with Real CV Data', () => {
    it('correctly identifies the duplicate in English CV data', async () => {
      // Import the actual data loader
      const { loadAndValidateData } = await import('../src/utils/dataLoader')
      
      const result = loadAndValidateData('en')
      
      // Based on the JSON analysis, there should be 25 projects after deduplication (26 - 1)
      expect(result.data.projects).toHaveLength(25)
      
      // The duplicate "Cosmetic Shop Marketplace Template (Django)" should only appear once
      const cosmeticShopProjects = result.data.projects.filter(
        p => p.title === 'Cosmetic Shop Marketplace Template (Django)'
      )
      expect(cosmeticShopProjects).toHaveLength(1)
    })

    it('deduplication is consistent across all languages', async () => {
      const { loadAndValidateData } = await import('../src/utils/dataLoader')
      
      const enResult = loadAndValidateData('en')
      const deResult = loadAndValidateData('de')
      const faResult = loadAndValidateData('fa')
      
      // All languages should have the same number of projects after deduplication
      expect(enResult.data.projects.length).toBe(25)
      expect(deResult.data.projects.length).toBe(25)
      expect(faResult.data.projects.length).toBe(25)
    })

    it('validation reports duplicate correctly', async () => {
      const { loadAndValidateData } = await import('../src/utils/dataLoader')
      
      const result = loadAndValidateData('en')
      
      // The validation should have reported the duplicate
      const duplicateWarning = result.validationResult.warnings.find(
        w => w.includes('Duplicate project entry')
      )
      expect(duplicateWarning).toBeDefined()
      expect(duplicateWarning).toContain('index 3')
      expect(duplicateWarning).toContain('Cosmetic Shop Marketplace Template')
    })
  })
})
