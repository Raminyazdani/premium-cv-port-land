import { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/context/LanguageContext'
import { useEmptySectionsSafe } from '@/context/EmptySectionsContext'
import { cn } from '@/lib/utils'

export interface SectionWrapperProps {
  /**
   * The HTML id for the section element (used for navigation anchors)
   */
  id: string
  /**
   * The section title displayed in the header
   */
  title: string
  /**
   * The icon to display next to the title
   */
  icon: ReactNode
  /**
   * Whether the section is empty (will display empty state if true)
   */
  isEmpty: boolean
  /**
   * Optional message to display when the section is empty
   */
  emptyMessage?: string
  /**
   * Optional subtitle text displayed below the title
   */
  subtitle?: string
  /**
   * The main content of the section (not displayed if isEmpty is true)
   */
  children: ReactNode
  /**
   * Additional CSS classes for the section element
   */
  className?: string
  /**
   * Whether to center the header content (default: true)
   */
  centerHeader?: boolean
  /**
   * Controls empty section behavior:
   * - 'auto': Use the global EmptySectionsContext setting (default)
   * - 'hide': Always hide when empty, regardless of context
   * - 'show': Always show empty state when empty, regardless of context
   */
  emptyBehavior?: 'auto' | 'hide' | 'show'
}

/**
 * Standardized Empty State Component
 * 
 * Displays a consistent empty state with:
 * - Muted icon in a circular background
 * - Section title
 * - Localized empty message
 */
export interface EmptyStateProps {
  /**
   * The icon to display
   */
  icon: ReactNode
  /**
   * The section title
   */
  title: string
  /**
   * The empty state message (localized)
   */
  message?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

export function EmptyState({ icon, title, message, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
        <div className="text-muted-foreground [&>svg]:w-8 [&>svg]:h-8">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-muted-foreground mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * A shared wrapper component for CV sections that provides:
 * - Consistent section structure with id for navigation
 * - Title with icon display
 * - Standardized empty state handling based on user settings
 * - RTL layout support
 * - Separator between header and content
 * 
 * Empty State Behavior:
 * - By default (emptyBehavior='auto'), respects the global showEmptySections setting
 * - When showEmptySections is false (default), empty sections are hidden
 * - When showEmptySections is true, empty sections show a standardized empty state
 * - Use emptyBehavior='hide' or 'show' to override the global setting
 * 
 * @example
 * ```tsx
 * <SectionWrapper
 *   id="education"
 *   title={t.sections.education}
 *   icon={<GraduationCap size={32} />}
 *   isEmpty={filteredEducation.length === 0}
 *   emptyMessage={t.empty.no_education}
 * >
 *   {filteredEducation.map(item => <EducationCard key={item.id} item={item} />)}
 * </SectionWrapper>
 * ```
 */
export function SectionWrapper({
  id,
  title,
  icon,
  isEmpty,
  emptyMessage,
  subtitle,
  children,
  className,
  centerHeader = true,
  emptyBehavior = 'auto',
}: SectionWrapperProps) {
  const { isRTL } = useLanguage()
  const showEmptySections = useEmptySectionsSafe()

  // Determine whether to show the empty state or hide the section
  const shouldShowEmptyState = (): boolean => {
    if (emptyBehavior === 'hide') return false
    if (emptyBehavior === 'show') return true
    // 'auto': use context setting
    return showEmptySections
  }

  // Empty section handling
  if (isEmpty) {
    // If we shouldn't show the empty state, render nothing
    if (!shouldShowEmptyState()) {
      return null
    }

    // Render standardized empty state
    return (
      <section
        id={id}
        className={cn(
          'py-16 bg-background',
          isRTL && 'rtl',
          className
        )}
        aria-labelledby={`${id}-heading`}
      >
        <div className="container max-w-6xl px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <div className="text-muted-foreground [&>svg]:w-8 [&>svg]:h-8">
                {icon}
              </div>
            </div>
            <h2
              id={`${id}-heading`}
              className="text-3xl font-bold mb-2"
            >
              {title}
            </h2>
            {emptyMessage && (
              <p className="text-muted-foreground">{emptyMessage}</p>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Normal content rendering
  return (
    <section
      id={id}
      className={cn(
        'py-16 bg-background',
        isRTL && 'rtl',
        className
      )}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container max-w-6xl px-4">
        <div className={cn('mb-12', centerHeader && 'text-center')}>
          <div
            className={cn(
              'inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4',
              !centerHeader && 'mr-4'
            )}
          >
            <div className="text-primary [&>svg]:w-8 [&>svg]:h-8">
              {icon}
            </div>
          </div>
          <h2
            id={`${id}-heading`}
            className="text-4xl font-bold mb-3"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <Separator className="mb-8" />
        {children}
      </div>
    </section>
  )
}
