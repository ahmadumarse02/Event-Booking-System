import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Event Booking System
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Create and manage your events with real-time booking and capacity
          tracking.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/events"
          >
            <Button variant="default">Browse Events</Button>
          </Link>
          <Link
            href="/events/create"
          >
            <Button variant="outline">Create Event</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12">Why Use Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900">
              <h3 className="text-xl font-bold mb-2">Create Events Easily</h3>
              <p className="text-gray-700 dark:text-gray-300">
                A user-friendly form to create events with date, time, location,
                and more.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900">
              <h3 className="text-xl font-bold mb-2">Real-Time Booking</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Bookings are tracked in real time with availability checks and
                automatic updates.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900">
              <h3 className="text-xl font-bold mb-2">Manage Attendees</h3>
              <p className="text-gray-700 dark:text-gray-300">
                View and manage attendee bookings with full details and control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Ready to host your next event?
        </h2>
        <Link
          href="/events/create"
        >
          <Button variant="default">Get Started</Button>
        </Link>
      </section>
    </main>
  );
}