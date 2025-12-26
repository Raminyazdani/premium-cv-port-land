/**
 * Theme Manager
 * Handles theme switching and persistence via localStorage
 */

export type ThemeName = 'normal' | 'academic' | 'apple' | 'dark' | 'bright' | 'futuristic'

export interface ThemeOption {
  id: ThemeName
  label: string
  description: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'Clean, professional, neutral palette'
  },
  {
    id: 'academic',
    label: 'Academic',
    description: 'Scholarly, serif-based, traditional feel'
  },
  {
    id: 'apple',
    label: 'Apple-like',
    description: 'Sleek, minimal, refined aesthetics'
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'High contrast, modern dark mode'
  },
  {
    id: 'bright',
    label: 'Bright',
    description: 'Vibrant, energetic, high saturation'
  },
  {
    id: 'futuristic',
    label: 'Futuristic',
    description: 'Tech-forward, neon accents, sci-fi vibe'
  }
]

const THEME_STORAGE_KEY = 'cv-theme-preference'
const DEFAULT_THEME: ThemeName = 'normal'

/**
 * Get the current theme from localStorage or default
 */
export function getStoredTheme(): ThemeName {
  if (typeof window === 'undefined') return DEFAULT_THEME
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && THEME_OPTIONS.some(opt => opt.id === stored)) {
      return stored as ThemeName
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
  }
  
  return DEFAULT_THEME
}

/**
 * Save theme preference to localStorage
 */
export function saveTheme(theme: ThemeName): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

/**
 * Apply theme to the document root element
 */
export function applyTheme(theme: ThemeName): void {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
}

/**
 * Set theme and persist preference
 */
export function setTheme(theme: ThemeName): void {
  applyTheme(theme)
  saveTheme(theme)
}

/**
 * Initialize theme on app load
 */
export function initializeTheme(): ThemeName {
  const theme = getStoredTheme()
  applyTheme(theme)
  return theme
}

/**
 * Get theme label by ID
 */
export function getThemeLabel(theme: ThemeName): string {
  return THEME_OPTIONS.find(opt => opt.id === theme)?.label || 'Normal'
}
