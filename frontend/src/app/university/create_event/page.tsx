import Collection from "@/components/shared/Collection";
import EventForm from "@/components/shared/EventForm";
import EventPosterSlider from "@/components/shared/EventPosterSlider";
import { Button } from "@/components/ui/button";
import { getUniversityEvents } from "@/lib/middleware";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

const CreateEvent = async () => {
  const cookieStore = await cookies();
  const university = JSON.parse(cookieStore.get("university")?.value || "{}");
  const events = await getUniversityEvents(university.id);
  return (
    <>
      <section className="bg-primary-100 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            Events By This University
          </h3>
          <Button asChild className="button hidden sm:flex">
            <Link href={"/dashboard"}>View Stats</Link>
          </Button>
        </div>
      </section>
      {events.length < 4 ? (
        <section className="wrapper">
          <Collection
            data={events}
            emptyTitle="No Events Created"
            emptyStateSubtext="Create Some Now"
            collectionType="Event_Posted" //TODO: change this to Events_Organized
            limit={6}
            page={1}
            totalPages={2}
          />
        </section>
      ) : (
        <EventPosterSlider events={events} />
      )}

      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>
      <div className="wrapper">
        <EventForm
          universityId={university.id}
          universityName={university.name}
          type="Create"
        />
      </div>
    </>
  );
};

export default CreateEvent;
