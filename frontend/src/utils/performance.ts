import { logger } from '@/lib/logger'

export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime
            if (lcp < 2500) {
              logger.debug('✓ LCP: Good', lcp.toFixed(0) + 'ms')
            } else if (lcp < 4000) {
              logger.warn('LCP: Needs improvement', lcp.toFixed(0) + 'ms')
            } else {
              logger.error('LCP: Poor', lcp.toFixed(0) + 'ms')
            }
          }

          if (entry.entryType === 'first-input') {
            const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime
            if (fid < 100) {
              logger.debug('✓ FID: Good', fid.toFixed(0) + 'ms')
            } else if (fid < 300) {
              logger.warn('FID: Needs improvement', fid.toFixed(0) + 'ms')
            } else {
              logger.error('FID: Poor', fid.toFixed(0) + 'ms')
            }
          }

          if (entry.entryType === 'layout-shift' && !(entry as { hadRecentInput?: boolean }).hadRecentInput) {
            const cls = (entry as { value?: number }).value ?? 0
            if (cls > 0.1) {
              logger.warn('CLS detected:', cls.toFixed(3))
            }
          }
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch {
      logger.debug('Performance monitoring not supported')
    }
  }

  window.addEventListener('load', () => {
    if (performance && performance.timing) {
      const perfData = performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      const connectTime = perfData.responseEnd - perfData.requestStart
      const renderTime = perfData.domComplete - perfData.domLoading

      logger.debug('⏱ Performance Metrics:')
      logger.debug('  Page Load:', pageLoadTime + 'ms')
      logger.debug('  Server Response:', connectTime + 'ms')
      logger.debug('  Render Time:', renderTime + 'ms')
    }
  })
}

export function preloadCriticalResources() {
  if (typeof document === 'undefined') return

  const criticalImages = document.querySelectorAll('[data-critical-image]')
  criticalImages.forEach((img) => {
    if (img instanceof HTMLImageElement && img.dataset.src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = img.dataset.src
      document.head.appendChild(link)
    }
  })
}

export function reportWebVitals() {
  if ('web-vital' in window) {
    return
  }

  window.addEventListener('DOMContentLoaded', () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigationTiming) {
      const metrics = {
        dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
        tcp: navigationTiming.connectEnd - navigationTiming.connectStart,
        ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
        download: navigationTiming.responseEnd - navigationTiming.responseStart,
        domInteractive: navigationTiming.domInteractive - navigationTiming.fetchStart,
        domComplete: navigationTiming.domComplete - navigationTiming.fetchStart,
        loadComplete: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
      }

      logger.debug('📊 Detailed Timing Metrics:')
      logger.debug('  DNS Lookup:', metrics.dns.toFixed(0) + 'ms')
      logger.debug('  TCP Connection:', metrics.tcp.toFixed(0) + 'ms')
      logger.debug('  Time to First Byte:', metrics.ttfb.toFixed(0) + 'ms')
      logger.debug('  Download:', metrics.download.toFixed(0) + 'ms')
      logger.debug('  DOM Interactive:', metrics.domInteractive.toFixed(0) + 'ms')
      logger.debug('  DOM Complete:', metrics.domComplete.toFixed(0) + 'ms')
      logger.debug('  Load Complete:', metrics.loadComplete.toFixed(0) + 'ms')
    }
  })
}
