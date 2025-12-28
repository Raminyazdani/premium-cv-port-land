/**
 * Custom Cursor Follower Hook
 * Tracks mouse position with smooth lerp interpolation
 * Only active on desktop (non-touch devices)
 */

import { useEffect, useRef, useState } from 'react'

interface CursorPosition {
  x: number
  y: number
}

interface CursorState {
  isHovering: boolean
  isClicking: boolean
  isTextSelection: boolean
}

export function useCursorFollower() {
  const [isActive, setIsActive] = useState(false)
  const cursorRef = useRef<CursorPosition>({ x: 0, y: 0 })
  const trailRef = useRef<CursorPosition>({ x: 0, y: 0 })
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    isTextSelection: false,
  })
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef<CursorPosition>({ x: 0, y: 0 })

  // Check if device is touch-capable and respects reduced motion
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Only activate on desktop (non-touch) devices with animations enabled
    if (!isTouchDevice && !prefersReducedMotion) {
      setIsActive(true)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  // Linear interpolation for smooth movement
  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor
  }

  // Animate cursor and trail with lerp
  useEffect(() => {
    if (!isActive) return

    const animate = () => {
      // Main cursor follows mouse with high lerp factor (fast)
      cursorRef.current.x = lerp(cursorRef.current.x, mouseRef.current.x, 0.2)
      cursorRef.current.y = lerp(cursorRef.current.y, mouseRef.current.y, 0.2)

      // Trail follows main cursor with low lerp factor (slow)
      trailRef.current.x = lerp(trailRef.current.x, cursorRef.current.x, 0.1)
      trailRef.current.y = lerp(trailRef.current.y, cursorRef.current.y, 0.1)

      // Update DOM elements
      const cursorEl = document.querySelector('[data-cursor="main"]') as HTMLElement
      const trailEl = document.querySelector('[data-cursor="trail"]') as HTMLElement

      if (cursorEl) {
        cursorEl.style.transform = `translate(${cursorRef.current.x}px, ${cursorRef.current.y}px)`
      }
      if (trailEl) {
        trailEl.style.transform = `translate(${trailRef.current.x}px, ${trailRef.current.y}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isActive])

  // Track mouse movement
  useEffect(() => {
    if (!isActive) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isActive])

  // Track hover state for interactive elements
  useEffect(() => {
    if (!isActive) return

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.role === 'button' ||
        target.closest('a, button, [role="button"]')

      const isTextElement =
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'H4' ||
        target.tagName === 'H5' ||
        target.tagName === 'H6'

      setCursorState(prev => ({
        ...prev,
        isHovering: !!isInteractive,
        isTextSelection: !isInteractive && !!isTextElement,
      }))
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.role === 'button' ||
        target.closest('a, button, [role="button"]')

      if (isInteractive) {
        setCursorState(prev => ({
          ...prev,
          isHovering: false,
          isTextSelection: false,
        }))
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isActive])

  // Track click state
  useEffect(() => {
    if (!isActive) return

    const handleMouseDown = () => {
      setCursorState(prev => ({ ...prev, isClicking: true }))
    }

    const handleMouseUp = () => {
      setCursorState(prev => ({ ...prev, isClicking: false }))
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isActive])

  return {
    isActive,
    cursorState,
  }
}
