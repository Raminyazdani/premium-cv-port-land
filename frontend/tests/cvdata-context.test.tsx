/**
 * CVDataContext and Debug Logging Tests
 *
 * Tests for the refactored CVDataContext that follows Single Responsibility Principle:
 * - CVDataContext only manages state and provides data
 * - Debug logging is extracted to debugDataLoading utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { CVDataProvider, useCVData, useCV } from '@/context/CVDataContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { logDataLoadingDebug } from '@/utils/debugDataLoading'
import type { CVData } from '@/types/cv'

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider initialLang="en">
      <CVDataProvider>{children}</CVDataProvider>
    </LanguageProvider>
  )
}

describe('CVDataContext', () => {
  describe('useCVData hook', () => {
    it('provides data after loading', async () => {
      const { result } = renderHook(() => useCVData(), {
        wrapper: TestWrapper,
      })

      // Data should be available immediately (synchronous loading)
      expect(result.current.data).toBeDefined()
      expect(result.current.isValid).toBeDefined()
      expect(result.current.errors).toBeDefined()
      expect(result.current.warnings).toBeDefined()
    })

    it('returns valid data for English', async () => {
      const { result } = renderHook(() => useCVData(), {
        wrapper: TestWrapper,
      })

      expect(result.current.isValid).toBe(true)
      expect(result.current.errors).toHaveLength(0)
    })

    it('contains all required CV sections', async () => {
      const { result } = renderHook(() => useCVData(), {
        wrapper: TestWrapper,
      })

      const { data } = result.current
      expect(data.basics).toBeDefined()
      expect(data.profiles).toBeDefined()
      expect(data.education).toBeDefined()
      expect(data.experiences).toBeDefined()
      expect(data.projects).toBeDefined()
      expect(data.publications).toBeDefined()
      expect(data.skills).toBeDefined()
      expect(data.languages).toBeDefined()
      expect(data.workshop_and_certifications).toBeDefined()
      expect(data.references).toBeDefined()
    })

    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useCVData())
      }).toThrow('useCVData must be used within a CVDataProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('useCV hook', () => {
    it('returns just the CV data', async () => {
      const { result } = renderHook(() => useCV(), {
        wrapper: TestWrapper,
      })

      // Should return CVData directly, not the full context
      expect(result.current).toBeDefined()
      expect(result.current.basics).toBeDefined()
      // Should not have context properties
      expect((result.current as unknown as { isValid?: boolean }).isValid).toBeUndefined()
    })
  })

  describe('context value shape', () => {
    it('maintains backward compatible API', async () => {
      const { result } = renderHook(() => useCVData(), {
        wrapper: TestWrapper,
      })

      // Verify the exact shape of the context value
      const contextValue = result.current
      expect(typeof contextValue.data).toBe('object')
      expect(typeof contextValue.isValid).toBe('boolean')
      expect(Array.isArray(contextValue.errors)).toBe(true)
      expect(Array.isArray(contextValue.warnings)).toBe(true)
    })
  })
})

describe('debugDataLoading utility', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleGroupSpy: ReturnType<typeof vi.spyOn>
  let consoleGroupEndSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  // Helper to create mock CVData
  const createMockCVData = (): CVData => ({
    basics: [],
    profiles: [],
    education: [],
    experiences: [],
    projects: [],
    publications: [],
    skills: {},
    languages: [],
    workshop_and_certifications: [],
    references: [],
  })

  // Helper to create mock validation result
  const createMockValidationResult = () => ({
    isValid: true,
    errors: [] as string[],
    warnings: [] as string[],
  })

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {})
    consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleGroupSpy.mockRestore()
    consoleGroupEndSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  it('is a function', () => {
    expect(typeof logDataLoadingDebug).toBe('function')
  })

  it('accepts language, data, and validation result', () => {
    const mockData = createMockCVData()
    const mockValidationResult = createMockValidationResult()

    // Should not throw
    expect(() => {
      logDataLoadingDebug('en', mockData, mockValidationResult)
    }).not.toThrow()
  })

  it('handles all supported languages', () => {
    const mockData = createMockCVData()
    const mockValidationResult = createMockValidationResult()

    const languages: Array<'en' | 'de' | 'fa'> = ['en', 'de', 'fa']
    languages.forEach((lang) => {
      expect(() => {
        logDataLoadingDebug(lang, mockData, mockValidationResult)
      }).not.toThrow()
    })
  })
})
