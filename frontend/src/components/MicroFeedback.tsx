/**
 * Micro-Feedback Animation System
 * Provides success, error, and feedback animations for user interactions
 */

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Check, X, Copy, Heart, Star, Spinner } from '@phosphor-icons/react'

type FeedbackType = 'success' | 'error' | 'copied' | 'liked' | 'starred' | 'loading'

interface FeedbackState {
  type: FeedbackType
  id: string
  x?: number
  y?: number
}

interface MicroFeedbackContextType {
  showFeedback: (type: FeedbackType, x?: number, y?: number) => void
  showSuccessAt: (element: HTMLElement) => void
  showCopiedAt: (element: HTMLElement) => void
  showErrorShake: (element: HTMLElement) => void
}

const MicroFeedbackContext = createContext<MicroFeedbackContextType | null>(null)

export function useMicroFeedback() {
  const context = useContext(MicroFeedbackContext)
  if (!context) {
    throw new Error('useMicroFeedback must be used within MicroFeedbackProvider')
  }
  return context
}

interface MicroFeedbackProviderProps {
  children: React.ReactNode
}

export function MicroFeedbackProvider({ children }: MicroFeedbackProviderProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackState[]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const showFeedback = useCallback((type: FeedbackType, x?: number, y?: number) => {
    const id = `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    setFeedbacks(prev => [...prev, { type, id, x, y }])
    
    // Auto-remove after animation
    setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => f.id !== id))
    }, 1000)
  }, [])

  const showSuccessAt = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    showFeedback('success', rect.left + rect.width / 2, rect.top + rect.height / 2)
  }, [showFeedback])

  const showCopiedAt = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    showFeedback('copied', rect.left + rect.width / 2, rect.top + rect.height / 2)
  }, [showFeedback])

  const showErrorShake = useCallback((element: HTMLElement) => {
    if (prefersReducedMotion) {
      element.style.outline = '2px solid hsl(var(--destructive))'
      setTimeout(() => {
        element.style.outline = ''
      }, 400)
      return
    }

    element.classList.add('animate-shake')
    setTimeout(() => {
      element.classList.remove('animate-shake')
    }, 400)
  }, [prefersReducedMotion])

  return (
    <MicroFeedbackContext.Provider value={{ showFeedback, showSuccessAt, showCopiedAt, showErrorShake }}>
      {children}
      
      {/* Render feedback animations */}
      {feedbacks.map(feedback => (
        <FeedbackAnimation
          key={feedback.id}
          type={feedback.type}
          x={feedback.x}
          y={feedback.y}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </MicroFeedbackContext.Provider>
  )
}

interface FeedbackAnimationProps {
  type: FeedbackType
  x?: number
  y?: number
  prefersReducedMotion: boolean
}

function FeedbackAnimation({ type, x, y, prefersReducedMotion }: FeedbackAnimationProps) {
  const Icon = FEEDBACK_ICONS[type]
  const color = FEEDBACK_COLORS[type]

  if (!x || !y) return null

  return (
    <div
      className={cn(
        'fixed z-[100] pointer-events-none',
        prefersReducedMotion ? 'opacity-100' : 'animate-feedback-pop'
      )}
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className={cn(
          'flex items-center justify-center',
          'w-10 h-10 rounded-full',
          'bg-background shadow-lg border border-border',
          color
        )}
      >
        {type === 'loading' ? (
          <Icon size={20} className="animate-spin" weight="bold" />
        ) : (
          <Icon size={20} weight="bold" />
        )}
      </div>
    </div>
  )
}

const FEEDBACK_ICONS = {
  success: Check,
  error: X,
  copied: Copy,
  liked: Heart,
  starred: Star,
  loading: Spinner,
}

const FEEDBACK_COLORS = {
  success: 'text-green-500',
  error: 'text-red-500',
  copied: 'text-blue-500',
  liked: 'text-pink-500',
  starred: 'text-yellow-500',
  loading: 'text-muted-foreground',
}

/**
 * Success Checkmark Animation Component
 */
export function SuccessCheckmark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'w-6 h-6 rounded-full bg-green-500/10 text-green-500',
        'animate-scale-in',
        className
      )}
    >
      <Check size={16} weight="bold" className="animate-check-draw" />
    </div>
  )
}

/**
 * Loading Spinner Component
 */
export function LoadingSpinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Spinner
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )}
      weight="bold"
    />
  )
}

/**
 * Inline Copied Animation
 */
export function CopiedIndicator({ show }: { show: boolean }) {
  if (!show) return null
  
  return (
    <span className="inline-flex items-center gap-1 text-green-500 text-sm animate-fade-in">
      <Check size={14} weight="bold" />
      Copied!
    </span>
  )
}
