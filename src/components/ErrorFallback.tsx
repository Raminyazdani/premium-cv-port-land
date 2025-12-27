import { Warning } from '@phosphor-icons/react'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full bg-card border border-border rounded-lg p-8 text-center">
        <Warning className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          An error occurred while loading the application. This might be due to invalid data.
        </p>
        <details className="text-left mb-6 bg-muted p-4 rounded-md">
          <summary className="cursor-pointer font-medium text-sm mb-2">Error details</summary>
          <pre className="text-xs overflow-auto whitespace-pre-wrap text-muted-foreground">
            {error.message}
          </pre>
        </details>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
