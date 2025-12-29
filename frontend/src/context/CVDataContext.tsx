/**
 * CV Data Context: Provides normalized CV data to all components
 *
 * This context ensures all components access the correctly normalized
 * CV data for the current language, eliminating direct JSON imports.
 */

import React, { createContext, useContext, useMemo } from 'react'
import type { CVData } from '@/types/cv'
import { loadAndValidateData } from '@/utils/dataLoader'
import { logDataLoadingDebug } from '@/utils/debugDataLoading'
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

    // Debug logging extracted to separate module
    logDataLoadingDebug(language, data, validationResult)

    return {
      data,
      isValid: validationResult.isValid,
      errors: validationResult.errors,
      warnings: validationResult.warnings,
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
