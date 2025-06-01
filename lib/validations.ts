import { z } from "zod"

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(1000, "Capacity cannot exceed 1000"),
  price: z.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
})

export const bookingSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  attendeeName: z.string().min(1, "Attendee name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  tickets: z.number().min(1, "At least 1 ticket is required"),
})

export type EventFormData = z.infer<typeof eventSchema>
export type BookingFormData = z.infer<typeof bookingSchema>
