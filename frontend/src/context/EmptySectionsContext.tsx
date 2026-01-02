/**
 * Empty Sections Context
 * 
 * Provides a configurable setting for how empty sections should be handled.
 * By default, empty sections are hidden. Users can toggle this to show
 * empty sections with localized empty state messages.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { STORAGE_KEYS } from '@/constants/app'

interface EmptySectionsContextType {
  /**
   * Whether to show empty sections with an empty state message.
   * When false (default), empty sections are hidden entirely.
   */
  showEmptySections: boolean
  /**
   * Toggle the showEmptySections setting.
   */
  setShowEmptySections: (show: boolean) => void
}

const EmptySectionsContext = createContext<EmptySectionsContextType | undefined>(undefined)

interface EmptySectionsProviderProps {
  children: ReactNode
  /**
   * Initial value for showEmptySections. Defaults to false (hide empty sections).
   */
  initialShowEmpty?: boolean
}

export function EmptySectionsProvider({ 
  children, 
  initialShowEmpty = false 
}: EmptySectionsProviderProps) {
  const [showEmptySections, setShowEmptySectionsState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.SHOW_EMPTY_SECTIONS)
      if (stored !== null) {
        return stored === 'true'
      }
    }
    return initialShowEmpty
  })

  const setShowEmptySections = (show: boolean) => {
    setShowEmptySectionsState(show)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SHOW_EMPTY_SECTIONS, String(show))
    }
  }

  // Sync with localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.SHOW_EMPTY_SECTIONS)
      if (stored !== null && (stored === 'true') !== showEmptySections) {
        setShowEmptySectionsState(stored === 'true')
      }
    }
  }, [])

  return (
    <EmptySectionsContext.Provider
      value={{
        showEmptySections,
        setShowEmptySections,
      }}
    >
      {children}
    </EmptySectionsContext.Provider>
  )
}

/**
 * Hook to access empty sections settings.
 * Must be used within an EmptySectionsProvider.
 */
export function useEmptySections() {
  const context = useContext(EmptySectionsContext)
  if (context === undefined) {
    throw new Error('useEmptySections must be used within an EmptySectionsProvider')
  }
  return context
}

/**
 * Hook that returns showEmptySections with a fallback default.
 * Safe to use outside of provider (will return false).
 */
export function useEmptySectionsSafe() {
  const context = useContext(EmptySectionsContext)
  return context?.showEmptySections ?? false
}
