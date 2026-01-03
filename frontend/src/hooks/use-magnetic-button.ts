import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion'

export function useMagneticButton(strength = 0.3, maxDistance = 50) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      if (distance < maxDistance) {
        const offsetX = deltaX * strength
        const offsetY = deltaY * strength
        setOffset({ x: offsetX, y: offsetY })
      } else {
        setOffset({ x: 0, y: 0 })
      }
    }

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, maxDistance, prefersReducedMotion])

  const style = prefersReducedMotion 
    ? {} 
    : {
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.15s ease-out',
      }

  return { ref, style }
}
