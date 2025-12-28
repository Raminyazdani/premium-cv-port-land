import { Warning } from '@phosphor-icons/react'
import { useTranslation } from '@/context/LanguageContext'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const t = useTranslation()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full bg-card border border-border rounded-lg p-8 text-center">
        <Warning className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{t.errors.something_went_wrong}</h1>
        <p className="text-muted-foreground mb-6">
          {t.errors.error_occurred}
        </p>
        <details className="text-left mb-6 bg-muted p-4 rounded-md">
          <summary className="cursor-pointer font-medium text-sm mb-2">{t.errors.error_details}</summary>
          <pre className="text-xs overflow-auto whitespace-pre-wrap text-muted-foreground">
            {error.message}
          </pre>
        </details>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          {t.errors.try_again}
        </button>
      </div>
    </div>
  )
}
