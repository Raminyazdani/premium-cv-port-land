/**
 * Offline Indicator Component
 * 
 * Shows a banner when the app is offline
 */

import { WifiSlash, ArrowClockwise } from '@phosphor-icons/react'
import { usePWA } from '@/context/PWAContext'
import { useTranslation } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

interface OfflineIndicatorProps {
  className?: string
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const { isOffline } = usePWA()
  const t = useTranslation()

  if (!isOffline) {
    return null
  }

  return (
    <div 
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-lg shadow-lg border border-yellow-200 dark:border-yellow-800",
        className
      )}
    >
      <WifiSlash size={18} weight="bold" />
      <span className="text-sm font-medium">
        {t.pwa?.offline_mode || 'You are offline'}
      </span>
    </div>
  )
}

/**
 * Update Available Banner Component
 * 
 * Shows when a new version of the app is available
 */

interface UpdateBannerProps {
  className?: string
}

export function UpdateBanner({ className }: UpdateBannerProps) {
  const { hasUpdate, updateApp } = usePWA()
  const t = useTranslation()

  if (!hasUpdate) {
    return null
  }

  return (
    <div 
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg shadow-lg border border-blue-200 dark:border-blue-800",
        className
      )}
    >
      <ArrowClockwise size={18} weight="bold" />
      <span className="text-sm font-medium">
        {t.pwa?.update_available || 'Update available'}
      </span>
      <button
        onClick={updateApp}
        className="ml-2 px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {t.pwa?.update_now || 'Update now'}
      </button>
    </div>
  )
}
