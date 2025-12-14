import ProtectedRoutes from "@/components/ProtectedRoutes";
import EventForm from "@/components/shared/EventForm";
import { getEventDetails } from "@/lib/middleware";
import { cookies } from "next/headers";
import React from "react";
import { toast } from "sonner";

type EventDetailsPageProps = {
  params: {
    id: string; // The dynamic segment from the URL
  };
};

const UpdateEvent = async ({ params }: EventDetailsPageProps) => {
  const { id } = await params;
  const eventId = Number(id); // convert string to number

  const event = await getEventDetails(eventId);

  if (!event) {
    // You should handle the case where the event is not found
    return toast.info("No Events to Show", {
      description: "You haven't created any events",
    });
  }
  const cookieStore = await cookies();
  const university = JSON.parse(cookieStore.get("university")?.value || "{}");
  return (
    <ProtectedRoutes allowRoles={["university"]}>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm
          universityId={university.id}
          event={event}
          eventId={eventId}
          universityName={university.name}
          type="Update"
        />
      </div>
    </ProtectedRoutes>
  );
};

export default UpdateEvent;
