/**
 * PWA Install Button Component
 * 
 * Shows install button when app is installable
 */

import { Button } from '@/components/ui/button'
import { DownloadSimple, Check, DeviceMobile } from '@phosphor-icons/react'
import { usePWA } from '@/context/PWAContext'
import { useTranslation } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

interface PWAInstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showText?: boolean
}

export function PWAInstallButton({ 
  variant = 'outline', 
  size = 'default',
  className,
  showText = true 
}: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, installApp } = usePWA()
  const t = useTranslation()

  // Don't show if already installed
  if (isInstalled) {
    return showText ? (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <Check size={16} weight="bold" className="text-green-500" />
        <span>{t.pwa?.installed || 'App installed'}</span>
      </div>
    ) : null
  }

  // Don't show if not installable
  if (!isInstallable) {
    return null
  }

  const handleInstall = async () => {
    await installApp()
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleInstall}
      className={cn("gap-2", className)}
      aria-label={t.pwa?.install_app || 'Install app'}
    >
      {size === 'icon' ? (
        <DownloadSimple size={18} weight="bold" />
      ) : (
        <>
          <DeviceMobile size={18} weight="bold" />
          {showText && <span>{t.pwa?.install_app || 'Install App'}</span>}
        </>
      )}
    </Button>
  )
}
