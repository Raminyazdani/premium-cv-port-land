/**
 * Language Content Verification Test
 * 
 * This test verifies that all three languages (EN/DE/FA) load correctly
 * and display actual content in all sections. This is the comprehensive
 * verification test for the language switching fix.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'
import { CVDataProvider, useCVData } from '@/context/CVDataContext'
import { FilterProvider } from '@/context/FilterContext'

function TestDataComponent() {
  const { data, isValid, errors, warnings } = useCVData()
  
  return (
    <div data-testid="cv-data">
      <div data-testid="is-valid">{isValid ? 'true' : 'false'}</div>
      <div data-testid="errors-count">{errors.length}</div>
      <div data-testid="warnings-count">{warnings.length}</div>
      
      <div data-testid="basics-count">{Array.isArray(data.basics) ? data.basics.length : 0}</div>
      <div data-testid="profiles-count">{Array.isArray(data.profiles) ? data.profiles.length : 0}</div>
      <div data-testid="education-count">{Array.isArray(data.education) ? data.education.length : 0}</div>
      <div data-testid="experiences-count">{Array.isArray(data.experiences) ? data.experiences.length : 0}</div>
      <div data-testid="projects-count">{Array.isArray(data.projects) ? data.projects.length : 0}</div>
      <div data-testid="publications-count">{Array.isArray(data.publications) ? data.publications.length : 0}</div>
      <div data-testid="languages-count">{Array.isArray(data.languages) ? data.languages.length : 0}</div>
      <div data-testid="workshops-count">{Array.isArray(data.workshop_and_certifications) ? data.workshop_and_certifications.length : 0}</div>
      <div data-testid="references-count">{Array.isArray(data.references) ? data.references.length : 0}</div>
      
      {data.basics && data.basics[0] && (
        <>
          <div data-testid="basics-fname">{data.basics[0].fname}</div>
          <div data-testid="basics-lname">{data.basics[0].lname}</div>
          <div data-testid="basics-email">{data.basics[0].email}</div>
        </>
      )}
      
      {data.education && data.education[0] && (
        <>
          <div data-testid="education-institution">{data.education[0].institution}</div>
          <div data-testid="education-studyType">{data.education[0].studyType}</div>
        </>
      )}
      
      {data.projects && data.projects[0] && (
        <>
          <div data-testid="project-title">{data.projects[0].title}</div>
        </>
      )}
    </div>
  )
}

describe('Language Content Verification - All Three Languages', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  describe('English (EN) - Default Language', () => {
    it('should load English data with all sections populated', () => {
      localStorage.setItem('cv-language', 'en')
      
      const TestComponent = () => (
        <LanguageProvider>
          <CVDataProvider>
            <FilterProvider>
              <TestDataComponent />
            </FilterProvider>
          </CVDataProvider>
        </LanguageProvider>
      )
      
      const { getByTestId } = render(<TestComponent />)
      
      // Language and direction
      expect(document.documentElement.getAttribute('lang')).toBe('en')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      
      // Validation status
      expect(getByTestId('is-valid').textContent).toBe('true')
      expect(getByTestId('errors-count').textContent).toBe('0')
      
      // Section counts - all should have content
      expect(parseInt(getByTestId('basics-count').textContent || '0')).toBeGreaterThan(0)
      expect(parseInt(getByTestId('profiles-count').textContent || '0')).toBeGreaterThan(0)
      expect(parseInt(getByTestId('education-count').textContent || '0')).toBeGreaterThan(0)
      expect(parseInt(getByTestId('experiences-count').textContent || '0')).toBeGreaterThan(0)
      expect(parseInt(getByTestId('projects-count').textContent || '0')).toBeGreaterThan(0)
      expect(parseInt(getByTestId('publications-count').textContent || '0')).toBeGreaterThan(0)
      expect(parseInt(getByTestId('languages-count').textContent || '0')).toBeGreaterThan(0)
      expect(parseInt(getByTestId('workshops-count').textContent || '0')).toBeGreaterThan(0)
      
      // Verify actual content exists
      expect(getByTestId('basics-fname').textContent).toBeTruthy()
      expect(getByTestId('basics-lname').textContent).toBeTruthy()
      expect(getByTestId('basics-email').textContent).toContain('@')
      expect(getByTestId('education-institution').textContent).toBeTruthy()
      expect(getByTestId('project-title').textContent).toBeTruthy()
    })
    
    it('should have specific English content', () => {
      localStorage.setItem('cv-language', 'en')
      
      const TestComponent = () => (
        <LanguageProvider>
          <CVDataProvider>
            <TestDataComponent />
          </CVDataProvider>
        </LanguageProvider>
      )
      
      const { getByTestId } = render(<TestComponent />)
      
      expect(getByTestId('basics-fname').textContent).toBe('Ramin')
      expect(getByTestId('basics-lname').textContent).toBe('Yazdani')
    })
  })
  
  describe('German (DE) - Should Load and Normalize Correctly', () => {
    it('should load German data with all sections populated', () => {
      localStorage.setItem('cv-language', 'de')
      
      const TestComponent = () => (
        <LanguageProvider>
          <CVDataProvider>
            <FilterProvider>
              <TestDataComponent />
            </FilterProvider>
          </CVDataProvider>
        </LanguageProvider>
      )
      
      const { getByTestId } = render(<TestComponent />)
      
      // Language and direction (German is LTR)
      expect(document.documentElement.getAttribute('lang')).toBe('de')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      
      // Validation status
      expect(getByTestId('is-valid').textContent).toBe('true')
      expect(getByTestId('errors-count').textContent).toBe('0')
      
      // Section counts - all should have content
      const basicsCount = parseInt(getByTestId('basics-count').textContent || '0')
      const profilesCount = parseInt(getByTestId('profiles-count').textContent || '0')
      const educationCount = parseInt(getByTestId('education-count').textContent || '0')
      const experiencesCount = parseInt(getByTestId('experiences-count').textContent || '0')
      const projectsCount = parseInt(getByTestId('projects-count').textContent || '0')
      const publicationsCount = parseInt(getByTestId('publications-count').textContent || '0')
      const languagesCount = parseInt(getByTestId('languages-count').textContent || '0')
      const workshopsCount = parseInt(getByTestId('workshops-count').textContent || '0')
      
      console.log('German Content Counts:', {
        basics: basicsCount,
        profiles: profilesCount,
        education: educationCount,
        experiences: experiencesCount,
        projects: projectsCount,
        publications: publicationsCount,
        languages: languagesCount,
        workshops: workshopsCount
      })
      
      expect(basicsCount).toBeGreaterThan(0)
      expect(profilesCount).toBeGreaterThan(0)
      expect(educationCount).toBeGreaterThan(0)
      expect(experiencesCount).toBeGreaterThan(0)
      expect(projectsCount).toBeGreaterThan(0)
      expect(publicationsCount).toBeGreaterThan(0)
      expect(languagesCount).toBeGreaterThan(0)
      expect(workshopsCount).toBeGreaterThan(0)
      
      // Verify actual content exists (normalized to English keys)
      expect(getByTestId('basics-fname').textContent).toBeTruthy()
      expect(getByTestId('basics-lname').textContent).toBeTruthy()
      expect(getByTestId('basics-email').textContent).toContain('@')
      expect(getByTestId('education-institution').textContent).toBeTruthy()
      expect(getByTestId('project-title').textContent).toBeTruthy()
    })
    
    it('should have same person data as English (names)', () => {
      localStorage.setItem('cv-language', 'de')
      
      const TestComponent = () => (
        <LanguageProvider>
          <CVDataProvider>
            <TestDataComponent />
          </CVDataProvider>
        </LanguageProvider>
      )
      
      const { getByTestId } = render(<TestComponent />)
      
      // Names should be the same across languages
      expect(getByTestId('basics-fname').textContent).toBe('Ramin')
      expect(getByTestId('basics-lname').textContent).toBe('Yazdani')
    })
  })
  
  describe('Persian (FA) - Should Load and Normalize Correctly with RTL', () => {
    it('should load Persian data with all sections populated', () => {
      localStorage.setItem('cv-language', 'fa')
      
      const TestComponent = () => (
        <LanguageProvider>
          <CVDataProvider>
            <FilterProvider>
              <TestDataComponent />
            </FilterProvider>
          </CVDataProvider>
        </LanguageProvider>
      )
      
      const { getByTestId } = render(<TestComponent />)
      
      // Language and direction (Persian is RTL)
      expect(document.documentElement.getAttribute('lang')).toBe('fa')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      
      // Validation status
      expect(getByTestId('is-valid').textContent).toBe('true')
      expect(getByTestId('errors-count').textContent).toBe('0')
      
      // Section counts - all should have content
      const basicsCount = parseInt(getByTestId('basics-count').textContent || '0')
      const profilesCount = parseInt(getByTestId('profiles-count').textContent || '0')
      const educationCount = parseInt(getByTestId('education-count').textContent || '0')
      const experiencesCount = parseInt(getByTestId('experiences-count').textContent || '0')
      const projectsCount = parseInt(getByTestId('projects-count').textContent || '0')
      const publicationsCount = parseInt(getByTestId('publications-count').textContent || '0')
      const languagesCount = parseInt(getByTestId('languages-count').textContent || '0')
      const workshopsCount = parseInt(getByTestId('workshops-count').textContent || '0')
      
      console.log('Persian Content Counts:', {
        basics: basicsCount,
        profiles: profilesCount,
        education: educationCount,
        experiences: experiencesCount,
        projects: projectsCount,
        publications: publicationsCount,
        languages: languagesCount,
        workshops: workshopsCount
      })
      
      expect(basicsCount).toBeGreaterThan(0)
      expect(profilesCount).toBeGreaterThan(0)
      expect(educationCount).toBeGreaterThan(0)
      expect(experiencesCount).toBeGreaterThan(0)
      expect(projectsCount).toBeGreaterThan(0)
      expect(publicationsCount).toBeGreaterThan(0)
      expect(languagesCount).toBeGreaterThan(0)
      expect(workshopsCount).toBeGreaterThan(0)
      
      // Verify actual content exists (normalized to English keys)
      expect(getByTestId('basics-fname').textContent).toBeTruthy()
      expect(getByTestId('basics-lname').textContent).toBeTruthy()
      expect(getByTestId('basics-email').textContent).toContain('@')
      expect(getByTestId('education-institution').textContent).toBeTruthy()
      expect(getByTestId('project-title').textContent).toBeTruthy()
    })
    
    it('should have same person data as English (names)', () => {
      localStorage.setItem('cv-language', 'fa')
      
      const TestComponent = () => (
        <LanguageProvider>
          <CVDataProvider>
            <TestDataComponent />
          </CVDataProvider>
        </LanguageProvider>
      )
      
      const { getByTestId } = render(<TestComponent />)
      
      // Names should be the same across languages
      expect(getByTestId('basics-fname').textContent).toBe('Ramin')
      expect(getByTestId('basics-lname').textContent).toBe('Yazdani')
    })
  })
  
  describe('Cross-Language Consistency', () => {
    it('should have same number of sections across all languages', () => {
      const languages = ['en', 'de', 'fa']
      const results: Record<string, Record<string, number>> = {}
      
      languages.forEach(lang => {
        localStorage.setItem('cv-language', lang)
        
        const TestComponent = () => (
          <LanguageProvider>
            <CVDataProvider>
              <TestDataComponent />
            </CVDataProvider>
          </LanguageProvider>
        )
        
        const { getByTestId } = render(<TestComponent />)
        
        results[lang] = {
          basics: parseInt(getByTestId('basics-count').textContent || '0'),
          profiles: parseInt(getByTestId('profiles-count').textContent || '0'),
          education: parseInt(getByTestId('education-count').textContent || '0'),
          experiences: parseInt(getByTestId('experiences-count').textContent || '0'),
          projects: parseInt(getByTestId('projects-count').textContent || '0'),
          publications: parseInt(getByTestId('publications-count').textContent || '0'),
          languages: parseInt(getByTestId('languages-count').textContent || '0'),
          workshops: parseInt(getByTestId('workshops-count').textContent || '0')
        }
      })
      
      console.log('Cross-Language Comparison:', results)
      
      // All languages should have the same counts for core sections
      expect(results.en.basics).toBe(results.de.basics)
      expect(results.en.basics).toBe(results.fa.basics)
      
      expect(results.en.education).toBe(results.de.education)
      expect(results.en.education).toBe(results.fa.education)
      
      expect(results.en.projects).toBe(results.de.projects)
      expect(results.en.projects).toBe(results.fa.projects)
    })
  })
  
  describe('No Silent Failures', () => {
    it('should not have validation errors in any language', () => {
      const languages = ['en', 'de', 'fa']
      
      languages.forEach(lang => {
        localStorage.setItem('cv-language', lang)
        
        const TestComponent = () => (
          <LanguageProvider>
            <CVDataProvider>
              <TestDataComponent />
            </CVDataProvider>
          </LanguageProvider>
        )
        
        const { getByTestId } = render(<TestComponent />)
        
        expect(getByTestId('is-valid').textContent).toBe('true')
        expect(getByTestId('errors-count').textContent).toBe('0')
      })
    })
  })
})
