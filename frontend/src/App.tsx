import { lazy, Suspense, useEffect, useCallback } from 'react'
import { Toaster } from 'sonner'
import { useFilter } from '@/context/FilterContext'
import { useLanguage, useTranslation } from '@/context/LanguageContext'
import { useCVData } from '@/context/CVDataContext'
import { useKonami } from '@/context/KonamiContext'
import { AppProviders } from '@/app/AppProviders'
import { Header } from '@/components/sections/Header'
import { HeroSection } from '@/components/sections/HeroSection'
import { CursorFollower } from '@/components/CursorFollower'
import { FloatingActionButton } from '@/components/FloatingActionButton'
import { ScrollProgressIndicator } from '@/components/ScrollProgressIndicator'
import { CelebrationAnimation } from '@/components/CelebrationAnimation'
import { PageCornerCurl } from '@/components/PageCornerCurl'
import { CookieConsentBanner } from '@/components/CookieConsentBanner'
import { OfflineIndicator, UpdateBanner } from '@/components/OfflineIndicator'
import { extractAllTypeKeys } from '@/utils/dataLoader'
import { initializeSEO } from '@/utils/seo'
import { initAnalytics, trackPageView, setupExternalLinkTracking, createSectionObserver } from '@/utils/analytics'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { SkeletonSection } from '@/components/ui/skeleton'
import { logger } from '@/lib/logger'

const BasicsSection = lazy(() => import('@/components/sections/BasicsSection').then(m => ({ default: m.BasicsSection })))
const ProfilesSection = lazy(() => import('@/components/sections/ProfilesSection').then(m => ({ default: m.ProfilesSection })))
const EducationSection = lazy(() => import('@/components/sections/EducationSection').then(m => ({ default: m.EducationSection })))
const LanguagesSection = lazy(() => import('@/components/sections/LanguagesSection').then(m => ({ default: m.LanguagesSection })))
const WorkshopAndCertificationsSection = lazy(() => import('@/components/sections/WorkshopAndCertificationsSection').then(m => ({ default: m.WorkshopAndCertificationsSection })))
const SkillsSection = lazy(() => import('@/components/sections/SkillsSection').then(m => ({ default: m.SkillsSection })))
const ExperiencesSection = lazy(() => import('@/components/sections/ExperiencesSection').then(m => ({ default: m.ExperiencesSection })))
const ProjectsSection = lazy(() => import('@/components/sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })))
const PublicationsSection = lazy(() => import('@/components/sections/PublicationsSection').then(m => ({ default: m.PublicationsSection })))
const ReferencesSection = lazy(() => import('@/components/sections/ReferencesSection').then(m => ({ default: m.ReferencesSection })))
const ContactSection = lazy(() => import('@/components/sections/ContactSection').then(m => ({ default: m.ContactSection })))
const Footer = lazy(() => import('@/components/sections/Footer').then(m => ({ default: m.Footer })))

const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })))
const ArticlesSection = lazy(() => import('@/components/ArticlesSection').then(m => ({ default: m.ArticlesSection })))

function SectionSkeleton() {
  return <SkeletonSection items={2} />
}

function AppContent() {
  const { setAvailableFocusOptions } = useFilter()
  const { data, isValid, errors, warnings } = useCVData()
  const { justUnlocked } = useKonami()
  const { language } = useLanguage()
  const t = useTranslation()

  // Initialize SEO when data or language changes
  useEffect(() => {
    if (data) {
      initializeSEO(data, language)
    }
  }, [data, language])

  // Initialize analytics and tracking
  useEffect(() => {
    initAnalytics({ debug: import.meta.env.DEV })
    trackPageView()
    
    // Setup external link tracking
    const cleanupLinks = setupExternalLinkTracking()
    
    // Setup section scroll tracking
    const observer = createSectionObserver()
    if (observer) {
      // Observe all sections with IDs
      const sections = document.querySelectorAll('section[id]')
      sections.forEach(section => observer.observe(section))
      
      return () => {
        cleanupLinks()
        observer.disconnect()
      }
    }
    
    return cleanupLinks
  }, [])

  useEffect(() => {
    if (errors.length > 0) {
      logger.error('Data validation errors:', errors)
    }
    if (warnings.length > 0) {
      logger.warn('Data validation warnings:', warnings)
    }

    const focusOptions = extractAllTypeKeys(data)
    setAvailableFocusOptions(focusOptions)
  }, [data, errors, warnings, setAvailableFocusOptions])

  if (!isValid) {
    logger.error('Data validation failed. Displaying with best effort.')
  }

  // Scroll to top handler for page corner curl
  const handleCornerClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return (
    <div className="relative">
      {/* Custom cursor follower */}
      <CursorFollower />
      
      {/* Scroll progress indicator */}
      <ScrollProgressIndicator />
      
      {/* Konami code celebration animation */}
      <CelebrationAnimation show={justUnlocked} />
      
      {/* Floating action button */}
      <FloatingActionButton />
      
      {/* Page corner curl effect */}
      <PageCornerCurl onClick={handleCornerClick} />
      
      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
      
      {/* PWA Indicators */}
      <OfflineIndicator />
      <UpdateBanner />
      
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        {t.a11y.skip_to_content}
      </a>
      <Header />
      <main id="main-content">
        <HeroSection />
        
        <Suspense fallback={<SectionSkeleton />}>
          <BasicsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProfilesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <EducationSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ExperiencesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <PublicationsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <LanguagesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <WorkshopAndCertificationsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <SkillsSection />
        </Suspense>

        {/* Testimonials Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <TestimonialsSection />
        </Suspense>
        
        {/* Articles Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ArticlesSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <ReferencesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-16" />}>
        <Footer />
      </Suspense>
      <Toaster position="bottom-right" />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App