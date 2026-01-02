import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Video, Phone, MapPin } from '@phosphor-icons/react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useTranslation } from '@/context/LanguageContext'
import { interpolate } from '@/lib/i18n'

type MeetingType = 'video' | 'phone' | 'in-person'

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export function BookingWidget() {
  const t = useTranslation()
  const [selectedType, setSelectedType] = useState<MeetingType>('video')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isBooking, setIsBooking] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const mockTimeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: false },
    { id: '3', time: '11:00 AM', available: true },
    { id: '4', time: '02:00 PM', available: true },
    { id: '5', time: '03:00 PM', available: true },
    { id: '6', time: '04:00 PM', available: false },
  ]

  const meetingTypes = [
    {
      id: 'video' as MeetingType,
      label: t.booking.video_call,
      icon: Video,
      description: t.booking.video_description,
    },
    {
      id: 'phone' as MeetingType,
      label: t.booking.phone_call,
      icon: Phone,
      description: t.booking.phone_description,
    },
    {
      id: 'in-person' as MeetingType,
      label: t.booking.in_person,
      icon: MapPin,
      description: t.booking.in_person_description,
    },
  ]

  const handleBookCall = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error(t.booking.select_date_time)
      setStatusMessage(t.booking.select_date_time)
      return
    }

    setIsBooking(true)
    setStatusMessage(t.booking.booking)

    try {
      // TODO: Integrate Calendly or custom booking backend
      // Option 1: Integrate with Calendly API
      // Example:
      // const response = await fetch('https://calendly.com/api/v2/scheduled_events', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     event_type: selectedType,
      //     start_time: `${selectedDate}T${selectedTime}:00`,
      //   })
      // })
      //
      // Option 2: POST to custom backend booking API
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: selectedType, date: selectedDate, time: selectedTime })
      // })
      
      // Simulating backend call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const meetingLabel = meetingTypes.find((m) => m.id === selectedType)?.label
      setStatusMessage(interpolate(t.booking.success_description, {
        type: meetingLabel || '',
        date: selectedDate,
        time: selectedTime
      }))
      
      toast.success(t.booking.success_title, {
        description: interpolate(t.booking.success_description, {
          type: meetingLabel || '',
          date: selectedDate,
          time: selectedTime
        }),
      })

      if (import.meta.env.DEV) {
        console.log('Booking details (would be sent to backend):', {
          type: selectedType,
          date: selectedDate,
          time: selectedTime,
        })
      }
    } catch (_error) {
      setStatusMessage(t.booking.error_description)
      toast.error(t.booking.error_title, {
        description: t.booking.error_description,
      })
    } finally {
      setIsBooking(false)
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
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
        >
          {statusMessage}
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium">{t.booking.meeting_type}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {meetingTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedType(type.id)
                    }
                  }}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${
                      selectedType === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }
                  `}
                  aria-pressed={selectedType === type.id}
                >
                  <Icon size={24} weight={selectedType === type.id ? 'fill' : 'regular'} />
                  <span className="font-medium text-sm">{type.label}</span>
                  <span className="text-xs text-muted-foreground text-center">
                    {type.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Calendar size={18} />
            {t.booking.select_date}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Mon, Jan 15', 'Tue, Jan 16', 'Wed, Jan 17', 'Thu, Jan 18', 'Fri, Jan 19', 'Mon, Jan 22', 'Tue, Jan 23', 'Wed, Jan 24'].map(
              (date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`
                    px-4 py-2 rounded-md border transition-all text-sm
                    ${
                      selectedDate === date
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }
                  `}
                  aria-pressed={selectedDate === date}
                >
                  {date}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Clock size={18} />
            {t.booking.select_time}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {mockTimeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`
                  px-4 py-2 rounded-md border transition-all text-sm
                  ${
                    selectedTime === slot.time
                      ? 'border-primary bg-primary text-primary-foreground'
                      : slot.available
                      ? 'border-border hover:border-primary/50'
                      : 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
                aria-pressed={selectedTime === slot.time}
                aria-disabled={!slot.available}
              >
                {slot.time}
                {!slot.available && <span className="sr-only"> ({t.booking.unavailable})</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            onClick={handleBookCall}
            disabled={!selectedDate || !selectedTime || isBooking}
            className="flex-1"
          >
            {isBooking ? (
              <>
                <Spinner size={16} className="mr-2" label={t.booking.booking} />
                {t.booking.booking}
              </>
            ) : (
              t.booking.book_call
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDate('')
              setSelectedTime('')
              setStatusMessage(t.booking.selection_cleared)
            }}
            disabled={isBooking}
            className="sm:w-auto"
          >
            {t.booking.clear_selection}
          </Button>
        </div>

        {selectedDate && selectedTime && (
          <div className="p-4 rounded-lg bg-muted text-sm">
            <p className="font-medium">{t.booking.your_selection}</p>
            <p className="text-muted-foreground">
              {meetingTypes.find((m) => m.id === selectedType)?.label} {t.education.duration} {selectedDate} {t.education.duration} {selectedTime}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
