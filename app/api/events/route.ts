import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { eventSchema } from "@/lib/validations"

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { date: "asc" },
    })

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
    })

    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 400 })
  }
}
