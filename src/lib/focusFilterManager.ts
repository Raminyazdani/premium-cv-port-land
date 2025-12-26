/**
 * Focus Filter Manager
 * Handles CV content filtering by type_key tags (Full CV, Programming, Biotechnology, Academic, etc.)
 */

export type FocusFilter = 'Full CV' | 'Programming' | 'Biotechnology' | 'Academic' | 'Bioinformatics' | 'Student Projects' | 'Robotics' | 'Embedded Systems'

export interface FocusFilterOption {
  id: FocusFilter
  label: string
  description: string
}

export const FOCUS_FILTER_OPTIONS: FocusFilterOption[] = [
  {
    id: 'Full CV',
    label: 'Full CV',
    description: 'Complete profile with all content'
  },
  {
    id: 'Programming',
    label: 'Programming',
    description: 'Software development & web projects'
  },
  {
    id: 'Biotechnology',
    label: 'Biotechnology',
    description: 'Laboratory & bioprocess work'
  },
  {
    id: 'Academic',
    label: 'Academic',
    description: 'Research & scholarly activities'
  },
  {
    id: 'Bioinformatics',
    label: 'Bioinformatics',
    description: 'Computational biology & omics'
  }
]

const FOCUS_FILTER_STORAGE_KEY = 'cv-focus-filter'
const DEFAULT_FOCUS_FILTER: FocusFilter = 'Full CV'

/**
 * Get the current focus filter from localStorage or default
 */
export function getStoredFocusFilter(): FocusFilter {
  if (typeof window === 'undefined') return DEFAULT_FOCUS_FILTER
  
  try {
    const stored = localStorage.getItem(FOCUS_FILTER_STORAGE_KEY)
    if (stored && FOCUS_FILTER_OPTIONS.some(opt => opt.id === stored)) {
      return stored as FocusFilter
    }
  } catch (error) {
    console.warn('Failed to read focus filter from localStorage:', error)
  }
  
  return DEFAULT_FOCUS_FILTER
}

/**
 * Save focus filter preference to localStorage
 */
export function saveFocusFilter(filter: FocusFilter): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(FOCUS_FILTER_STORAGE_KEY, filter)
  } catch (error) {
    console.warn('Failed to save focus filter to localStorage:', error)
  }
}

/**
 * Apply focus filter to the document root element
 */
export function applyFocusFilter(filter: FocusFilter): void {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  root.setAttribute('data-focus-filter', filter)
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('focusFilterChange', { detail: { filter } }))
}

/**
 * Set focus filter and persist preference
 */
export function setFocusFilter(filter: FocusFilter): void {
  applyFocusFilter(filter)
  saveFocusFilter(filter)
}

/**
 * Initialize focus filter on app load
 */
export function initializeFocusFilter(): FocusFilter {
  const filter = getStoredFocusFilter()
  applyFocusFilter(filter)
  return filter
}

/**
 * Get focus filter label by ID
 */
export function getFocusFilterLabel(filter: FocusFilter): string {
  return FOCUS_FILTER_OPTIONS.find(opt => opt.id === filter)?.label || 'Full CV'
}

/**
 * Check if an item should be visible based on its type_key array
 */
export function isVisibleWithFilter(typeKeys: string[] | null | undefined, currentFilter: FocusFilter): boolean {
  // Full CV shows everything
  if (currentFilter === 'Full CV') return true
  
  // If no type_key array, hide it by default when filtering
  if (!typeKeys || !Array.isArray(typeKeys)) return false
  
  // Show if the item includes the current filter in its type_key
  return typeKeys.includes(currentFilter)
}
