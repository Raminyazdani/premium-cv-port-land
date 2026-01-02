/**
 * Data Normalizer: Validates CV data structure
 * 
 * NOTE: As of Issue 01, all CV files (cv.json, cv_de.json, cv_fa.json) 
 * use canonical English keys. No key transformation is needed.
 * 
 * This module now only provides type safety and basic validation.
 */

import type { CVData } from '@/types/cv'
import { logger } from '@/lib/logger'

export type Language = 'en' | 'de' | 'fa'

/**
 * Expected top-level sections in CV data (canonical schema)
 */
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
] as const

/**
 * Validates and returns CV data (no longer transforms keys)
 * 
 * All CV files now share canonical English schema, so we just validate
 * the structure and return the data as-is.
 * 
 * @param rawData - Raw CV data from JSON file
 * @param sourceLang - Language of the source file (for logging only)
 * @returns Validated CV data with canonical English keys
 */
export function normalizeCVData(rawData: any, sourceLang: Language): CVData {
  logger.debug(`[normalizeCVData] Loading CV data for language: ${sourceLang}`)
  
  if (!rawData || typeof rawData !== 'object') {
    logger.error(`[normalizeCVData] Invalid raw data: expected object, got ${typeof rawData}`)
    throw new Error('Invalid CV data: expected an object')
  }

  const dataKeys = Object.keys(rawData)
  logger.debug(`[normalizeCVData] CV data keys:`, dataKeys)
  
  // Validate that all expected sections exist
  const missingSections = EXPECTED_SECTIONS.filter(section => !(section in rawData))
  if (missingSections.length > 0) {
    logger.warn(`[normalizeCVData] Missing sections:`, missingSections)
  }
  
  // Log section types for debugging
  EXPECTED_SECTIONS.forEach(section => {
    const value = rawData[section]
    if (value !== undefined) {
      const typeInfo = Array.isArray(value) 
        ? `array[${value.length}]` 
        : typeof value === 'object' && value !== null
          ? `object[${Object.keys(value).length}]`
          : typeof value
      logger.debug(`[normalizeCVData]   ${section}: ${typeInfo}`)
    }
  })
  
  logger.debug(`[normalizeCVData] ✅ CV data loaded successfully`)
  
  // Return data as-is (already in canonical format)
  return rawData as CVData
}

/**
 * Validates normalized data structure
 * 
 * Checks that all expected sections are present.
 */
export function validateNormalizedData(data: CVData): {
  isValid: boolean
  missingKeys: string[]
  extraKeys: string[]
} {
  const expectedKeys = [...EXPECTED_SECTIONS]
  const actualKeys = Object.keys(data)
  
  const missingKeys = expectedKeys.filter(key => !(key in data))
  const extraKeys = actualKeys.filter(key => !expectedKeys.includes(key as any))
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    extraKeys
  }
}
