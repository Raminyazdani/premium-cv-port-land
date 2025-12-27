import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  aspectRatio?: string
  onLoad?: () => void
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  aspectRatio,
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority || !containerRef.current) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
      }}
    >
      {isInView && (
        <>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
