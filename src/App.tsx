import { Toaster } from 'sonner'
import { BasicsSection } from '@/components/sections/BasicsSection'
import { ProfilesSection } from '@/components/sections/ProfilesSection'

function App() {
  return (
    <>
      <BasicsSection />
      <ProfilesSection />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App