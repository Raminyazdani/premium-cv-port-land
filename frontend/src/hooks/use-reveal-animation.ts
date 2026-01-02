/**
 * Section Reveal Animations Hook
 * Uses Intersection Observer to trigger entrance animations on scroll
 * Respects prefers-reduced-motion preference
 */

import { useEffect, useRef, useState } from 'react'

export type AnimationStyle =
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'scale-in'
  | 'pop-in'

interface UseRevealAnimationOptions {
  threshold?: number
  rootMargin?: string
  animationStyle?: AnimationStyle
  staggerDelay?: number
  once?: boolean
}

export function useRevealAnimation({
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px',
  animationStyle = 'fade-in-up',
  staggerDelay = 100,
  once = true,
}: UseRevealAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // If reduced motion is preferred, show immediately without animation
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    // Skip if already animated and once is true
    if (once && hasAnimated.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            hasAnimated.current = true

            // Unobserve if once is true
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, rootMargin, once, prefersReducedMotion])

  return {
    ref: elementRef,
    isVisible: prefersReducedMotion || isVisible,
    animationStyle,
    staggerDelay,
  }
}

/**
 * Get CSS classes for animation style
 */
export function getAnimationClasses(
  style: AnimationStyle,
  isVisible: boolean,
  delay: number = 0
): string {
  const baseClasses = 'transition-all duration-500 ease-out'
  const delayClass = delay > 0 ? `delay-[${delay}ms]` : ''

  const animationMap: Record<AnimationStyle, { hidden: string; visible: string }> = {
    'fade-in': {
      hidden: 'opacity-0',
      visible: 'opacity-100',
    },
    'fade-in-up': {
      hidden: 'opacity-0 translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-in-down': {
      hidden: 'opacity-0 -translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-in-left': {
      hidden: 'opacity-0 -translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    'fade-in-right': {
      hidden: 'opacity-0 translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    'scale-in': {
      hidden: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
    'pop-in': {
      hidden: 'opacity-0 scale-0',
      visible: 'opacity-100 scale-100',
    },
  }

  const animation = animationMap[style]
  const stateClass = isVisible ? animation.visible : animation.hidden

  return `${baseClasses} ${stateClass} ${delayClass}`
}

/**
 * Hook for staggered list animations
 */
export function useStaggeredReveal(
  _itemCount: number,
  {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    animationStyle = 'fade-in-up',
    staggerDelay = 100,
  }: UseRevealAnimationOptions = {}
) {
  const { ref, isVisible } = useRevealAnimation({
    threshold,
    rootMargin,
    animationStyle,
    staggerDelay,
  })

  const getItemDelay = (index: number) => (isVisible ? index * staggerDelay : 0)

  const getItemClasses = (index: number) => {
    return getAnimationClasses(animationStyle, isVisible, getItemDelay(index))
  }

  return {
    ref,
    isVisible,
    getItemDelay,
    getItemClasses,
  }
}
