export interface Event {
  id: string
  title: string
  description?: string
  date: Date
  time: string
  location: string
  capacity: number
  price: number
  category: string
  createdAt: Date
  updatedAt: Date
  bookings?: Booking[]
  _count?: {
    bookings: number
  }
}

export interface Booking {
  id: string
  eventId: string
  attendeeName: string
  email: string
  phone: string
  tickets: number
  totalAmount: number
  createdAt: Date
  event?: Event
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
