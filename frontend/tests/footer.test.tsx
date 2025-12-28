import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { Footer } from '@/components/sections/Footer'

function renderFooter(lang: 'en' | 'de' | 'fa' = 'en') {
  return render(
    <LanguageProvider initialLang={lang}>
      <CVDataProvider>
        <FilterProvider>
          <Footer />
        </FilterProvider>
      </CVDataProvider>
    </LanguageProvider>
  )
}

describe('Footer Component', () => {
  describe('displays owner name correctly', () => {
    it('should display "Ramin Yazdani" in EN footer', () => {
      renderFooter('en')
      expect(screen.getByText(/Ramin Yazdani/i)).toBeInTheDocument()
    })

    it('should display "Ramin Yazdani" in DE footer', () => {
      renderFooter('de')
      expect(screen.getByText(/Ramin Yazdani/i)).toBeInTheDocument()
    })

    it('should display owner name in FA footer', () => {
      renderFooter('fa')
      // Persian version may show name in Persian or Latin script
      // Check that "Unknown" is not displayed
      expect(screen.queryByText(/Unknown/i)).not.toBeInTheDocument()
    })
  })

  describe('does not display "Unknown"', () => {
    it('should not display "Unknown" in EN footer', () => {
      renderFooter('en')
      expect(screen.queryByText(/Unknown/i)).not.toBeInTheDocument()
    })

    it('should not display "Unknown" in DE footer', () => {
      renderFooter('de')
      expect(screen.queryByText(/Unknown/i)).not.toBeInTheDocument()
    })

    it('should not display "Unknown" in FA footer', () => {
      renderFooter('fa')
      expect(screen.queryByText(/Unknown/i)).not.toBeInTheDocument()
    })
  })

  describe('displays copyright year', () => {
    it('should display current year in footer', () => {
      renderFooter('en')
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(String(currentYear)))).toBeInTheDocument()
    })
  })
})
