"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "./loading-spinner"
import type { Event } from "@/types"
import { type EventFormData, eventSchema } from "@/lib/validations"
import { eventsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface EventFormProps {
  event?: Event
  mode: "create" | "edit"
}

const categories = [
  "Conference",
  "Workshop",
  "Seminar",
  "Networking",
  "Social",
  "Sports",
  "Entertainment",
  "Education",
  "Business",
  "Technology",
]

export function EventForm({ event, mode }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
        title: event.title,
        description: event.description || "",
        date: format(new Date(event.date), "yyyy-MM-dd"),
        time: event.time,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
        category: event.category,
      }
      : {
        capacity: 0,
        price: 0,
      },
  })

  const category = watch("category")

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === "create") {
        await eventsApi.create(data)
        toast({
          title: "Success",
          description: "Event created successfully!",
        })
        router.push("/events")
      } else if (event) {
        await eventsApi.update(event.id, data)
        toast({
          title: "Success",
          description: "Event updated successfully!",
        })
        router.push(`/events/${event.id}`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || `Failed to ${mode} event`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create New Event" : "Edit Event"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Enter event title" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Enter event description" rows={4} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} min={format(new Date(), "yyyy-MM-dd")} />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={watch("time")}
                onValueChange={(value) => setValue("time", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = i % 12 || 12;
                    const ampm = i < 12 ? "AM" : "PM";
                    const timeString = `${hour}:00 ${ampm}`;
                    return (
                      <SelectItem key={timeString} value={timeString}>
                        {timeString}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} placeholder="Enter event location" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                min="1"
                max="1000"
                placeholder="Enter maximum capacity"
              />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                min="0"
                placeholder="Enter ticket price"
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Event"
              ) : (
                "Update Event"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
