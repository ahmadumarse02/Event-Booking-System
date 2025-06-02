"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/types"
import { eventsApi } from "@/lib/api"
import { LoadingSpinner } from "./loading-spinner"
import { useToast } from "@/hooks/use-toast"

interface EventCardProps {
  event: Event
  onDelete?: () => void
}

export function EventCard({ event, onDelete }: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const totalBookedTickets = event.bookings?.reduce((sum, booking) => sum + booking.tickets, 0) || 0
  const availableSpots = event.capacity - totalBookedTickets
  const isFullyBooked = availableSpots <= 0
  const isPastEvent = new Date(event.date) < new Date()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return

    setIsDeleting(true)
    try {
      await eventsApi.delete(event.id)
      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
      onDelete?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
          <Badge variant={isPastEvent ? "destructive" : isFullyBooked ? "destructive" : "success"}>
            {isPastEvent ? "Past" : isFullyBooked ? "Full" : "Available"}
          </Badge>
        </div>
        {event.description && <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>}
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(event.date), "PPP")}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{event.time}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {availableSpots} / {event.capacity} spots available
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>{event.price}</span>
        </div>

        <Badge variant="outline">{event.category}</Badge>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="flex w-full space-x-2">
          <Button asChild className="flex-1">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          {!isPastEvent && !isFullyBooked && (
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/events/${event.id}#book`}>Book Now</Link>
            </Button>
          )}
        </div>

        <div className="flex w-full space-x-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/events/${event.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <LoadingSpinner size="sm" /> : "Delete"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
