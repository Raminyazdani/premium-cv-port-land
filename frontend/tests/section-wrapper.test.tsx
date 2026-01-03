/**
 * Tests for SectionWrapper component
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionWrapper } from '@/components/composites/SectionWrapper'
import { LanguageProvider } from '@/context/LanguageContext'
import { EmptySectionsProvider } from '@/context/EmptySectionsContext'

// Simple test icon component
function TestIcon() {
  return <svg data-testid="test-icon" />
}

// Helper function to render with providers (default: hide empty sections)
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LanguageProvider>
      <EmptySectionsProvider>
        {ui}
      </EmptySectionsProvider>
    </LanguageProvider>
  )
}

// Helper function to render with providers showing empty sections
function renderWithEmptyVisible(ui: React.ReactElement) {
  return render(
    <LanguageProvider>
      <EmptySectionsProvider initialShowEmpty={true}>
        {ui}
      </EmptySectionsProvider>
    </LanguageProvider>
  )
}

describe('SectionWrapper', () => {
  describe('Empty State with emptyBehavior="show"', () => {
    it('shows empty state when isEmpty is true and emptyBehavior is "show"', () => {
      renderWithProviders(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={true}
          emptyMessage="No items found"
          emptyBehavior="show"
        >
          <div>Content</div>
        </SectionWrapper>
      )

      // Check title is displayed
      expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument()
      // Check empty message is displayed
      expect(screen.getByText('No items found')).toBeInTheDocument()
      // Check icon is displayed
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      // Check children are NOT displayed in empty state
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    it('shows empty state without message when emptyMessage is not provided', () => {
      renderWithProviders(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={true}
          emptyBehavior="show"
        >
          <div>Content</div>
        </SectionWrapper>
      )

      expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument()
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })
  })

  describe('Empty State with emptyBehavior="hide"', () => {
    it('hides section when isEmpty is true and emptyBehavior is "hide"', () => {
      const { container } = renderWithEmptyVisible(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={true}
          emptyMessage="No items found"
          emptyBehavior="hide"
        >
          <div>Content</div>
        </SectionWrapper>
      )

      // Check section is NOT displayed
      expect(container.querySelector('section')).not.toBeInTheDocument()
    })
  })

  describe('Empty State with emptyBehavior="auto" (default)', () => {
    it('hides section by default when isEmpty is true and showEmptySections is false', () => {
      const { container } = renderWithProviders(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={true}
          emptyMessage="No items found"
        >
          <div>Content</div>
        </SectionWrapper>
      )

      // Check section is NOT displayed (default behavior is hide)
      expect(container.querySelector('section')).not.toBeInTheDocument()
    })

    it('shows empty state when isEmpty is true and showEmptySections context is true', () => {
      renderWithEmptyVisible(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={true}
          emptyMessage="No items found"
        >
          <div>Content</div>
        </SectionWrapper>
      )

      // Check empty state IS displayed
      expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument()
      expect(screen.getByText('No items found')).toBeInTheDocument()
    })
  })

  describe('Content State', () => {
    it('renders children when isEmpty is false', () => {
      renderWithProviders(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={false}
        >
          <div>Content</div>
        </SectionWrapper>
      )

      // Check title is displayed
      expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument()
      // Check content is displayed
      expect(screen.getByText('Content')).toBeInTheDocument()
      // Check icon is displayed
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('renders subtitle when provided', () => {
      renderWithProviders(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={false}
          subtitle="This is a subtitle"
        >
          <div>Content</div>
        </SectionWrapper>
      )

      expect(screen.getByText('This is a subtitle')).toBeInTheDocument()
    })

    it('renders separator between header and content', () => {
      const { container } = renderWithProviders(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={false}
        >
          <div>Content</div>
        </SectionWrapper>
      )

      // Check that separator is rendered (it uses data-slot attribute)
      expect(container.querySelector('[data-slot="separator-root"]')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper section id for navigation anchors', () => {
      const { container } = renderWithProviders(
        <SectionWrapper
          id="education"
          title="Education"
          icon={<TestIcon />}
          isEmpty={false}
        >
          <div>Content</div>
        </SectionWrapper>
      )

      const section = container.querySelector('section#education')
      expect(section).toBeInTheDocument()
    })

    it('has aria-labelledby linking heading to section', () => {
      const { container } = renderWithProviders(
        <SectionWrapper
          id="education"
          title="Education"
          icon={<TestIcon />}
          isEmpty={false}
        >
          <div>Content</div>
        </SectionWrapper>
      )

      const section = container.querySelector('section')
      expect(section?.getAttribute('aria-labelledby')).toBe('education-heading')
      
      const heading = container.querySelector('#education-heading')
      expect(heading).toBeInTheDocument()
      expect(heading?.textContent).toBe('Education')
    })
  })

  describe('RTL Support', () => {
    it('applies rtl class when in RTL language', () => {
      // Mock URL parameter for Persian language
      const url = new URL(window.location.href)
      url.searchParams.set('lang', 'fa')
      window.history.replaceState({}, '', url.toString())

      const { container } = render(
        <LanguageProvider>
          <EmptySectionsProvider>
            <SectionWrapper
              id="test-section"
              title="Test Title"
              icon={<TestIcon />}
              isEmpty={false}
            >
              <div>Content</div>
            </SectionWrapper>
          </EmptySectionsProvider>
        </LanguageProvider>
      )

      const section = container.querySelector('section')
      expect(section?.className).toContain('rtl')

      // Reset URL
      window.history.replaceState({}, '', '/')
    })

    it('does not apply rtl class for LTR languages', () => {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', 'en')
      window.history.replaceState({}, '', url.toString())

      const { container } = render(
        <LanguageProvider>
          <EmptySectionsProvider>
            <SectionWrapper
              id="test-section"
              title="Test Title"
              icon={<TestIcon />}
              isEmpty={false}
            >
              <div>Content</div>
            </SectionWrapper>
          </EmptySectionsProvider>
        </LanguageProvider>
      )

      const section = container.querySelector('section')
      expect(section?.className).not.toContain('rtl')

      // Reset URL
      window.history.replaceState({}, '', '/')
    })
  })

  describe('Custom Styling', () => {
    it('applies additional className to section', () => {
      const { container } = renderWithProviders(
        <SectionWrapper
          id="test-section"
          title="Test Title"
          icon={<TestIcon />}
          isEmpty={false}
          className="custom-class"
        >
          <div>Content</div>
        </SectionWrapper>
      )

      const section = container.querySelector('section')
      expect(section?.className).toContain('custom-class')
    })
  })
})
