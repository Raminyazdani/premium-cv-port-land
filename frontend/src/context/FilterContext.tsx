import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { STORAGE_KEYS, DEFAULT_VALUES } from '@/constants/app'

interface FilterContextType {
  selectedFocus: string
  setSelectedFocus: (focus: string) => void
  availableFocusOptions: string[]
  setAvailableFocusOptions: (options: string[]) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedFocus, setSelectedFocusState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.FOCUS_FILTER)
      return stored || DEFAULT_VALUES.FOCUS
    }
    return DEFAULT_VALUES.FOCUS
  })

  const [availableFocusOptions, setAvailableFocusOptions] = useState<string[]>([DEFAULT_VALUES.FOCUS])

  const setSelectedFocus = (focus: string) => {
    setSelectedFocusState(focus)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FOCUS_FILTER, focus)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.FOCUS_FILTER)
      if (stored && stored !== selectedFocus) {
        setSelectedFocusState(stored)
      }
    }
  }, [])

  return (
    <FilterContext.Provider
      value={{
        selectedFocus,
        setSelectedFocus,
        availableFocusOptions,
        setAvailableFocusOptions,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}

/**
 * Determines whether an entry should be visible based on its type_key and the selected filter.
 * 
 * Logic:
 * - If typeKey is empty/null, always show (no filtering applied)
 * - If selectedFocus is "Full CV", show all entries
 * - Otherwise, show only if any typeKey value contains the selectedFocus (case-insensitive)
 * 
 * @param typeKey - Array of type keys from CV entry (e.g., ["Programming", "Academic"])
 * @param selectedFocus - Currently selected filter value (e.g., "Programming", "Full CV")
 * @returns true if entry should be visible, false if it should be filtered out
 */
export function shouldShowEntry(typeKey: string[] | undefined | null, selectedFocus: string): boolean {
  if (!typeKey || typeKey.length === 0) return true
  
  if (selectedFocus === DEFAULT_VALUES.FOCUS || selectedFocus === 'Full CV') {
    return true
  }
  
  return typeKey.some(key => 
    key.toLowerCase().includes(selectedFocus.toLowerCase())
  )
}
