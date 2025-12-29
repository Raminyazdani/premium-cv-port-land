import { useState } from 'react'
import { FilePdf, Image as ImageIcon } from '@phosphor-icons/react'
import { detectMediaType } from '@/utils/mediaDetector'
import { logger } from '@/lib/logger'

interface MediaThumbnailProps {
  url: string
  alt?: string
  className?: string
  onClick?: () => void
}

export function MediaThumbnail({ url, alt = 'Media', className = '', onClick }: MediaThumbnailProps) {
  const [imageError, setImageError] = useState(false)
  const mediaType = detectMediaType(url)

  if (!mediaType) return null

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick?.()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  const handleImageError = () => {
    // Log the error for debugging - helps identify broken Cloudinary URLs
    logger.debug(`[MediaThumbnail] Failed to load image: ${url}`)
    setImageError(true)
  }

  if (mediaType === 'pdf') {
    return (
      <button
        onClick={handleClick}
        onKeyDown={handleKeyPress}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors cursor-pointer border border-border ${className}`}
        aria-label={`View PDF: ${alt}`}
        type="button"
      >
        <FilePdf size={20} weight="fill" className="text-destructive shrink-0" />
        <span className="text-sm font-medium truncate max-w-[200px]">{alt || 'PDF Document'}</span>
      </button>
    )
  }

  if (mediaType === 'image') {
    return (
      <button
        onClick={handleClick}
        onKeyDown={handleKeyPress}
        className={`relative overflow-hidden rounded-lg border border-border hover:border-primary transition-all cursor-pointer group ${className}`}
        aria-label={`View image: ${alt}`}
        type="button"
      >
        {!imageError ? (
          <img
            src={url}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon size={24} className="text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </button>
    )
  }

  return null
}
