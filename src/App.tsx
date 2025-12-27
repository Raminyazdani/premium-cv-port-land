import { lazy, Suspense } from 'react'
import { Toaster } from 'sonner'
import { FilterProvider } from '@/context/FilterContext'
import { Header } from '@/components/sections/Header'
import { HeroSection } from '@/components/sections/HeroSection'

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

function SectionSkeleton() {
  return (
    <div className="w-full py-16 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        <div className="h-4 w-80 bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
}

function App() {
  return (
    <FilterProvider>
      <div className="relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
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
    </FilterProvider>
  )
}

export default App