import React from 'react'
import { Toaster } from 'sonner'
import { BasicsSection } from '@/components/sections/BasicsSection'
import { ProfilesSection } from '@/components/sections/ProfilesSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { LanguagesSection } from '@/components/sections/LanguagesSection'
import { WorkshopAndCertificationsSection } from '@/components/sections/WorkshopAndCertificationsSection'

function App() {
  return (
    <>
      <BasicsSection />
      <ProfilesSection />
      <EducationSection />
      <LanguagesSection />
      <WorkshopAndCertificationsSection />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App