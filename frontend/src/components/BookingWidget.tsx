import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Video, Phone, MapPin, ArrowSquareOut, Info } from '@phosphor-icons/react'
import { useTranslation } from '@/context/LanguageContext'
import { Alert, AlertDescription } from '@/components/ui/alert'

type MeetingType = 'video' | 'phone' | 'in-person'

// Get the Calendly URL from environment variable or use a fallback
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || ''

/**
 * BookingWidget - Demo/Mock Productized Booking Widget
 * 
 * This component displays meeting type options for demonstration purposes.
 * Instead of simulating a backend booking, it provides an external scheduling
 * link (Calendly or similar) when configured, or clearly indicates it's a demo.
 */
export function BookingWidget() {
  const t = useTranslation()

  const meetingTypes: Array<{
    id: MeetingType
    label: string
    icon: typeof Video
    description: string
  }> = [
    {
      id: 'video',
      label: t.booking.video_call,
      icon: Video,
      description: t.booking.video_description,
    },
    {
      id: 'phone',
      label: t.booking.phone_call,
      icon: Phone,
      description: t.booking.phone_description,
    },
    {
      id: 'in-person',
      label: t.booking.in_person,
      icon: MapPin,
      description: t.booking.in_person_description,
    },
  ]

  const handleOpenCalendly = () => {
    if (CALENDLY_URL) {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t.booking.title}</CardTitle>
        <CardDescription>
          {t.booking.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {/* Demo Notice Alert */}
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {t.booking.demo_notice}
          </AlertDescription>
        </Alert>

        {/* Meeting Types Display (informational only) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium">{t.booking.meeting_type}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {meetingTypes.map((type) => {
              const Icon = type.icon
              return (
                <div
                  key={type.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-muted/30"
                >
                  <Icon size={24} weight="regular" className="text-muted-foreground" />
                  <span className="font-medium text-sm">{type.label}</span>
                  <span className="text-xs text-muted-foreground text-center">
                    {type.description}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Demo Schedule Information */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Calendar size={18} />
            {t.booking.select_date}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.booking.external_link_notice}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-4 pt-4 border-t">
          {CALENDLY_URL ? (
            <Button
              onClick={handleOpenCalendly}
              className="w-full sm:w-auto sm:self-center"
              size="lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {t.booking.calendly_cta}
              <ArrowSquareOut className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-2">
                {t.booking.schedule_external}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {t.booking.external_link_notice}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
