/**
 * Konami Code Context
 * Shares Konami code unlock state across components
 */

import { createContext, useContext, ReactNode } from 'react'
import { useKonamiCode } from '@/hooks/use-konami-code'

interface KonamiContextType {
  isUnlocked: boolean
  justUnlocked: boolean
  progress: number
}

const KonamiContext = createContext<KonamiContextType | undefined>(undefined)

export function KonamiProvider({ children }: { children: ReactNode }) {
  const konamiState = useKonamiCode()

  return (
    <KonamiContext.Provider value={konamiState}>
      {children}
    </KonamiContext.Provider>
  )
}

export function useKonami(): KonamiContextType {
  const context = useContext(KonamiContext)
  if (context === undefined) {
    throw new Error('useKonami must be used within a KonamiProvider')
  }
  return context
}
