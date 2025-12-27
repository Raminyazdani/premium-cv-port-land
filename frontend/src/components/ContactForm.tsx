import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useTranslation } from '@/context/LanguageContext'
import { interpolate } from '@/lib/i18n'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const t = useTranslation()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    const fieldNames: Record<keyof FormData, string> = {
      name: t.forms.name,
      email: t.forms.email,
      subject: t.forms.subject,
      message: t.forms.message
    }
    
    switch (name) {
      case 'name':
        if (!value.trim()) return interpolate(t.validation.required, { field: fieldNames[name] })
        if (value.trim().length < 2) return interpolate(t.validation.min_length_2, { field: fieldNames[name] })
        break
      case 'email':
        if (!value.trim()) return interpolate(t.validation.required, { field: fieldNames[name] })
        if (!validateEmail(value)) return t.validation.invalid_email
        break
      case 'subject':
        if (!value.trim()) return interpolate(t.validation.required, { field: fieldNames[name] })
        if (value.trim().length < 3) return interpolate(t.validation.min_length_3, { field: fieldNames[name] })
        break
      case 'message':
        if (!value.trim()) return interpolate(t.validation.required, { field: fieldNames[name] })
        if (value.trim().length < 10) return interpolate(t.validation.min_length_10, { field: fieldNames[name] })
        break
    }
    return undefined
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name as keyof FormData, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name as keyof FormData, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    })

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setStatusMessage(t.forms.error)
      toast.error(t.forms.error)
      return
    }

    setIsSubmitting(true)
    setStatusMessage(t.forms.sending)

    try {
      // TODO: Replace with backend API call
      // POST to /api/contact endpoint with formData
      // Example:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // if (!response.ok) throw new Error('Failed to send message')
      
      // Simulating backend call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStatusMessage(t.forms.sent)
      toast.success(t.forms.sent, {
        description: t.forms.success_message,
      })
      
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTouched({})
      setErrors({})
      
      setTimeout(() => {
        document.getElementById('name')?.focus()
      }, 100)
    } catch (error) {
      setStatusMessage(t.forms.error)
      toast.error(t.forms.error, {
        description: t.forms.error_message,
      })
    } finally {
      setIsSubmitting(false)
    }

    console.log('Form data (would be sent to backend):', formData)
  }

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              {t.forms.name} <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              placeholder={t.forms.name}
            />
            {errors.name && (
              <span id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">
              {t.forms.email} <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder={t.forms.email}
            />
            {errors.email && (
              <span id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">
              {t.forms.subject} <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              placeholder={t.forms.subject}
            />
            {errors.subject && (
              <span id="subject-error" className="text-sm text-destructive" role="alert">
                {errors.subject}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">
              {t.forms.message} <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              placeholder={t.forms.message}
              rows={6}
              className="resize-none"
            />
            {errors.message && (
              <span id="message-error" className="text-sm text-destructive" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full sm:w-auto sm:self-end" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size={16} className="mr-2" label={t.forms.sending} />
                {t.forms.sending}
              </>
            ) : (
              <>
                <PaperPlaneRight className="mr-2" />
                {t.forms.send}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
