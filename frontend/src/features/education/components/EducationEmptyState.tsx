/**
 * Education Empty State Component
 * 
 * Displayed when no education entries match the current filters.
 */

import { Button } from '@/components/ui/button'

interface EducationEmptyStateProps {
  /** Message to display */
  message: string
  /** Clear filter button label */
  clearLabel: string
  /** Callback to clear filters */
  onClear: () => void
}

/**
 * EducationEmptyState renders an empty state with option to clear filters.
 */
export function EducationEmptyState({
  message,
  clearLabel,
  onClear,
}: EducationEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
      <Button 
        variant="link" 
        onClick={onClear}
        className="mt-2"
      >
        {clearLabel}
      </Button>
    </div>
  )
}
