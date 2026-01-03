/**
 * Combined Language Providers
 * 
 * Composes all language-related providers in the correct order.
 * This is used by the main LanguageProvider for backward compatibility.
 */

import React from 'react'
import { LanguageStateProvider } from './LanguageStateContext'
import { DirectionProvider } from './DirectionContext'

interface LanguageProvidersProps {
  children: React.ReactNode
}

/**
 * Combined provider that composes all language-related providers
 * in the correct dependency order:
 * 1. LanguageStateProvider - provides language state
 * 2. DirectionProvider - derives direction from language
 * 
 * Translation and Formatter hooks don't need providers - they just
 * use useLanguageState internally.
 */
export function LanguageProviders({ children }: LanguageProvidersProps) {
  return (
    <LanguageStateProvider>
      <DirectionProvider>
        {children}
      </DirectionProvider>
    </LanguageStateProvider>
  )
}
