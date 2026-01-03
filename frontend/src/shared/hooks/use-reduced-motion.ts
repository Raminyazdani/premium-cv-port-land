/**
 * Shared hook for detecting user's reduced motion preference.
 * Uses the `prefers-reduced-motion` media query and listens for changes.
 * 
 * This hook provides a centralized way to respect user accessibility preferences
 * across all animation and transition components.
 */

import { useState, useEffect } from 'react'

/**
 * Hook to detect if user prefers reduced motion.
 * 
 * @returns boolean - true if user prefers reduced motion, false otherwise
 * 
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion()
 *   
 *   return (
 *     <div className={prefersReducedMotion ? '' : 'animate-fade-in'}>
 *       Content
 *     </div>
 *   )
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Static utility function to check reduced motion preference.
 * Useful for one-time checks outside of React components.
 * 
 * @returns boolean - true if user prefers reduced motion
 */
export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
