import type { CVData } from '@/types/cv'
import { DataValidator } from './dataValidator'
import { normalizeCVData, type Language } from './dataNormalizer'
import { sanitizeData, sanitizeTypeKey } from './sanitizeData'
import cvDataEN from '@/data/cv.json'
import cvDataDE from '@/data/cv_de.json'
import cvDataFA from '@/data/cv_fa.json'
import { validateCVDataStructure } from './debugDataFlow'
import { logger } from '@/lib/logger'

export interface LoadDataResult {
  data: CVData
  validationResult: {
    isValid: boolean
    errors: string[]
    warnings: string[]
  }
}

/**
 * Loads CV data for the specified language
 */
export function loadCVDataForLanguage(lang: Language): unknown {
  switch (lang) {
    case 'de':
      return cvDataDE
    case 'fa':
      return cvDataFA
    case 'en':
    default:
      return cvDataEN
  }
}

/**
 * Logs debug info about raw data loading (dev mode only)
 */
function logRawDataInfo(rawData: unknown, lang: Language): void {
  logger.debug(`==================== LOADING DATA FOR LANGUAGE: ${lang} ====================`)
  logger.debug(`[PHASE 2] RAW DATA LOADING`)
  logger.debug(`   Language: ${lang}`)
  logger.debug(`   typeof rawData: ${typeof rawData}`)

  const rawDataObj = rawData && typeof rawData === 'object' && !Array.isArray(rawData)
    ? rawData as Record<string, unknown>
    : {}

  logger.debug(`   Raw data keys:`, Object.keys(rawDataObj))
  Object.keys(rawDataObj).forEach(key => {
    const value = rawDataObj[key]
    logger.debug(`   - ${key}: ${Array.isArray(value) ? `array[${value.length}]` : typeof value}`)
  })
}

/**
 * Logs debug info about sanitization results (dev mode only)
 */
function logSanitizationInfo(
  normalizedKeys: string[],
  normalized: CVData,
  sanitizedData: CVData
): void {
  logger.debug(`✅ [PHASE 3 - SANITIZATION] Complete`)
  normalizedKeys.forEach(key => {
    const value = sanitizedData[key as keyof CVData]
    const beforeValue = normalized[key as keyof CVData]
    const typeInfo = Array.isArray(value) ? `array[${value.length}]` : typeof value

    logger.debug(`   - ${key}: ${typeInfo}`)
    if (Array.isArray(value) && Array.isArray(beforeValue)) {
      if (beforeValue.length !== value.length) {
        logger.warn(`     Length changed: ${beforeValue.length} → ${value.length}`)
      }
    }
  })
  logger.debug(`==================== DATA LOADING COMPLETE ====================`)
}

/**
 * Loads, normalizes, validates, and sanitizes CV data for the specified language.
 *
 * Pipeline:
 * 1. Load raw JSON for language
 * 2. Normalize to canonical English schema
 * 3. Validate structure and data
 * 4. Sanitize (deduplicate, fix dates, clean type_keys)
 */
export function loadAndValidateData(lang: Language = 'en'): LoadDataResult {
  // Step 1: Load raw data
  const rawData = loadCVDataForLanguage(lang)
  logRawDataInfo(rawData, lang)

  // Step 2: Normalize to English schema
  logger.debug(`[PHASE 3] NORMALIZATION STARTING`)
  const normalized = normalizeCVData(rawData, lang)
  logger.debug(`✅ [PHASE 3] NORMALIZATION COMPLETE`)
  logger.debug(`   Normalized keys:`, Object.keys(normalized))

  // Step 3: Validate structure
  const structureValidation = validateCVDataStructure(normalized as CVData)
  if (!structureValidation.isValid) {
    logger.error(`[PHASE 3] STRUCTURE VALIDATION FAILED:`)
    structureValidation.issues.forEach(issue => logger.error(`   - ${issue}`))
  } else {
    logger.debug(`✅ [PHASE 3] Structure validation passed`)
  }

  // Step 3b: Validate data
  const validator = new DataValidator()
  const validationResult = validator.validate(normalized)

  if (validationResult.errors.length > 0) {
    logger.error('Data validation errors:', validationResult.errors)
  }
  if (validationResult.warnings.length > 0) {
    logger.warn('Data validation warnings:', validationResult.warnings)
  }

  // Step 4: Sanitize data
  logger.debug(`[PHASE 3 - SANITIZATION] Starting`)
  const sanitizedData = sanitizeData(normalized as CVData)
  logSanitizationInfo(Object.keys(normalized), normalized as CVData, sanitizedData)

  // Final validation
  const finalValidation = validateCVDataStructure(sanitizedData)
  if (!finalValidation.isValid) {
    logger.error(`[FINAL] SANITIZED DATA HAS ISSUES:`)
    finalValidation.issues.forEach(issue => logger.error(`   - ${issue}`))
  } else {
    logger.debug(`✅ [FINAL] Sanitized data structure is valid`)
  }

  return {
    data: sanitizedData,
    validationResult
  }
}

export function extractAllTypeKeys(data: CVData): string[] {
  const allKeys = new Set<string>(['Full CV'])

  const addKeys = (typeKey: string[] | Array<{name: string}> | undefined | null) => {
    const sanitized = sanitizeTypeKey(typeKey)
    sanitized.forEach(key => allKeys.add(key))
  }

  data.education?.forEach(item => addKeys(item?.type_key))
  data.workshop_and_certifications?.forEach(group => {
    group?.certifications?.forEach(cert => addKeys(cert?.type_key))
  })
  
  if (data.skills) {
    Object.values(data.skills).forEach(category => {
      if (category && typeof category === 'object') {
        Object.values(category).forEach(items => {
          if (Array.isArray(items)) {
            items.forEach(item => addKeys(item?.type_key))
          }
        })
      }
    })
  }

  data.experiences?.forEach(item => addKeys(item?.type_key))
  data.projects?.forEach(item => addKeys(item?.type_key))
  data.publications?.forEach(item => addKeys(item?.type_key))
  data.references?.forEach(item => addKeys(item?.type_key))

  return Array.from(allKeys).sort()
}
