/**
 * Floating Action Button (FAB) Component
 * Provides quick actions: back to top, download PDF, contact, toggle theme
 * Keyboard accessible and mobile-friendly
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowUp,
  FilePdf,
  Envelope,
  Palette,
  Plus,
  X,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/context/LanguageContext'

interface FABProps {
  onDownloadPDF?: () => void
  onContactClick?: () => void
  onThemeToggle?: () => void
}

export function FloatingActionButton({
  onDownloadPDF,
  onContactClick,
  onThemeToggle,
}: FABProps = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const t = useTranslation()

  // Show/hide FAB based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    setIsExpanded(false)
  }

  const handleDownloadPDF = () => {
    if (onDownloadPDF) {
      onDownloadPDF()
    } else {
      window.print()
    }
    setIsExpanded(false)
  }

  const handleContact = () => {
    if (onContactClick) {
      onContactClick()
    } else {
      const contactSection = document.querySelector('#contact-section')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsExpanded(false)
  }

  const handleTheme = () => {
    if (onThemeToggle) {
      onThemeToggle()
    } else {
      // Open theme selector if available
      const themeButton = document.querySelector('[data-theme-selector]')
      if (themeButton instanceof HTMLElement) {
        themeButton.click()
      }
    }
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isExpanded) {
      setIsExpanded(false)
    }
  }

  if (!isVisible) {
    return null
  }

  const actions = [
    {
      icon: ArrowUp,
      label: t.actions?.back_to_top || 'Back to top',
      onClick: scrollToTop,
      className: 'bg-primary hover:bg-primary/90',
    },
    {
      icon: FilePdf,
      label: t.actions?.download_cv || 'Download PDF',
      onClick: handleDownloadPDF,
      className: 'bg-secondary hover:bg-secondary/90',
    },
    {
      icon: Envelope,
      label: t.actions?.contact || 'Contact',
      onClick: handleContact,
      className: 'bg-accent hover:bg-accent/90',
    },
    {
      icon: Palette,
      label: t.actions?.theme || 'Theme',
      onClick: handleTheme,
      className: 'bg-muted hover:bg-muted/90',
    },
  ]

  return (
    <div
      className="fixed bottom-6 right-6 z-50 no-print"
      onKeyDown={handleKeyDown}
      role="group"
      aria-label={t.a11y?.quick_actions}
    >
      {/* Action buttons - shown when expanded */}
      <div
        className={cn(
          'absolute bottom-20 right-0 flex flex-col gap-3 transition-all duration-300',
          isExpanded ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
        )}
      >
        {actions.map((action, index) => {
          const Icon = action.icon
          const delay = isExpanded ? index * 50 : 0
          
          return (
            <Button
              key={action.label}
              size="icon"
              onClick={action.onClick}
              className={cn(
                'w-14 h-14 rounded-full shadow-lg transition-all duration-300',
                'hover:scale-110 focus-visible:scale-110',
                'min-touch-target',
                action.className
              )}
              style={{
                transitionDelay: `${delay}ms`,
                transform: isExpanded ? 'scale(1)' : 'scale(0)',
              }}
              aria-label={action.label}
              title={action.label}
            >
              <Icon size={24} weight="bold" />
            </Button>
          )
        })}
      </div>

      {/* Main FAB button */}
      <Button
        size="icon"
        onClick={toggleExpanded}
        className={cn(
          'w-14 h-14 rounded-full shadow-xl transition-all duration-300',
          'bg-primary hover:bg-primary/90',
          'hover:scale-110 focus-visible:scale-110',
          'min-touch-target',
          isExpanded && 'rotate-45 bg-destructive hover:bg-destructive/90'
        )}
        aria-label={isExpanded ? t.a11y?.close_quick_actions : t.a11y?.open_quick_actions}
        aria-expanded={isExpanded}
        style={{
          animation: isVisible && !isExpanded ? 'fab-pulse 2s ease-in-out infinite' : 'none',
        }}
      >
        {isExpanded ? <X size={28} weight="bold" /> : <Plus size={28} weight="bold" />}
      </Button>

      {/* Pulse animation */}
      <style>{`
        @keyframes fab-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(var(--primary), 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(var(--primary), 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes fab-pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(var(--primary), 0.7);
            }
          }
        }
      `}</style>
    </div>
  )
}
