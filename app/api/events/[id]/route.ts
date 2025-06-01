import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { eventSchema } from "@/lib/validations"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await Promise.resolve(params)
    const event = await prisma.event.findUnique({
      where: { id: id },
      include: {
        bookings: true,
        _count: {
          select: { bookings: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = eventSchema.parse(body)
    const { id } = await Promise.resolve(params)
    const event = await prisma.event.update({
      where: { id: id },
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
    })

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await Promise.resolve(params)
    // Check if event has bookings
    const bookingsCount = await prisma.booking.count({
      where: { eventId: id },
    })

    if (bookingsCount > 0) {
      return NextResponse.json({ success: false, error: "Cannot delete event with existing bookings" }, { status: 400 })
    }

    await prisma.event.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 })
  }
}
