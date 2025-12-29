/**
 * CV Data Context: Provides normalized CV data to all components
 * 
 * This context ensures all components access the correctly normalized
 * CV data for the current language, eliminating direct JSON imports.
 */

import React, { createContext, useContext, useMemo } from 'react'
import type { CVData } from '@/types/cv'
import { loadAndValidateData } from '@/utils/dataLoader'
import { useLanguage } from './LanguageContext'
import { logger } from '@/lib/logger'

interface CVDataContextType {
  data: CVData
  isValid: boolean
  errors: string[]
  warnings: string[]
}

const CVDataContext = createContext<CVDataContextType | undefined>(undefined)

export function CVDataProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  const cvDataState = useMemo(() => {
    logger.debug(`[CVDataContext] Starting data load for: ${language}`)
    const { data, validationResult } = loadAndValidateData(language)

    logger.group('📊 [CVDataContext] Data Summary')
    logger.debug('Language:', language)
    logger.debug('Data keys:', Object.keys(data))
    logger.debug('Validation result:', validationResult.isValid ? '✅ Valid' : '❌ Invalid')
    
    // Log each section
    const sections = [
      'basics', 'profiles', 'education', 'experiences', 'projects',
      'publications', 'skills', 'languages', 'workshop_and_certifications', 'references'
    ]
    
    sections.forEach(section => {
      const value = data[section]
      if (Array.isArray(value)) {
        logger.debug(`   ${section}: array[${value.length}]`)
      } else if (typeof value === 'object' && value !== null) {
        logger.debug(`   ${section}: object with ${Object.keys(value).length} keys`)
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

    return {
      data,
      isValid: validationResult.isValid,
      errors: validationResult.errors,
      warnings: validationResult.warnings
    }
  }, [language])

  return (
    <CVDataContext.Provider value={cvDataState}>
      {children}
    </CVDataContext.Provider>
  )
}

export function useCVData(): CVDataContextType {
  const context = useContext(CVDataContext)
  if (!context) {
    throw new Error('useCVData must be used within a CVDataProvider')
  }
  return context
}

/**
 * Convenience hook to get just the CV data
 */
export function useCV(): CVData {
  const { data } = useCVData()
  return data
}
