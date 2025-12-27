import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
  // Reset document attributes to ensure clean state between tests
  document.documentElement.removeAttribute('lang')
  document.documentElement.removeAttribute('dir')
  // Reset URL to remove language parameter (set by applyLanguageToDOM)
  window.history.replaceState({}, '', '/')
})

// Mock ResizeObserver for components that use it
global.ResizeObserver = class MockResizeObserver implements ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}
  observe(_target: Element, _options?: ResizeObserverOptions): void {}
  unobserve(_target: Element): void {}
  disconnect(): void {}
} as unknown as typeof ResizeObserver

global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: readonly number[] = []

  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
  
  observe(_target: Element): void {}
  unobserve(_target: Element): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
} as unknown as typeof IntersectionObserver
