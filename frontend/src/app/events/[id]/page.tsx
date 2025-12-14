import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import {
  getEventDetails,
  getUniversityDetails,
  getUniversityEvents,
} from "@/lib/middleware";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { toast } from "sonner";

// type EventDetailsPageProps = {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

export default async function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const eventId = Number(id);

  const event = await getEventDetails(eventId);
  //console.log(event.university);

  if (!event) {
    return notFound();
  }

  const university = await getUniversityDetails(event.university);

  const relatedEvents = await getUniversityEvents(university.id);
  // page = searchParams.page as string;
  if (!event) {
    // You should handle the case where the event is not found
    return toast.info("Error displaying the Event", {
      description: "You haven't created any events",
    });
  }
  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl w-auto">
          <Image
            src={event.image_url}
            alt="event image"
            width={1000}
            height={1000}
            className="h-auto min-h-[300px] object-cover object-center"
          />
          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.event_name}</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.event_type === "P" ? `$ ${event.price}` : "FREE"}
                  </p>
                  <p className="p-bold-20 rounded-full bg-blue-500/10 px-5 py-2 text-blue-950">
                    {event.visibility === "Pub" ? "Public" : "Private"}
                  </p>
                  <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                    by{" "}
                    <span className="text-primary-500">{university.name}</span>
                  </p>
                </div>
              </div>
              {/* CHECKOUT BUTTON */}
              <CheckoutButton event={event} />
              <div className="flex flex-col gap-5">
                <div className="flex gap-2 md:gap-3">
                  <Image
                    src="/assets/icons/calendar.svg"
                    alt="calendar"
                    width={32}
                    height={32}
                  />
                  <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                    <p className="ml-1">
                      {formatDateTime(event.event_date).dateOnly}
                    </p>
                  </div>
                </div>
                <div className="p-regular-20 flex items-center gap-3">
                  <Image
                    src="/assets/icons/location.svg"
                    alt="venue"
                    width={32}
                    height={32}
                  />
                  <p className="p-medium-16 lg:p-regular-20">{event.venue}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="p-bold-20 text-gray-600">About the Event</p>
                <p className="p-medium-16 lg:p-regular-18">
                  {event.description}
                </p>
                <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
                  {event.form_url}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* EVENTS FROM THE SAME ORGANIZER */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>
        <Collection
          data={relatedEvents}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come Back Later"
          collectionType="All_Events"
          limit={6}
          page={1}
          totalPages={2}
        />
      </section>
    </>
  );
}
