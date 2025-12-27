import { ContactForm } from '@/components/ContactForm'
import { BookingWidget } from '@/components/BookingWidget'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ContactSection() {
  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you want to send a message or schedule a call, I'm here to help
          </p>
        </div>

        <Tabs defaultValue="message" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="message">Send Message</TabsTrigger>
            <TabsTrigger value="booking">Book a Call</TabsTrigger>
          </TabsList>

          <TabsContent value="message" className="mt-0">
            <ContactForm />
          </TabsContent>

          <TabsContent value="booking" className="mt-0">
            <BookingWidget />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
