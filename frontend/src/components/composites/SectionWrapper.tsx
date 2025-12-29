import { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/context/LanguageContext'
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
}

/**
 * A shared wrapper component for CV sections that provides:
 * - Consistent section structure with id for navigation
 * - Title with icon display
 * - Empty state handling
 * - RTL layout support
 * - Separator between header and content
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
}: SectionWrapperProps) {
  const { isRTL } = useLanguage()

  // Empty state rendering
  if (isEmpty) {
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
