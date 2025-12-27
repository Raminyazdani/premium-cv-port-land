/**
 * Language Switching Smoke Test
 * 
 * Tests that language switching works without errors and RTL is applied correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'

describe('Language Switching', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset document attributes to ensure clean state
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
  })
  
  it('should load English by default', async () => {
    const TestComponent = () => {
      return (
        <LanguageProvider>
          <CVDataProvider>
            <div data-testid="test-content">Content</div>
          </CVDataProvider>
        </LanguageProvider>
      )
    }
    
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('en')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    })
  })
  
  it('should apply RTL for Persian', async () => {
    localStorage.setItem('cv-language', 'fa')
    
    const TestComponent = () => {
      return (
        <LanguageProvider>
          <CVDataProvider>
            <div data-testid="test-content">محتوا</div>
          </CVDataProvider>
        </LanguageProvider>
      )
    }
    
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('fa')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    })
  })
  
  it('should apply LTR for German', async () => {
    localStorage.setItem('cv-language', 'de')
    
    const TestComponent = () => {
      return (
        <LanguageProvider>
          <CVDataProvider>
            <div data-testid="test-content">Inhalt</div>
          </CVDataProvider>
        </LanguageProvider>
      )
    }
    
    render(<TestComponent />)
    
    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('de')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    })
  })
  
  it('should not crash when loading German data', () => {
    localStorage.setItem('cv-language', 'de')
    
    const TestComponent = () => {
      return (
        <LanguageProvider>
          <CVDataProvider>
            <FilterProvider>
              <div data-testid="test-content">Test</div>
            </FilterProvider>
          </CVDataProvider>
        </LanguageProvider>
      )
    }
    
    expect(() => render(<TestComponent />)).not.toThrow()
  })
  
  it('should not crash when loading Persian data', () => {
    localStorage.setItem('cv-language', 'fa')
    
    const TestComponent = () => {
      return (
        <LanguageProvider>
          <CVDataProvider>
            <FilterProvider>
              <div data-testid="test-content">Test</div>
            </FilterProvider>
          </CVDataProvider>
        </LanguageProvider>
      )
    }
    
    expect(() => render(<TestComponent />)).not.toThrow()
  })
})
