/**
 * Celebration Animation Component
 * Shows confetti/particle effect when Konami code is unlocked
 */

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CelebrationAnimationProps {
  show: boolean
  onComplete?: () => void
}

export function CelebrationAnimation({ show, onComplete }: CelebrationAnimationProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      left: number
      animationDelay: number
      duration: number
      color: string
    }>
  >([])

  useEffect(() => {
    if (show) {
      // Generate random particles
      const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-orange-500',
      ]
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)] ?? 'bg-blue-500',
      }))

      setParticles(newParticles)

      // Clear particles and call onComplete after animation
      const timeout = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 3000)

      return () => clearTimeout(timeout)
    }
    return undefined
  }, [show, onComplete])

  if (!show && particles.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Flash effect */}
      <div
        className={cn(
          'absolute inset-0 bg-white transition-opacity duration-300',
          show ? 'opacity-20' : 'opacity-0'
        )}
      />

      {/* Confetti particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={cn(
            'absolute w-3 h-3 rounded-full',
            particle.color
          )}
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            animation: `confetti-fall ${particle.duration}s ease-in forwards`,
            animationDelay: `${particle.animationDelay}s`,
          }}
        />
      ))}

      {/* Success message */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'bg-background/95 backdrop-blur-sm border-2 border-primary rounded-2xl p-8',
          'shadow-2xl transition-all duration-500',
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        )}
      >
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold text-primary">Secret Unlocked!</h2>
          <p className="text-muted-foreground">The Matrix theme is now available</p>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes confetti-fall {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        }
      `}</style>
    </div>
  )
}
