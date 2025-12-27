import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FilterContextType {
  selectedFocus: string
  setSelectedFocus: (focus: string) => void
  availableFocusOptions: string[]
  setAvailableFocusOptions: (options: string[]) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

const STORAGE_KEY = 'cv-focus-filter'
const DEFAULT_FOCUS = 'Full CV'

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedFocus, setSelectedFocusState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored || DEFAULT_FOCUS
    }
    return DEFAULT_FOCUS
  })

  const [availableFocusOptions, setAvailableFocusOptions] = useState<string[]>([DEFAULT_FOCUS])

  const setSelectedFocus = (focus: string) => {
    setSelectedFocusState(focus)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, focus)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
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

export function shouldShowEntry(typeKey: string[] | undefined | null, selectedFocus: string): boolean {
  if (!typeKey || typeKey.length === 0) return true
  
  if (selectedFocus === DEFAULT_FOCUS || selectedFocus === 'Full CV') {
    return true
  }
  
  return typeKey.some(key => 
    key.toLowerCase().includes(selectedFocus.toLowerCase())
  )
}
