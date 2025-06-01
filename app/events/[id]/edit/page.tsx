"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { EventForm } from "@/components/event-form"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Event } from "@/types"
import { eventsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditEventPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsApi.getById(params.id as string)
        setEvent(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch event details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EventForm event={event} mode="edit" />
    </div>
  )
}
