"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/lib/models";
import { formatDateTime } from "@/lib/utils";

export default function EventPosterSlider({ events }: { events: Event[] }) {
  const displayedEvents = events.slice(0, 8);
  const count = displayedEvents.length;

  return (
    <section className="wrapper">
      <Carousel
        opts={{
          align: count < 3 ? "center" : "start",
          loop: count > 3,
        }}
        plugins={
          count > 3
            ? [
                Autoplay({
                  delay: 3000,
                }),
              ]
            : []
        }
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent className={count < 3 ? "justify-center" : ""}>
          {displayedEvents.map((event) => (
            <CarouselItem
              key={event.id}
              className={
                count === 1
                  ? "basis-full"
                  : count === 2
                  ? "basis-full md:basis-1/2"
                  : "basis-4/5 md:basis-1/3"
              }
            >
              <Link
                href={`/events/${event.id}`}
                className="block relative rounded-xl overflow-hidden shadow-lg"
              >
                <Image
                  src={event.image_url}
                  alt={event.event_name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-64 transition-transform hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/35 flex flex-col justify-end p-4 text-white">
                  <h3 className="text-lg font-semibold">{event.event_name}</h3>
                  <p className="text-sm opacity-90">
                    {formatDateTime(event.event_date).dateOnly}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {count > 3 && (
          <>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </>
        )}
      </Carousel>
    </section>
  );
}
