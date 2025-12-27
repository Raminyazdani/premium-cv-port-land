import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

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
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        break
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!validateEmail(value)) return 'Please enter a valid email address'
        break
      case 'subject':
        if (!value.trim()) return 'Subject is required'
        if (value.trim().length < 3) return 'Subject must be at least 3 characters'
        break
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
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
      setStatusMessage('Form has errors. Please review and correct the highlighted fields.')
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)
    setStatusMessage('Sending your message...')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStatusMessage('Message sent successfully!')
      toast.success('Message sent!', {
        description: 'Thank you for reaching out. I\'ll get back to you as soon as possible.',
      })
      
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTouched({})
      setErrors({})
      
      setTimeout(() => {
        document.getElementById('name')?.focus()
      }, 100)
    } catch (error) {
      setStatusMessage('Failed to send message. Please try again.')
      toast.error('Failed to send message', {
        description: 'There was a problem sending your message. Please try again later or email directly.',
      })
    } finally {
      setIsSubmitting(false)
    }

    console.log('Form data (would be sent to backend):', formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
        <CardDescription>
          Send me a message and I'll get back to you as soon as possible
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
              Name <span className="text-destructive" aria-label="required">*</span>
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
              placeholder="Your full name"
            />
            {errors.name && (
              <span id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">
              Email <span className="text-destructive" aria-label="required">*</span>
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
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <span id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">
              Subject <span className="text-destructive" aria-label="required">*</span>
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
              placeholder="What is this about?"
            />
            {errors.subject && (
              <span id="subject-error" className="text-sm text-destructive" role="alert">
                {errors.subject}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">
              Message <span className="text-destructive" aria-label="required">*</span>
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
              placeholder="Your message..."
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
                <Spinner size={16} className="mr-2" label="Sending" />
                Sending...
              </>
            ) : (
              <>
                <PaperPlaneRight className="mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
