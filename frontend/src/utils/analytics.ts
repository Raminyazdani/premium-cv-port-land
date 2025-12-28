/**
 * Analytics Utilities
 * 
 * Provides privacy-respecting analytics tracking with user consent.
 * Supports development mode logging and Do Not Track header respect.
 */

type EventCategory =
  | 'page_view'
  | 'section_scroll'
  | 'theme_change'
  | 'language_change'
  | 'filter_change'
  | 'pdf_download'
  | 'external_link'
  | 'contact_form'
  | 'project_view'
  | 'skill_interaction'

interface AnalyticsEvent {
  category: EventCategory
  action: string
  label?: string
  value?: number
  timestamp: number
}

interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
  respectDoNotTrack: boolean
  ga4MeasurementId?: string
}

// Default configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: true,
  debug: import.meta.env.DEV,
  respectDoNotTrack: true,
  ga4MeasurementId: undefined
}

// State
let config = { ...DEFAULT_CONFIG }
let consentGiven = false
let eventQueue: AnalyticsEvent[] = []

// Storage keys
const CONSENT_KEY = 'analytics_consent'
const CONSENT_TIMESTAMP_KEY = 'analytics_consent_timestamp'

/**
 * Check if Do Not Track is enabled
 */
export function isDoNotTrackEnabled(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  
  // Check various DNT implementations
  const dnt = 
    navigator.doNotTrack ||
    (window as Window & { doNotTrack?: string }).doNotTrack ||
    (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack
  
  return dnt === '1' || dnt === 'yes'
}

/**
 * Check if analytics is allowed (consent + no DNT)
 */
export function isAnalyticsAllowed(): boolean {
  if (!config.enabled) return false
  if (config.respectDoNotTrack && isDoNotTrackEnabled()) return false
  return consentGiven
}

/**
 * Initialize analytics with configuration
 */
export function initAnalytics(userConfig: Partial<AnalyticsConfig> = {}): void {
  config = { ...DEFAULT_CONFIG, ...userConfig }
  
  // Load consent from storage
  try {
    const storedConsent = localStorage.getItem(CONSENT_KEY)
    consentGiven = storedConsent === 'true'
    
    if (config.debug) {
      console.log('[Analytics] Initialized with config:', {
        ...config,
        consentGiven,
        dntEnabled: isDoNotTrackEnabled()
      })
    }
    
    // Process queued events if consent given
    if (consentGiven && eventQueue.length > 0) {
      eventQueue.forEach(event => sendEvent(event))
      eventQueue = []
    }
  } catch (e) {
    console.warn('[Analytics] Failed to read consent from storage:', e)
  }
}

/**
 * Set user consent for analytics
 */
export function setAnalyticsConsent(consent: boolean): void {
  consentGiven = consent
  
  try {
    localStorage.setItem(CONSENT_KEY, String(consent))
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, String(Date.now()))
    
    if (config.debug) {
      console.log('[Analytics] Consent set to:', consent)
    }
    
    // Process queued events if consent given
    if (consent && eventQueue.length > 0) {
      eventQueue.forEach(event => sendEvent(event))
      eventQueue = []
    }
  } catch (e) {
    console.warn('[Analytics] Failed to save consent to storage:', e)
  }
}

/**
 * Check if user has given consent
 */
export function hasAnalyticsConsent(): boolean {
  return consentGiven
}

/**
 * Revoke analytics consent and clear data
 */
export function revokeAnalyticsConsent(): void {
  consentGiven = false
  eventQueue = []
  
  try {
    localStorage.removeItem(CONSENT_KEY)
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY)
    
    if (config.debug) {
      console.log('[Analytics] Consent revoked')
    }
  } catch (e) {
    console.warn('[Analytics] Failed to clear consent from storage:', e)
  }
}

/**
 * Send event to analytics provider
 */
function sendEvent(event: AnalyticsEvent): void {
  // In debug mode, always log to console
  if (config.debug) {
    console.log('[Analytics] Event:', {
      category: event.category,
      action: event.action,
      label: event.label,
      value: event.value,
      timestamp: new Date(event.timestamp).toISOString()
    })
  }
  
  // In development mode, only log to console
  if (import.meta.env.DEV) {
    return
  }
  
  // Send to GA4 if configured
  if (config.ga4MeasurementId && typeof window !== 'undefined') {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
    if (gtag) {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      })
    }
  }
}

/**
 * Track an analytics event
 */
export function trackEvent(
  category: EventCategory,
  action: string,
  label?: string,
  value?: number
): void {
  const event: AnalyticsEvent = {
    category,
    action,
    label,
    value,
    timestamp: Date.now()
  }
  
  if (!isAnalyticsAllowed()) {
    // Queue event for later if consent might be given
    if (!config.respectDoNotTrack || !isDoNotTrackEnabled()) {
      eventQueue.push(event)
      // Keep queue size manageable
      if (eventQueue.length > 100) {
        eventQueue.shift()
      }
    }
    return
  }
  
  sendEvent(event)
}

/**
 * Track page view
 */
export function trackPageView(pagePath?: string, pageTitle?: string): void {
  trackEvent(
    'page_view',
    'view',
    pagePath || window.location.pathname,
    undefined
  )
}

/**
 * Track section scroll into view
 */
export function trackSectionView(sectionId: string): void {
  trackEvent('section_scroll', 'view', sectionId)
}

/**
 * Track theme change
 */
export function trackThemeChange(themeName: string): void {
  trackEvent('theme_change', 'change', themeName)
}

/**
 * Track language change
 */
export function trackLanguageChange(language: string): void {
  trackEvent('language_change', 'change', language)
}

/**
 * Track filter change
 */
export function trackFilterChange(filterName: string, filterValue: string): void {
  trackEvent('filter_change', 'change', `${filterName}:${filterValue}`)
}

/**
 * Track PDF download
 */
export function trackPdfDownload(documentName?: string): void {
  trackEvent('pdf_download', 'download', documentName || 'cv')
}

/**
 * Track external link click
 */
export function trackExternalLinkClick(url: string, linkText?: string): void {
  trackEvent('external_link', 'click', linkText || url)
}

/**
 * Track contact form submission
 */
export function trackContactFormSubmission(success: boolean): void {
  trackEvent('contact_form', success ? 'submit_success' : 'submit_error')
}

/**
 * Track project view/expand
 */
export function trackProjectView(projectTitle: string): void {
  trackEvent('project_view', 'expand', projectTitle)
}

/**
 * Track skill interaction (hover, click)
 */
export function trackSkillInteraction(skillName: string, action: 'hover' | 'click'): void {
  trackEvent('skill_interaction', action, skillName)
}

/**
 * Create an Intersection Observer for section tracking
 */
export function createSectionObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }
  
  const trackedSections = new Set<string>()
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const sectionId = entry.target.id
          if (sectionId && !trackedSections.has(sectionId)) {
            trackedSections.add(sectionId)
            trackSectionView(sectionId)
          }
        }
      })
    },
    {
      threshold: 0.5,
      rootMargin: '0px'
    }
  )
}

/**
 * Track external link clicks on the page
 * Call this once on page load
 */
export function setupExternalLinkTracking(): () => void {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    
    if (!link) return
    
    const href = link.getAttribute('href')
    if (!href) return
    
    // Check if external link
    try {
      const url = new URL(href, window.location.origin)
      if (url.origin !== window.location.origin) {
        trackExternalLinkClick(href, link.textContent || undefined)
      }
    } catch {
      // Invalid URL, ignore
    }
  }
  
  document.addEventListener('click', handleClick)
  
  // Return cleanup function
  return () => {
    document.removeEventListener('click', handleClick)
  }
}
