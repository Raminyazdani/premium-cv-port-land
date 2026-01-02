/**
 * Tests for test-utils helper functions
 * 
 * Verifies that the renderWithProviders helper works correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders, renderWithMinimalProviders, createWrapper } from './test-utils'
import { renderHook, waitFor } from '@testing-library/react'
import { useLanguage, useTranslation } from '@/context/LanguageContext'
import { useCVData } from '@/context/CVDataContext'
import { useFilter } from '@/context/FilterContext'

describe('test-utils', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('dir')
    window.history.replaceState({}, '', '/')
  })

  describe('renderWithProviders', () => {
    it('should render with all providers', async () => {
      function TestComponent() {
        const { language } = useLanguage()
        const { data } = useCVData()
        const { selectedFocus } = useFilter()
        
        return (
          <div>
            <span data-testid="language">{language}</span>
            <span data-testid="has-data">{String(!!data)}</span>
            <span data-testid="focus">{selectedFocus}</span>
          </div>
        )
      }
      
      const { getByTestId } = renderWithProviders(<TestComponent />)
      
      await waitFor(() => {
        expect(getByTestId('language')).toHaveTextContent('en')
        expect(getByTestId('has-data')).toHaveTextContent('true')
        expect(getByTestId('focus')).toHaveTextContent('Full CV')
      })
    })

    it('should set language via providerOptions', async () => {
      function TestComponent() {
        const { language, isRTL } = useLanguage()
        const t = useTranslation()
        
        return (
          <div>
            <span data-testid="language">{language}</span>
            <span data-testid="is-rtl">{String(isRTL)}</span>
            <span data-testid="section-title">{t.sections.education}</span>
          </div>
        )
      }
      
      const { getByTestId } = renderWithProviders(
        <TestComponent />,
        { language: 'de' }
      )
      
      await waitFor(() => {
        expect(getByTestId('language')).toHaveTextContent('de')
        expect(getByTestId('is-rtl')).toHaveTextContent('false')
        expect(getByTestId('section-title')).toHaveTextContent('Ausbildung')
      })
    })

    it('should apply RTL for Persian', async () => {
      function TestComponent() {
        const { language, isRTL } = useLanguage()
        
        return (
          <div>
            <span data-testid="language">{language}</span>
            <span data-testid="is-rtl">{String(isRTL)}</span>
          </div>
        )
      }
      
      const { getByTestId } = renderWithProviders(
        <TestComponent />,
        { language: 'fa' }
      )
      
      await waitFor(() => {
        expect(getByTestId('language')).toHaveTextContent('fa')
        expect(getByTestId('is-rtl')).toHaveTextContent('true')
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      })
    })
  })

  describe('renderWithMinimalProviders', () => {
    it('should render with minimal providers', async () => {
      function TestComponent() {
        const { language } = useLanguage()
        const { data } = useCVData()
        const { selectedFocus } = useFilter()
        
        return (
          <div>
            <span data-testid="language">{language}</span>
            <span data-testid="has-data">{String(!!data)}</span>
            <span data-testid="focus">{selectedFocus}</span>
          </div>
        )
      }
      
      const { getByTestId } = renderWithMinimalProviders(<TestComponent />)
      
      await waitFor(() => {
        expect(getByTestId('language')).toHaveTextContent('en')
        expect(getByTestId('has-data')).toHaveTextContent('true')
        expect(getByTestId('focus')).toHaveTextContent('Full CV')
      })
    })

    it('should set language via providerOptions', async () => {
      function TestComponent() {
        const { language } = useLanguage()
        const t = useTranslation()
        
        return (
          <div>
            <span data-testid="language">{language}</span>
            <span data-testid="section-title">{t.sections.education}</span>
          </div>
        )
      }
      
      const { getByTestId } = renderWithMinimalProviders(
        <TestComponent />,
        { language: 'de' }
      )
      
      await waitFor(() => {
        expect(getByTestId('language')).toHaveTextContent('de')
        expect(getByTestId('section-title')).toHaveTextContent('Ausbildung')
      })
    })
  })

  describe('createWrapper', () => {
    it('should work with renderHook', () => {
      const wrapper = createWrapper('en')
      
      const { result } = renderHook(() => useLanguage(), { wrapper })
      
      expect(result.current.language).toBe('en')
      expect(result.current.isRTL).toBe(false)
    })

    it('should set language correctly for German', () => {
      const wrapper = createWrapper('de')
      
      const { result } = renderHook(() => useLanguage(), { wrapper })
      
      expect(result.current.language).toBe('de')
      expect(result.current.isRTL).toBe(false)
    })

    it('should set RTL for Persian', () => {
      const wrapper = createWrapper('fa')
      
      const { result } = renderHook(() => useLanguage(), { wrapper })
      
      expect(result.current.language).toBe('fa')
      expect(result.current.isRTL).toBe(true)
    })
  })
})
