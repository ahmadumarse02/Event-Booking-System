"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Users, DollarSign, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookingForm } from "@/components/booking-form"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Event, Booking } from "@/types"
import { eventsApi, bookingsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EventDetailsPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchEventData = async () => {
    try {
      const [eventData, bookingsData] = await Promise.all([
        eventsApi.getById(params.id as string),
        bookingsApi.getByEventId(params.id as string),
      ])
      setEvent(eventData)
      setBookings(bookingsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch event details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEventData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  const totalBookedTickets = bookings.reduce((sum, booking) => sum + booking.tickets, 0)
  const availableSpots = event.capacity - totalBookedTickets
  const isPastEvent = new Date(event.date) < new Date()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center space-x-4">
              <Badge variant={isPastEvent ? "secondary" : availableSpots <= 0 ? "destructive" : "default"}>
                {isPastEvent ? "Past Event" : availableSpots <= 0 ? "Fully Booked" : "Available"}
              </Badge>
              <Badge variant="outline">{event.category}</Badge>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/events/${event.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(event.date), "PPPP")}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-sm text-muted-foreground">${event.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        {totalBookedTickets} / {event.capacity} booked
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {bookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirmed Bookings ({bookings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookings.map((booking, index) => (
                      <div key={booking.id}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{booking.attendeeName}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""} • ${booking.totalAmount}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        {index < bookings.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            {!isPastEvent && <BookingForm event={event} availableSpots={availableSpots} onSuccess={fetchEventData} />}
          </div>
        </div>
      </div>
    </div>
  )
}
