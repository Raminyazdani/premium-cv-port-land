import React from 'react'
import { Toaster } from 'sonner'
import { BasicsSection } from '@/components/sections/BasicsSection'
import { ProfilesSection } from '@/components/sections/ProfilesSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { LanguagesSection } from '@/components/sections/LanguagesSection'
import { WorkshopAndCertificationsSection } from '@/components/sections/WorkshopAndCertificationsSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ExperiencesSection } from '@/components/sections/ExperiencesSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { PublicationsSection } from '@/components/sections/PublicationsSection'

function App() {
  return (
    <>
      <BasicsSection />
      <ProfilesSection />
      <EducationSection />
      <ExperiencesSection />
      <ProjectsSection />
      <PublicationsSection />
      <LanguagesSection />
      <WorkshopAndCertificationsSection />
      <SkillsSection />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App