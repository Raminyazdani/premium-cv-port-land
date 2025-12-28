/**
 * PWA Context: Progressive Web App state management
 * 
 * Handles service worker registration, install prompts, and offline status
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAContextType {
  // Install state
  isInstallable: boolean
  isInstalled: boolean
  installApp: () => Promise<boolean>
  
  // Offline state
  isOffline: boolean
  
  // Update state
  hasUpdate: boolean
  updateApp: () => void
  
  // Service worker state
  isServiceWorkerReady: boolean
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [hasUpdate, setHasUpdate] = useState(false)
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  // Check if app is installed (standalone mode)
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      setIsInstalled(isStandalone)
    }
    
    checkInstalled()
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkInstalled)
    
    return () => mediaQuery.removeEventListener('change', checkInstalled)
  }, [])

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Listen for app installed
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          setIsServiceWorkerReady(true)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is ready
                  setHasUpdate(true)
                  setWaitingWorker(newWorker)
                }
              })
            }
          })
          
          // Check if there's already a waiting worker
          if (registration.waiting) {
            setHasUpdate(true)
            setWaitingWorker(registration.waiting)
          }
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error)
        })

      // Handle controller change (when skipWaiting is called)
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    }
  }, [])

  // Install app function
  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      return false
    }

    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice
    
    // Clear the prompt
    setDeferredPrompt(null)
    setIsInstallable(false)
    
    return outcome === 'accepted'
  }, [deferredPrompt])

  // Update app function
  const updateApp = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [waitingWorker])

  const value: PWAContextType = {
    isInstallable,
    isInstalled,
    installApp,
    isOffline,
    hasUpdate,
    updateApp,
    isServiceWorkerReady
  }

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  )
}

export function usePWA(): PWAContextType {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider')
  }
  return context
}
