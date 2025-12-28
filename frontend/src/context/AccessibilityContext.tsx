/**
 * Accessibility Context: Global accessibility state management
 * 
 * Handles accessibility preferences including:
 * - High contrast mode
 * - Font size controls
 * - Dyslexia-friendly font
 * - Reduced motion
 * - ARIA live region announcements
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

interface AccessibilityContextType {
  // Font size
  fontSize: number // percentage (100 = default)
  increaseFontSize: () => void
  decreaseFontSize: () => void
  resetFontSize: () => void
  
  // High contrast
  highContrast: boolean
  toggleHighContrast: () => void
  
  // Dyslexia font
  dyslexiaFont: boolean
  toggleDyslexiaFont: () => void
  
  // Reduced motion
  reducedMotion: boolean
  prefersReducedMotion: boolean
  
  // ARIA announcements
  announce: (message: string, priority?: 'polite' | 'assertive') => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const STORAGE_PREFIX = 'a11y-'
const MIN_FONT_SIZE = 75
const MAX_FONT_SIZE = 150
const FONT_SIZE_STEP = 10

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  // Refs for ARIA live regions
  const politeAnnouncerRef = useRef<HTMLDivElement>(null)
  const assertiveAnnouncerRef = useRef<HTMLDivElement>(null)

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const storedFontSize = localStorage.getItem(`${STORAGE_PREFIX}font-size`)
      if (storedFontSize) {
        setFontSize(Number(storedFontSize))
      }
      
      const storedHighContrast = localStorage.getItem(`${STORAGE_PREFIX}high-contrast`)
      if (storedHighContrast) {
        setHighContrast(storedHighContrast === 'true')
      }
      
      const storedDyslexiaFont = localStorage.getItem(`${STORAGE_PREFIX}dyslexia-font`)
      if (storedDyslexiaFont) {
        setDyslexiaFont(storedDyslexiaFont === 'true')
      }
    } catch (e) {
      console.warn('Failed to load accessibility preferences:', e)
    }
  }, [])

  // Detect system preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply font size to root element
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
    try {
      localStorage.setItem(`${STORAGE_PREFIX}font-size`, String(fontSize))
    } catch {
      // Ignore storage errors
    }
  }, [fontSize])

  // Apply high contrast mode
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast)
    try {
      localStorage.setItem(`${STORAGE_PREFIX}high-contrast`, String(highContrast))
    } catch {
      // Ignore storage errors
    }
  }, [highContrast])

  // Apply dyslexia-friendly font
  useEffect(() => {
    document.documentElement.classList.toggle('dyslexia-font', dyslexiaFont)
    try {
      localStorage.setItem(`${STORAGE_PREFIX}dyslexia-font`, String(dyslexiaFont))
    } catch {
      // Ignore storage errors
    }
  }, [dyslexiaFont])

  // Font size controls
  const increaseFontSize = useCallback(() => {
    setFontSize(prev => Math.min(MAX_FONT_SIZE, prev + FONT_SIZE_STEP))
  }, [])

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => Math.max(MIN_FONT_SIZE, prev - FONT_SIZE_STEP))
  }, [])

  const resetFontSize = useCallback(() => {
    setFontSize(100)
  }, [])

  // Toggle high contrast
  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev)
  }, [])

  // Toggle dyslexia font
  const toggleDyslexiaFont = useCallback(() => {
    setDyslexiaFont(prev => !prev)
  }, [])

  // ARIA live region announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = priority === 'assertive' ? assertiveAnnouncerRef.current : politeAnnouncerRef.current
    if (announcer) {
      // Clear and set to force announcement
      announcer.textContent = ''
      // Small delay to ensure announcement triggers
      setTimeout(() => {
        announcer.textContent = message
      }, 100)
    }
  }, [])

  const value: AccessibilityContextType = {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    highContrast,
    toggleHighContrast,
    dyslexiaFont,
    toggleDyslexiaFont,
    reducedMotion: prefersReducedMotion,
    prefersReducedMotion,
    announce
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {/* ARIA Live Regions */}
      <div
        ref={politeAnnouncerRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        ref={assertiveAnnouncerRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

/**
 * Hook for announcing dynamic content changes to screen readers
 */
export function useAnnounce() {
  const { announce } = useAccessibility()
  return announce
}
