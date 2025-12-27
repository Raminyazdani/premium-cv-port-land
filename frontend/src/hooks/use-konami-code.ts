/**
 * Konami Code Hook
 * Detects the Konami code sequence: ↑ ↑ ↓ ↓ ← → ← → B A
 * Unlocks secret theme when detected
 */

import { useEffect, useState, useCallback } from 'react'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
]

const STORAGE_KEY = 'konami-code-unlocked'

export function useKonamiCode() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])
  const [justUnlocked, setJustUnlocked] = useState(false)

  // Check if already unlocked in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'true') {
        setIsUnlocked(true)
      }
    } catch (error) {
      console.warn('Failed to check Konami code unlock status:', error)
    }
  }, [])

  // Handle unlock
  const unlock = useCallback(() => {
    if (isUnlocked) return

    setIsUnlocked(true)
    setJustUnlocked(true)

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch (error) {
      console.warn('Failed to save Konami code unlock status:', error)
    }

    // Reset just unlocked flag after animation
    setTimeout(() => {
      setJustUnlocked(false)
    }, 3000)
  }, [isUnlocked])

  // Track key sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with text inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }

      setSequence(prev => {
        const newSequence = [...prev, e.code].slice(-KONAMI_CODE.length)

        // Check if sequence matches Konami code
        const matches = newSequence.every((key, index) => key === KONAMI_CODE[index])

        if (matches && newSequence.length === KONAMI_CODE.length) {
          unlock()
          return []
        }

        return newSequence
      })
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [unlock])

  // Reset sequence after timeout
  useEffect(() => {
    if (sequence.length === 0) return

    const timeout = setTimeout(() => {
      setSequence([])
    }, 2000)

    return () => clearTimeout(timeout)
  }, [sequence])

  return {
    isUnlocked,
    justUnlocked,
    progress: sequence.length / KONAMI_CODE.length,
  }
}
