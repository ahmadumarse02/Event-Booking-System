"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "./loading-spinner"
import type { Event } from "@/types"
import { type BookingFormData, bookingSchema } from "@/lib/validations"
import { bookingsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface BookingFormProps {
  event: Event
  availableSpots: number
  onSuccess?: () => void
}

export function BookingForm({ event, availableSpots, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventId: event.id,
      tickets: 1,
    },
  })

  const tickets = watch("tickets")
  const totalAmount = tickets * event.price

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      await bookingsApi.create(data)
      toast({
        title: "Success",
        description: "Booking created successfully!",
      })
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create booking",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (availableSpots <= 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">This event is fully booked.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id="book">
      <CardHeader>
        <CardTitle>Book Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attendeeName">Attendee Name</Label>
            <Input id="attendeeName" {...register("attendeeName")} placeholder="Enter your full name" />
            {errors.attendeeName && <p className="text-sm text-destructive">{errors.attendeeName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="Enter your email" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} placeholder="Enter your phone number" />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tickets">Number of Tickets</Label>
            <Select value={tickets?.toString()} onValueChange={(value) => setValue("tickets", Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select number of tickets" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.min(availableSpots, 10) }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} ticket{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tickets && <p className="text-sm text-destructive">{errors.tickets.message}</p>}
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {tickets} ticket{tickets > 1 ? "s" : ""} × ${event.price} each
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              `Book ${tickets} Ticket${tickets > 1 ? "s" : ""}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
