import EventPosterSlider from "@/components/shared/EventPosterSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { attendedEvents, getUniversityEvents } from "@/lib/middleware";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const StdLandingPage = async () => {
  const cookieStore = await cookies();
  const student = JSON.parse(cookieStore.get("student")?.value || "{}");
  const events = await attendedEvents(student.id);
  const uniEvents = await getUniversityEvents(student.university.id);
  return (
    <>
      {/* Student's Attended Events */}
      <section className="bg-primary-100 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper">
          <div className="flex items-center justify-between mb-4">
            <h3 className="h3-bold">Events You Attended</h3>

            <Button asChild className="button hidden sm:flex">
              <Link href="/student/paid-registrations">View Tickets</Link>
            </Button>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event: any) => (
                <Card key={event.id} className="overflow-hidden">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    width={400}
                    height={250}
                    className="h-[180px] w-full object-cover"
                  />

                  <CardContent className="p-4 space-y-2">
                    <h4 className="font-semibold text-lg line-clamp-1">
                      {event.title}
                    </h4>

                    <p className="text-sm text-gray-500 line-clamp-2">
                      {event.description}
                    </p>

                    <Link
                      href={`/events/${event.id}`}
                      className="text-primary-600 font-medium text-sm inline-block"
                    >
                      View Event →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xl font-semibold mb-2 text-gray-500 text-center">
              You haven’t attended any events yet.
            </p>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl h3-bold mb-4 my-1.5 text-center">
          Events from Your University
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniEvents.length > 0 && (
            <section className="my-8">
              <EventPosterSlider events={uniEvents} />
            </section>
          )}
        </div>
      </div>
      <section className="wrapper my-16">
        <div
          className="
          relative overflow-hidden rounded-3xl shadow-lg
          bg-gradient-to-br from-primary-200 via-white to-primary-100
          py-16 px-6 sm:px-12 lg:px-20
          flex flex-col items-center text-center gap-6
        "
        >
          <div className="absolute inset-0 opacity-20 bg-[url('/images/blur-pattern.svg')] bg-cover bg-center"></div>

          <h2 className="text-3xl md:text-4xl font-bold max-w-3xl">
            “Great opportunities often come disguised as events. Show up — your
            future self will thank you.”
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Participate, network, and grow with exciting events happening at
            your campus.
          </p>

          <Button asChild className="px-8 py-6 text-lg relative z-10">
            <Link href="/events">Discover Events</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default StdLandingPage;
