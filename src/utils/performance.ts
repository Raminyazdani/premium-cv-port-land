export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime
            if (lcp < 2500) {
              console.debug('✓ LCP: Good', lcp.toFixed(0) + 'ms')
            } else if (lcp < 4000) {
              console.warn('⚠ LCP: Needs improvement', lcp.toFixed(0) + 'ms')
            } else {
              console.error('✗ LCP: Poor', lcp.toFixed(0) + 'ms')
            }
          }

          if (entry.entryType === 'first-input') {
            const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime
            if (fid < 100) {
              console.debug('✓ FID: Good', fid.toFixed(0) + 'ms')
            } else if (fid < 300) {
              console.warn('⚠ FID: Needs improvement', fid.toFixed(0) + 'ms')
            } else {
              console.error('✗ FID: Poor', fid.toFixed(0) + 'ms')
            }
          }

          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            const cls = (entry as any).value
            if (cls > 0.1) {
              console.warn('⚠ CLS detected:', cls.toFixed(3))
            }
          }
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (e) {
      console.debug('Performance monitoring not supported')
    }
  }

  window.addEventListener('load', () => {
    if (performance && performance.timing) {
      const perfData = performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      const connectTime = perfData.responseEnd - perfData.requestStart
      const renderTime = perfData.domComplete - perfData.domLoading

      console.debug('⏱ Performance Metrics:')
      console.debug('  Page Load:', pageLoadTime + 'ms')
      console.debug('  Server Response:', connectTime + 'ms')
      console.debug('  Render Time:', renderTime + 'ms')
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

      console.debug('📊 Detailed Timing Metrics:')
      console.debug('  DNS Lookup:', metrics.dns.toFixed(0) + 'ms')
      console.debug('  TCP Connection:', metrics.tcp.toFixed(0) + 'ms')
      console.debug('  Time to First Byte:', metrics.ttfb.toFixed(0) + 'ms')
      console.debug('  Download:', metrics.download.toFixed(0) + 'ms')
      console.debug('  DOM Interactive:', metrics.domInteractive.toFixed(0) + 'ms')
      console.debug('  DOM Complete:', metrics.domComplete.toFixed(0) + 'ms')
      console.debug('  Load Complete:', metrics.loadComplete.toFixed(0) + 'ms')
    }
  })
}
