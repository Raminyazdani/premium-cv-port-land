import { Toaster } from 'sonner'
import { FilterProvider } from '@/context/FilterContext'
import { Header } from '@/components/sections/Header'
import { HeroSection } from '@/components/sections/HeroSection'
import { BasicsSection } from '@/components/sections/BasicsSection'
import { ProfilesSection } from '@/components/sections/ProfilesSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { LanguagesSection } from '@/components/sections/LanguagesSection'
import { WorkshopAndCertificationsSection } from '@/components/sections/WorkshopAndCertificationsSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ExperiencesSection } from '@/components/sections/ExperiencesSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { PublicationsSection } from '@/components/sections/PublicationsSection'
import { ReferencesSection } from '@/components/sections/ReferencesSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { Footer } from '@/components/sections/Footer'

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
          <BasicsSection />
          <ProfilesSection />
          <EducationSection />
          <ExperiencesSection />
          <ProjectsSection />
          <PublicationsSection />
          <LanguagesSection />
          <WorkshopAndCertificationsSection />
          <SkillsSection />
          <ReferencesSection />
          <ContactSection />
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </FilterProvider>
  )
}

export default App