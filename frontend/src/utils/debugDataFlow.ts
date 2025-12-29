/**
 * DEBUG UTILITY: Data Flow Diagnostic
 * 
 * This file helps diagnose why content is not showing in sections.
 * Logs are controlled via VITE_DEBUG_CV=true environment variable.
 */

import type { CVData } from '@/types/cv'
import { logger } from '@/lib/logger'

export function logDataSummary(label: string, data: unknown) {
  logger.group(`🔍 [DEBUG] ${label}`)
  logger.debug('Type:', typeof data)
  logger.debug('Is Array:', Array.isArray(data))
  logger.debug('Is null/undefined:', data === null || data === undefined)
  
  if (data && typeof data === 'object') {
    if (Array.isArray(data)) {
      logger.debug('Array length:', data.length)
      if (data.length > 0) {
        logger.debug('First item:', data[0])
        logger.debug('First item keys:', Object.keys((data[0] as object) || {}))
      }
    } else {
      logger.debug('Object keys:', Object.keys(data))
      const firstKey = Object.keys(data)[0]
      if (firstKey) {
        logger.debug(`First key "${firstKey}" value type:`, typeof (data as Record<string, unknown>)[firstKey])
        logger.debug(`First key "${firstKey}" is array:`, Array.isArray((data as Record<string, unknown>)[firstKey]))
      }
    }
  }
  
  logger.groupEnd()
}

export function validateCVDataStructure(data: CVData): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Check basics
  if (!Array.isArray(data.basics)) {
    issues.push(`basics is not an array: ${typeof data.basics}`)
  } else if (data.basics.length === 0) {
    issues.push('basics array is empty')
  }
  
  // Check profiles
  if (!Array.isArray(data.profiles)) {
    issues.push(`profiles is not an array: ${typeof data.profiles}`)
  } else if (data.profiles.length === 0) {
    issues.push('profiles array is empty')
  }
  
  // Check education
  if (!Array.isArray(data.education)) {
    issues.push(`education is not an array: ${typeof data.education}`)
  } else if (data.education.length === 0) {
    issues.push('education array is empty')
  }
  
  // Check experiences
  if (!Array.isArray(data.experiences)) {
    issues.push(`experiences is not an array: ${typeof data.experiences}`)
  } else if (data.experiences.length === 0) {
    issues.push('experiences array is empty')
  }
  
  // Check projects
  if (!Array.isArray(data.projects)) {
    issues.push(`projects is not an array: ${typeof data.projects}`)
  } else if (data.projects.length === 0) {
    issues.push('projects array is empty')
  }
  
  // Check skills
  if (!data.skills || typeof data.skills !== 'object' || Array.isArray(data.skills)) {
    issues.push(`skills is not an object: ${typeof data.skills}`)
  } else if (Object.keys(data.skills).length === 0) {
    issues.push('skills object is empty')
  }
  
  // Check languages
  if (!Array.isArray(data.languages)) {
    issues.push(`languages is not an array: ${typeof data.languages}`)
  } else if (data.languages.length === 0) {
    issues.push('languages array is empty')
  }
  
  // Check workshop_and_certifications
  if (!Array.isArray(data.workshop_and_certifications)) {
    issues.push(`workshop_and_certifications is not an array: ${typeof data.workshop_and_certifications}`)
  } else if (data.workshop_and_certifications.length === 0) {
    issues.push('workshop_and_certifications array is empty')
  }
  
  // Check publications
  if (!Array.isArray(data.publications)) {
    issues.push(`publications is not an array: ${typeof data.publications}`)
  } else if (data.publications.length === 0) {
    issues.push('publications array is empty')
  }
  
  // Check references
  if (!Array.isArray(data.references)) {
    issues.push(`references is not an array: ${typeof data.references}`)
  } else if (data.references.length === 0) {
    issues.push('references array is empty')
  }
  
  return {
    isValid: issues.length === 0,
    issues
  }
}

export function logSectionRenderDecision(
  sectionName: string,
  data: unknown,
  filteredData: unknown,
  selectedFocus: string
) {
  logger.group(`📋 [RENDER] ${sectionName}`)
  logger.debug('Selected Focus:', selectedFocus)
  logger.debug('Raw data length:', Array.isArray(data) ? data.length : 'N/A (not array)')
  logger.debug('Filtered data length:', Array.isArray(filteredData) ? filteredData.length : 'N/A (not array)')
  
  if (Array.isArray(data) && data.length > 0) {
    logger.debug('First item type_key:', (data[0] as Record<string, unknown>)?.type_key)
  }
  
  if (Array.isArray(filteredData)) {
    if (filteredData.length === 0 && Array.isArray(data) && data.length > 0) {
      logger.warn('All items filtered out!')
      logger.debug('First raw item:', data[0])
    }
  }
  
  logger.groupEnd()
}
