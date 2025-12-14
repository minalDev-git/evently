import Collection from "@/components/shared/Collection";
import { fetchEvents } from "@/lib/middleware";
import React from "react";

const AllEvents = async () => {
  const events = await fetchEvents();
  return (
    <>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">Events From All Universities</h2>

        <Collection
          data={events}
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
};

export default AllEvents;
