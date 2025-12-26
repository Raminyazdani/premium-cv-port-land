import React from 'react'
import { Toaster } from 'sonner'
import { BasicsSection } from '@/components/sections/BasicsSection'
import { ProfilesSection } from '@/components/sections/ProfilesSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { LanguagesSection } from '@/components/sections/LanguagesSection'

function App() {
  return (
    <>
      <BasicsSection />
      <ProfilesSection />
      <EducationSection />
      <LanguagesSection />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App