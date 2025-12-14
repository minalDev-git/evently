import { Event } from "@/lib/models";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cookies } from "next/headers";
import { getUniversityDetails } from "@/lib/middleware";

type CardProps = {
  event: Event;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};
const Card = async ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const cookieStore = await cookies();
  const uni = JSON.parse(cookieStore.get("university")?.value || "{}");
  const isEventCreator = event.id === uni.id ? true : false;
  const university = await getUniversityDetails(event.university);
  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event.id}`}
        style={{ backgroundImage: `url(${event.image_url})` }}
        className="flex-center flex-grow bg-gray-100 bg-cover bg-center text-gray-500"
      ></Link>

      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event.id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>

          <DeleteConfirmation eventId={event.id} />
        </div>
      )}

      <div
        // href={`/events/${event.id}`}
        className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4"
      >
        {!hidePrice && (
          <div className="flex flex-wrap gap-2 mt-2 justify-between">
            {/* Price / Free Badge */}
            <span className="px-3 py-1 rounded-full text-base font-semibold bg-green-100 text-green-700 line-clamp-1">
              {event.event_type === "R" ? "FREE" : `$${event.price}`}
            </span>

            {/* Visibility Badge */}
            <span className="px-3 py-1 rounded-full text-base font-semibold bg-blue-100 text-blue-700 line-clamp-1">
              {event.visibility === "Pub" ? "Public" : "Private"}
            </span>

            {/* Slug Badge */}
            {/* <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 line-clamp-1">
              {event.slug}
            </span> */}
          </div>
        )}

        {/* ✅ University Avatar & Name */}
        <div className="flex items-center gap-3 mt-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={university.logo_url ?? ""}
              alt={university.name}
            />
            <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
              {university.name?.substring(0, 2).toUpperCase() ?? "UN"}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm font-medium text-gray-700 truncate">
            {university.name}
          </p>
        </div>

        <p className="p-medium-16 text-gray-500">
          {formatDateTime(event.event_date).dateOnly}
        </p>

        <Link href={`/events/${event.id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-3 flex-1 text-black">
            {event.event_name}
          </p>
        </Link>

        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-gray-600">
            {event.venue}
          </p>

          {event.tickets_sold > 0 && hasOrderLink !== false && (
            <Link href={`/tickets?eventId=${event.id}`} className="flex gap-2">
              <p className="text-primary">Ticket Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )}
          {event.total_rsvps > 0 && hasOrderLink !== false && (
            <Link href={`/tickets?eventId=${event.id}`} className="flex gap-2">
              <p className="text-primary">RSVP Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
