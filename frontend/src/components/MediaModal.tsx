import { useEffect, useCallback, useRef, useState } from 'react'
import { X, ArrowLeft, ArrowRight, FilePdf, WarningCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { detectMediaType } from '@/utils/mediaDetector'
import { useTranslation } from '@/context/LanguageContext'

interface MediaModalProps {
  url: string
  alt?: string
  isOpen: boolean
  onClose: () => void
  mediaList?: Array<{ url: string; alt?: string }>
  currentIndex?: number
  onNavigate?: (index: number) => void
}

export function MediaModal({
  url,
  alt = 'Media',
  isOpen,
  onClose,
  mediaList = [],
  currentIndex = 0,
  onNavigate
}: MediaModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const mediaType = detectMediaType(url)
  const hasGallery = mediaList.length > 1
  const t = useTranslation()
  
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const handlePrevious = useCallback(() => {
    if (hasGallery && onNavigate && currentIndex > 0) {
      onNavigate(currentIndex - 1)
    }
  }, [hasGallery, onNavigate, currentIndex])

  const handleNext = useCallback(() => {
    if (hasGallery && onNavigate && currentIndex < mediaList.length - 1) {
      onNavigate(currentIndex + 1)
    }
  }, [hasGallery, onNavigate, currentIndex, mediaList.length])

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      setImageLoading(mediaType === 'image')
      setImageError(false)
      setAnnouncement(`Media viewer opened. Showing ${alt || 'media'}. Press Escape to close.`)
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      setAnnouncement('Media viewer closed')
    }
  }, [isOpen, alt, mediaType])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, handlePrevious, handleNext])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={t.a11y.media_viewer}
    >
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
      
      <div
        ref={modalRef}
        className="relative max-w-7xl max-h-[90vh] w-full bg-background rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {hasGallery && (
            <span className="px-3 py-1 bg-black/60 text-white text-sm rounded-full">
              {currentIndex + 1} / {mediaList.length}
            </span>
          )}
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="bg-black/60 hover:bg-black/80 text-white rounded-full"
            aria-label={t.a11y.close_modal}
          >
            <X size={24} weight="bold" />
          </Button>
        </div>

        <div className="flex items-center justify-center min-h-[400px] max-h-[90vh] p-8">
          {mediaType === 'image' && (
            <div className="relative w-full h-full flex items-center justify-center">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner size={48} label={t.a11y.loading_image} />
                </div>
              )}
              {imageError ? (
                <div className="flex flex-col items-center gap-4 p-8">
                  <WarningCircle size={64} className="text-destructive" weight="fill" />
                  <p className="text-lg font-medium">{t.media?.failed_to_load}</p>
                  <p className="text-sm text-muted-foreground">{t.media?.image_could_not_load}</p>
                  <Button 
                    onClick={() => {
                      setImageError(false)
                      setImageLoading(true)
                    }}
                  >
                    {t.actions?.retry}
                  </Button>
                </div>
              ) : (
                <img
                  src={url}
                  alt={alt}
                  onLoad={() => {
                    setImageLoading(false)
                    setAnnouncement(`Image loaded: ${alt}`)
                  }}
                  onError={() => {
                    setImageLoading(false)
                    setImageError(true)
                    setAnnouncement('Failed to load image')
                  }}
                  className={`max-w-full max-h-[80vh] object-contain transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              )}
            </div>
          )}

          {mediaType === 'pdf' && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              <FilePdf size={64} weight="fill" className="text-destructive" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">{alt || t.media?.pdf_document}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.media?.click_to_open_pdf}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  asChild
                  size="lg"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <FilePdf size={20} weight="fill" />
                    {t.actions?.open_pdf}
                  </a>
                </Button>
              </div>
              <iframe
                src={url}
                className="w-full h-[60vh] border border-border rounded-lg mt-4"
                title={alt}
              />
            </div>
          )}
        </div>

        {hasGallery && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full disabled:opacity-30"
              aria-label={t.a11y.previous_media}
            >
              <ArrowLeft size={24} weight="bold" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === mediaList.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full disabled:opacity-30"
              aria-label={t.a11y.next_media}
            >
              <ArrowRight size={24} weight="bold" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
