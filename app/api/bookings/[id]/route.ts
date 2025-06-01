import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id} = await Promise.resolve(params)
    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: { event: true },
    })

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    // Check if event is in the future
    if (new Date(booking.event.date) < new Date()) {
      return NextResponse.json({ success: false, error: "Cannot cancel booking for past events" }, { status: 400 })
    }

    await prisma.booking.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ success: false, error: "Failed to cancel booking" }, { status: 500 })
  }
}
