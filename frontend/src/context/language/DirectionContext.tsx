/**
 * Direction Context: RTL/LTR detection and DOM updates
 * 
 * Derives direction from the current language and updates DOM attributes.
 * This context is responsible for:
 * - Computing isRTL based on language
 * - Setting document.documentElement.dir and lang attributes
 */

import React, { createContext, useContext, useEffect } from 'react'
import { useLanguageState } from './LanguageStateContext'
import { isLanguageRTL, getLanguageDirection } from './languageConfig'

interface DirectionContextType {
  isRTL: boolean
  direction: 'ltr' | 'rtl'
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined)

/**
 * Applies HTML attributes for language and directionality
 */
function applyDirectionToDOM(lang: string, direction: 'ltr' | 'rtl') {
  const html = document.documentElement
  html.setAttribute('lang', lang)
  html.setAttribute('dir', direction)
}

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageState()
  
  const isRTL = isLanguageRTL(language)
  const direction = getLanguageDirection(language)

  // Apply direction to DOM when language changes
  useEffect(() => {
    applyDirectionToDOM(language, direction)
  }, [language, direction])

  const value = {
    isRTL,
    direction
  }

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  )
}

export function useDirection(): DirectionContextType {
  const context = useContext(DirectionContext)
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }
  return context
}
