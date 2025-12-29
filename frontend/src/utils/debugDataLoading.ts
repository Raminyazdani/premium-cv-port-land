/**
 * Debug Logging Utility for CV Data Loading
 *
 * This module extracts debug logging concerns from CVDataContext,
 * following the Single Responsibility Principle.
 *
 * Debug output is controlled via VITE_DEBUG_CV=true environment variable.
 */

import type { CVData } from '@/types/cv'
import { logger } from '@/lib/logger'

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

type Language = 'en' | 'de' | 'fa'

/**
 * Logs debug information after CV data has been loaded
 */
export function logDataLoadingDebug(
  language: Language,
  data: CVData,
  validationResult: ValidationResult
): void {
  logger.debug(`[CVDataContext] Starting data load for: ${language}`)

  logger.group('📊 [CVDataContext] Data Summary')
  logger.debug('Language:', language)
  logger.debug('Data keys:', Object.keys(data))
  logger.debug(
    'Validation result:',
    validationResult.isValid ? '✅ Valid' : '❌ Invalid'
  )

  // Log each section
  const sections = [
    'basics',
    'profiles',
    'education',
    'experiences',
    'projects',
    'publications',
    'skills',
    'languages',
    'workshop_and_certifications',
    'references',
  ] as const

  sections.forEach((section) => {
    const value = data[section]
    if (Array.isArray(value)) {
      logger.debug(`   ${section}: array[${value.length}]`)
    } else if (typeof value === 'object' && value !== null) {
      logger.debug(
        `   ${section}: object with ${Object.keys(value).length} keys`
      )
    } else {
      logger.debug(`   ${section}: ${typeof value} (${value})`)
    }
  })

  // Specific checks for education and projects
  if (Array.isArray(data.education)) {
    if (data.education.length > 0) {
      logger.debug(`✅ Education has ${data.education.length} entries`)
      logger.debug('   First education item:', data.education[0])
    } else {
      logger.error('Education array is EMPTY!')
    }
  } else {
    logger.error('Education is NOT an array:', typeof data.education)
  }

  if (Array.isArray(data.projects)) {
    if (data.projects.length > 0) {
      logger.debug(`✅ Projects has ${data.projects.length} entries`)
      logger.debug('   First project item:', data.projects[0])
    } else {
      logger.error('Projects array is EMPTY!')
    }
  } else {
    logger.error('Projects is NOT an array:', typeof data.projects)
  }

  if (validationResult.errors.length > 0) {
    logger.error('Validation errors:', validationResult.errors)
  }
  if (validationResult.warnings.length > 0) {
    logger.warn('Validation warnings:', validationResult.warnings)
  }

  logger.groupEnd()
  logger.debug(`[CVDataContext] Data load complete for: ${language}`)
}
