/**
 * Tests for use-reduced-motion hook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReducedMotion, getReducedMotionPreference } from '@/shared/hooks/use-reduced-motion'

describe('useReducedMotion', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>
  let addEventListenerSpy: ReturnType<typeof vi.fn>
  let removeEventListenerSpy: ReturnType<typeof vi.fn>
  let mediaQueryChangeHandler: ((event: MediaQueryListEvent) => void) | null = null

  beforeEach(() => {
    addEventListenerSpy = vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
      if (event === 'change') {
        mediaQueryChangeHandler = handler
      }
    })
    removeEventListenerSpy = vi.fn()

    mockMatchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
      media: query,
      onchange: null,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      dispatchEvent: vi.fn(),
    }))

    vi.stubGlobal('matchMedia', mockMatchMedia)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    mediaQueryChangeHandler = null
  })

  it('returns false when user does not prefer reduced motion', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when user prefers reduced motion', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('adds event listener on mount', () => {
    renderHook(() => useReducedMotion())
    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(() => useReducedMotion())
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('updates when preference changes', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    // Simulate preference change
    act(() => {
      if (mediaQueryChangeHandler) {
        mediaQueryChangeHandler({ matches: true } as MediaQueryListEvent)
      }
    })

    expect(result.current).toBe(true)
  })
})

describe('getReducedMotionPreference', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true when user prefers reduced motion', () => {
    expect(getReducedMotionPreference()).toBe(true)
  })

  it('returns false when user does not prefer reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      media: '',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))

    expect(getReducedMotionPreference()).toBe(false)
  })
})
