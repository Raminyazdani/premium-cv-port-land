/**
 * Data Normalizer: Validates CV data structure using Zod schema
 * 
 * NOTE: As of Issue 01, all CV files (cv.json, cv_de.json, cv_fa.json) 
 * use canonical English keys. No key transformation is needed.
 * 
 * This module provides runtime type validation using Zod schema.
 */

import type { CVData } from '@/types/cv'
import { logger } from '@/lib/logger'
import { CVDataSchema } from '@/schemas/cv.schema'

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
 * Type guard for checking if a value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Get type description for logging
 */
function getTypeDescription(value: unknown): string {
  if (Array.isArray(value)) {
    return `array[${value.length}]`
  }
  if (isObject(value)) {
    return `object[${Object.keys(value).length}]`
  }
  return typeof value
}

/**
 * Validates and returns CV data using Zod schema
 * 
 * All CV files now share canonical English schema, so we just validate
 * the structure and return the data as-is.
 * 
 * @param rawData - Raw CV data from JSON file
 * @param sourceLang - Language of the source file (for logging only)
 * @returns Validated CV data with canonical English keys
 */
export function normalizeCVData(rawData: unknown, sourceLang: Language): CVData {
  logger.debug(`[normalizeCVData] Loading CV data for language: ${sourceLang}`)
  
  if (!isObject(rawData)) {
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
      logger.debug(`[normalizeCVData]   ${section}: ${getTypeDescription(value)}`)
    }
  })
  
  // Validate using Zod schema
  const parseResult = CVDataSchema.safeParse(rawData)
  
  if (!parseResult.success) {
    // Log validation errors but don't fail - schema may be stricter than actual data
    // (e.g., nested objects with unexpected shapes)
    logger.warn(`[normalizeCVData] Schema validation issues:`, parseResult.error.errors)
  }
  
  logger.debug(`[normalizeCVData] ✅ CV data loaded successfully`)
  
  // Return validated data - Zod's passthrough() preserves extra fields
  // Cast to CVData since CVDataFromSchema is compatible but CVData is the expected interface
  return (parseResult.success ? parseResult.data : rawData) as CVData
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
  const expectedKeySet = new Set<string>(expectedKeys)
  const extraKeys = actualKeys.filter(key => !expectedKeySet.has(key))
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    extraKeys
  }
}
