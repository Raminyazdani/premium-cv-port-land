import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion'

interface ParallaxOptions {
  speed?: number // Speed factor (0.3 = 30% of scroll speed)
  disableOnMobile?: boolean
}

export function useParallax({ speed = 0.5, disableOnMobile = true }: ParallaxOptions = {}) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion || (disableOnMobile && isMobile)) {
      setOffset(0)
      return
    }

    let rafId: number | null = null
    let isIntersecting = false

    // Use IntersectionObserver to only animate when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          isIntersecting = entry.isIntersecting
          if (!isIntersecting) {
            setOffset(0)
          }
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(element)

    const handleScroll = () => {
      if (!isIntersecting) return

      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        const scrolled = window.scrollY
        const elementTop = rect.top + scrolled
        
        // Calculate offset based on scroll position and speed
        const parallaxOffset = (scrolled - elementTop) * (1 - speed)
        setOffset(parallaxOffset)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.unobserve(element)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [speed, prefersReducedMotion, disableOnMobile, isMobile])

  const style = {
    transform: `translateY(${offset}px)`,
    willChange: offset !== 0 ? 'transform' : 'auto',
  }

  return { ref, style, isActive: !prefersReducedMotion && !(disableOnMobile && isMobile) }
}

interface ParallaxLayerOptions {
  speed: number // Different speed for each layer
  disableOnMobile?: boolean
}

export function useParallaxLayers(
  layers: ParallaxLayerOptions[] = [
    { speed: 0.3 }, // Background
    { speed: 0.6 }, // Mid-ground
    { speed: 1.0 }, // Foreground
  ]
) {
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [offsets, setOffsets] = useState<number[]>(layers.map(() => 0))
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element || prefersReducedMotion || isMobile) {
      setOffsets(layers.map(() => 0))
      return
    }

    let rafId: number | null = null
    let isIntersecting = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          isIntersecting = entry.isIntersecting
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(element)

    const handleScroll = () => {
      if (!isIntersecting) return

      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        const scrolled = window.scrollY
        const elementTop = rect.top + scrolled
        
        const newOffsets = layers.map(layer => {
          return (scrolled - elementTop) * (1 - layer.speed)
        })
        
        setOffsets(newOffsets)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.unobserve(element)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [layers, prefersReducedMotion, isMobile])

  const getLayerStyle = (index: number) => ({
    transform: `translateY(${offsets[index] || 0}px)`,
    willChange: offsets[index] !== 0 ? 'transform' : 'auto',
  })

  return { 
    containerRef, 
    getLayerStyle,
    isActive: !prefersReducedMotion && !isMobile 
  }
}
