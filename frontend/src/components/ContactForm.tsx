import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EnvelopeSimple, Copy, Check, ArrowSquareOut, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useTranslation } from '@/context/LanguageContext'
import { useCVData } from '@/context/CVDataContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Basics } from '@/types/cv'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * Extract contact email from CV basics data
 * Handles both array and single object formats
 */
function extractContactEmail(basics: Basics[] | Basics | null | undefined): string {
  if (!basics) return ''
  const basicsData = Array.isArray(basics) ? basics[0] : basics
  return basicsData?.email || ''
}

/**
 * ContactForm - Demo/Mock Productized Contact Form
 * 
 * This component displays a contact form UI for demonstration purposes.
 * Instead of simulating a backend submission, it provides actionable
 * alternatives: copying the email address or opening an email client
 * with pre-filled content.
 */
export function ContactForm() {
  const t = useTranslation()
  const { data } = useCVData()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [copied, setCopied] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string>('')

  // Memoize contact email extraction to avoid recalculation on every render
  const contactEmail = useMemo(() => extractContactEmail(data?.basics), [data?.basics])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCopyEmail = async () => {
    if (!contactEmail) return
    
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopied(true)
      setStatusMessage(t.forms.email_copied)
      toast.success(t.forms.email_copied)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      toast.error(t.forms.error)
    }
  }

  // Memoize mailto URL builder to avoid recreation on every render
  const buildMailtoUrl = useCallback((): string => {
    const subject = encodeURIComponent(formData.subject || '')
    const body = encodeURIComponent(
      formData.message 
        ? `${formData.message}\n\n---\nFrom: ${formData.name || ''}\nEmail: ${formData.email || ''}`
        : ''
    )
    return `mailto:${contactEmail}?subject=${subject}&body=${body}`
  }, [formData, contactEmail])

  const handleOpenEmailClient = useCallback(() => {
    const mailtoUrl = buildMailtoUrl()
    window.open(mailtoUrl, '_blank')
    setStatusMessage(t.forms.open_email_client)
  }, [buildMailtoUrl, t.forms.open_email_client])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t.sections.contact}</CardTitle>
        <CardDescription>
          {t.forms.contact_description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {statusMessage}
        </div>
        
        {/* Demo Notice Alert */}
        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {t.forms.demo_notice}
          </AlertDescription>
        </Alert>

        {/* Form fields for composing message (preview only) */}
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t.forms.name}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.forms.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t.forms.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.forms.email}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">{t.forms.subject}</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t.forms.subject}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">{t.forms.message}</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t.forms.message}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        {/* Action Buttons - Real functionality */}
        {contactEmail && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={handleOpenEmailClient}
                className="flex-1"
              >
                <EnvelopeSimple className="mr-2 h-4 w-4" />
                {t.forms.open_email_client}
                <ArrowSquareOut className="ml-2 h-3 w-3" />
              </Button>
              
              <span className="text-center text-sm text-muted-foreground self-center">
                {t.forms.or}
              </span>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyEmail}
                className="flex-1"
              >
                {copied ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {t.forms.copy_email}
              </Button>
            </div>
            
            {/* Display email address */}
            <p className="text-center text-sm text-muted-foreground">
              <span className="font-medium">{contactEmail}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
