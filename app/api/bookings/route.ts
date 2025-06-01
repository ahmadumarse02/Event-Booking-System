import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { bookingSchema } from "@/lib/validations"

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        event: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Check event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      return NextResponse.json({ success: false, error: "Cannot book tickets for past events" }, { status: 400 })
    }

    // Calculate current bookings
    const currentBookings = await prisma.booking.aggregate({
      where: { eventId: validatedData.eventId },
      _sum: { tickets: true },
    })

    const bookedTickets = currentBookings._sum.tickets || 0
    const availableSpots = event.capacity - bookedTickets

    if (validatedData.tickets > availableSpots) {
      return NextResponse.json({ success: false, error: `Only ${availableSpots} tickets available` }, { status: 400 })
    }

    const totalAmount = validatedData.tickets * event.price

    const booking = await prisma.booking.create({
      data: {
        ...validatedData,
        totalAmount,
      },
      include: {
        event: true,
      },
    })

    return NextResponse.json({ success: true, data: booking }, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 400 })
  }
}
