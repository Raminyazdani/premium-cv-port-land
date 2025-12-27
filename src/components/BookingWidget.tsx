import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Video, Phone, MapPin } from '@phosphor-icons/react'
import { toast } from 'sonner'

type MeetingType = 'video' | 'phone' | 'in-person'

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export function BookingWidget() {
  const [selectedType, setSelectedType] = useState<MeetingType>('video')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

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
      label: 'Video Call',
      icon: Video,
      description: 'Meet via Zoom, Google Meet, or Microsoft Teams',
    },
    {
      id: 'phone' as MeetingType,
      label: 'Phone Call',
      icon: Phone,
      description: 'Direct phone conversation',
    },
    {
      id: 'in-person' as MeetingType,
      label: 'In Person',
      icon: MapPin,
      description: 'Meet at a specified location',
    },
  ]

  const handleBookCall = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time')
      return
    }

    toast.info('Booking system not implemented yet', {
      description: 'Calendar integration (e.g., Calendly) will be added in a future update.',
    })

    console.log('Booking details (would be sent to backend):', {
      type: selectedType,
      date: selectedDate,
      time: selectedTime,
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule a Call</CardTitle>
        <CardDescription>
          Choose your preferred meeting type and select a time that works for you
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium">Meeting Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {meetingTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
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
            Select Date
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
            Select Time
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
                {!slot.available && <span className="sr-only"> (unavailable)</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            onClick={handleBookCall}
            disabled={!selectedDate || !selectedTime}
            className="flex-1"
          >
            Book a Call
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDate('')
              setSelectedTime('')
            }}
            className="sm:w-auto"
          >
            Clear Selection
          </Button>
        </div>

        {selectedDate && selectedTime && (
          <div className="p-4 rounded-lg bg-muted text-sm">
            <p className="font-medium">Your Selection:</p>
            <p className="text-muted-foreground">
              {meetingTypes.find((t) => t.id === selectedType)?.label} on {selectedDate} at{' '}
              {selectedTime}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
