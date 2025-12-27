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
import { Footer } from '@/components/sections/Footer'

function App() {
  return (
    <FilterProvider>
      <div className="relative">
        <Header />
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
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </FilterProvider>
  )
}

export default App