import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert"
import { Button } from "./components/ui/button"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"
import { useTranslation } from "./context/LanguageContext"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  console.error('Error caught by boundary:', error)
  const t = useTranslation()
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangleIcon />
          <AlertTitle>{t.errors.runtime_error}</AlertTitle>
          <AlertDescription>
            {t.errors.unexpected}
          </AlertDescription>
        </Alert>
        
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">{t.errors.error_details_label}</h3>
          <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32">
            {error.message}
          </pre>
          {error.stack && (
            <pre className="text-xs text-muted-foreground bg-muted/30 p-3 rounded border overflow-auto max-h-48 mt-2">
              {error.stack}
            </pre>
          )}
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full"
          variant="outline"
        >
          <RefreshCwIcon />
          {t.errors.try_again}
        </Button>
      </div>
    </div>
  )
}
