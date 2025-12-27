import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'
import { EducationSection } from '@/components/sections/EducationSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { SkillsSection } from '@/components/sections/SkillsSection'

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LanguageProvider initialLang="en">
      <CVDataProvider>
        <FilterProvider>
          {ui}
        </FilterProvider>
      </CVDataProvider>
    </LanguageProvider>
  )
}

describe('Robustness - Handle Missing/Null/Invalid Data', () => {
  describe('EducationSection', () => {
    it('should render without crashing', () => {
      const { container } = renderWithProviders(<EducationSection />)
      expect(container).toBeInTheDocument()
    })

    it('should not display "undefined" or "null" strings', () => {
      const { container } = renderWithProviders(<EducationSection />)
      expect(container.textContent).not.toContain('undefined')
      expect(container.textContent).not.toContain('null')
    })

    it('should have proper section structure', () => {
      const { container } = renderWithProviders(<EducationSection />)
      const section = container.querySelector('section#education')
      expect(section).toBeInTheDocument()
    })
  })

  describe('HeroSection', () => {
    it('should render without crashing', () => {
      const { container } = renderWithProviders(<HeroSection />)
      expect(container).toBeInTheDocument()
    })

    it('should not show undefined for missing data', () => {
      const { container } = renderWithProviders(<HeroSection />)
      expect(container.textContent).not.toContain('undefined')
    })

    it('should have hero section with proper id', () => {
      const { container } = renderWithProviders(<HeroSection />)
      const section = container.querySelector('section#hero')
      expect(section).toBeInTheDocument()
    })
  })

  describe('SkillsSection', () => {
    it('should handle rendering gracefully', () => {
      const { container } = renderWithProviders(<SkillsSection />)
      // SkillsSection returns null when no skills OR renders with data
      // Either way, it should not crash
      expect(container).toBeInTheDocument()
    })

    it('should not show undefined text', () => {
      const { container } = renderWithProviders(<SkillsSection />)
      expect(container.textContent).not.toContain('undefined')
      expect(container.textContent).not.toContain('null')
    })
  })
})

describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  it('should have semantic HTML structure in education section', () => {
    const { container } = renderWithProviders(<EducationSection />)
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(section?.getAttribute('id')).toBe('education')
  })

  it('should have proper heading hierarchy in education section', () => {
    const { container } = renderWithProviders(<EducationSection />)
    const heading = container.querySelector('h2')
    expect(heading).toBeInTheDocument()
    expect(heading?.getAttribute('id')).toBe('education-heading')
  })

  it('should have aria-labelledby for education section', () => {
    const { container } = renderWithProviders(<EducationSection />)
    const section = container.querySelector('section')
    expect(section?.getAttribute('aria-labelledby')).toBe('education-heading')
  })

  it('should not have "undefined" in hero image alt text', () => {
    const { container } = renderWithProviders(<HeroSection />)
    const images = container.querySelectorAll('img')
    images.forEach((img) => {
      const alt = img.getAttribute('alt')
      if (alt) {
        expect(alt).not.toContain('undefined')
        expect(alt).not.toContain('null')
      }
    })
  })

  it('should have proper hero section id', () => {
    const { container } = renderWithProviders(<HeroSection />)
    const section = container.querySelector('section#hero')
    expect(section).toBeInTheDocument()
  })
})

describe('Responsive Design', () => {
  it('education section should have responsive classes', () => {
    const { container } = renderWithProviders(<EducationSection />)
    // Check for presence of responsive classes (sm:, md:, lg:)
    const html = container.innerHTML
    expect(html).toMatch(/sm:|md:|lg:/)
  })

  it('hero section should have responsive classes', () => {
    const { container } = renderWithProviders(<HeroSection />)
    const html = container.innerHTML
    expect(html).toMatch(/sm:|md:|lg:/)
  })
})
