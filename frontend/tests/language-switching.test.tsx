/**
 * Language Switching Smoke Test
 * 
 * Tests that language switching works without errors and RTL is applied correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'

describe('Language Switching', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  it('should load English by default', () => {
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
    
    expect(document.documentElement.getAttribute('lang')).toBe('en')
    expect(document.documentElement.getAttribute('dir')).toBe('ltr')
  })
  
  it('should apply RTL for Persian', () => {
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
    
    expect(document.documentElement.getAttribute('lang')).toBe('fa')
    expect(document.documentElement.getAttribute('dir')).toBe('rtl')
  })
  
  it('should apply LTR for German', () => {
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
    
    expect(document.documentElement.getAttribute('lang')).toBe('de')
    expect(document.documentElement.getAttribute('dir')).toBe('ltr')
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
