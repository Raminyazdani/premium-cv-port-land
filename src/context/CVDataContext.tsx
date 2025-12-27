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
    const { data, validationResult } = loadAndValidateData(language)

    if (import.meta.env.DEV) {
      console.log(`🔄 [CVDataContext] Loading data for language: ${language}`)
      console.log(`📊 [CVDataContext] Data summary:`, {
        basics: Array.isArray(data.basics) ? data.basics.length : (data.basics ? 1 : 0),
        profiles: data.profiles?.length || 0,
        education: data.education?.length || 0,
        experiences: data.experiences?.length || 0,
        projects: data.projects?.length || 0,
        publications: data.publications?.length || 0,
        skills: Object.keys(data.skills || {}).length,
        languages: data.languages?.length || 0,
        certifications: data.workshop_and_certifications?.length || 0,
        references: data.references?.length || 0
      })
      
      // Additional diagnostic: show first item of each array section
      if (data.education && data.education.length > 0) {
        console.log(`📝 [CVDataContext] First education entry:`, data.education[0])
      } else {
        console.warn(`⚠️  [CVDataContext] Education array is empty or undefined`)
      }
      
      if (data.projects && data.projects.length > 0) {
        console.log(`📝 [CVDataContext] First project entry:`, data.projects[0])
      } else {
        console.warn(`⚠️  [CVDataContext] Projects array is empty or undefined`)
      }
      
      if (validationResult.errors.length > 0) {
        console.error('❌ CV Data validation errors:', validationResult.errors)
      }
      if (validationResult.warnings.length > 0) {
        console.warn('⚠️  CV Data validation warnings:', validationResult.warnings)
      }
    }

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
