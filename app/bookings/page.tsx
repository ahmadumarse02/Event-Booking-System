"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Booking } from "@/types"
import { bookingsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.getAll()
      setBookings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    setDeletingId(bookingId)
    try {
      await bookingsApi.delete(bookingId)
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      })
      fetchBookings()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to cancel booking",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground mt-2">Manage all event bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
          <p className="text-muted-foreground">Bookings will appear here once events are booked</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isPastEvent = booking.event && new Date(booking.event.date) < new Date()

            return (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{booking.event?.title || "Unknown Event"}</h3>
                        <Badge variant={isPastEvent ? "secondary" : "default"}>
                          {isPastEvent ? "Past" : "Upcoming"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Attendee</p>
                          <p className="text-muted-foreground">{booking.attendeeName}</p>
                        </div>
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">{booking.email}</p>
                        </div>
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-muted-foreground">{booking.phone}</p>
                        </div>
                        <div>
                          <p className="font-medium">Tickets</p>
                          <p className="text-muted-foreground">
                            {booking.tickets} × ${booking.totalAmount / booking.tickets} = ${booking.totalAmount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {booking.event && (
                          <>
                            <span>
                              Event: {format(new Date(booking.event.date), "PPP")} at {booking.event.time}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span>Booked: {format(new Date(booking.createdAt), "PPP")}</span>
                      </div>
                    </div>

                    {!isPastEvent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={deletingId === booking.id}
                      >
                        {deletingId === booking.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
