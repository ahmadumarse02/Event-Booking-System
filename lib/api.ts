import axios from "axios"
import type { Event, Booking, ApiResponse } from "@/types"
import type { EventFormData, BookingFormData } from "@/lib/validations"

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Events API
export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get<ApiResponse<Event[]>>("/events")
    return response.data.data || []
  },

  getById: async (id: string): Promise<Event> => {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`)
    if (!response.data.data) throw new Error("Event not found")
    return response.data.data
  },

  create: async (data: EventFormData): Promise<Event> => {
    const response = await api.post<ApiResponse<Event>>("/events", data)
    if (!response.data.data) throw new Error("Failed to create event")
    return response.data.data
  },

  update: async (id: string, data: EventFormData): Promise<Event> => {
    const response = await api.put<ApiResponse<Event>>(`/events/${id}`, data)
    if (!response.data.data) throw new Error("Failed to update event")
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`)
  },
}

// Bookings API
export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>("/bookings")
    return response.data.data || []
  },

  create: async (data: BookingFormData): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>("/bookings", data)
    if (!response.data.data) throw new Error("Failed to create booking")
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`)
  },

  getByEventId: async (eventId: string): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>(`/events/${eventId}/bookings`)
    return response.data.data || []
  },
}
