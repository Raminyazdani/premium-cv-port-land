/**
 * Cookie Consent Banner
 * 
 * A privacy-respecting cookie consent banner that allows users
 * to accept or decline analytics tracking.
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Cookie, ShieldCheck } from '@phosphor-icons/react'
import { 
  hasAnalyticsConsent, 
  setAnalyticsConsent, 
  isDoNotTrackEnabled 
} from '@/utils/analytics'
import { useLanguage, useTranslation } from '@/context/LanguageContext'

interface CookieConsentBannerProps {
  onAccept?: () => void
  onDecline?: () => void
}

export function CookieConsentBanner({ onAccept, onDecline }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [dntEnabled, setDntEnabled] = useState(false)
  const { isRTL } = useLanguage()
  const t = useTranslation()
  
  useEffect(() => {
    // Check if consent has already been given or if DNT is enabled
    // hasAnalyticsConsent is called to ensure localStorage is read
    hasAnalyticsConsent()
    const dnt = isDoNotTrackEnabled()
    
    setDntEnabled(dnt)
    
    // Only show banner if no consent decision has been made and DNT is not enabled
    // Check localStorage to see if user has made any decision
    const hasDecision = localStorage.getItem('analytics_consent') !== null
    
    if (!hasDecision && !dnt) {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
    
    // If DNT is enabled, show a brief notification
    if (dnt && !hasDecision) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
    
    return undefined
  }, [])
  
  const handleAccept = () => {
    setAnalyticsConsent(true)
    setIsVisible(false)
    onAccept?.()
  }
  
  const handleDecline = () => {
    setAnalyticsConsent(false)
    setIsVisible(false)
    onDecline?.()
  }
  
  const handleClose = () => {
    setIsVisible(false)
  }
  
  if (!isVisible) return null
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-5 duration-300`}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <Card className={`max-w-2xl mx-auto shadow-lg border-primary/20 ${isRTL ? 'rtl' : 'ltr'}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
              {dntEnabled ? (
                <ShieldCheck className="w-6 h-6" weight="fill" />
              ) : (
                <Cookie className="w-6 h-6" weight="fill" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 
                  id="cookie-consent-title"
                  className="text-base sm:text-lg font-semibold"
                >
                  {t.cookies?.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                  onClick={handleClose}
                  aria-label={t.cookies?.close}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p 
                id="cookie-consent-description"
                className="text-sm text-muted-foreground mb-4"
              >
                {dntEnabled ? t.cookies?.dntMessage : t.cookies?.message}
              </p>
              
              {!dntEnabled && (
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button
                    onClick={handleAccept}
                    size="sm"
                    className="min-w-[100px]"
                  >
                    {t.cookies?.accept}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDecline}
                    size="sm"
                    className="min-w-[100px]"
                  >
                    {t.cookies?.decline}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Hook to manage cookie consent state
 */
export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState(() => hasAnalyticsConsent())
  const [dntEnabled] = useState(() => isDoNotTrackEnabled())
  
  const grantConsent = () => {
    setAnalyticsConsent(true)
    setHasConsent(true)
  }
  
  const revokeConsent = () => {
    setAnalyticsConsent(false)
    setHasConsent(false)
  }
  
  return {
    hasConsent,
    dntEnabled,
    grantConsent,
    revokeConsent,
    isTrackingAllowed: hasConsent && !dntEnabled
  }
}
