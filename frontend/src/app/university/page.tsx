import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getUniversityEvents } from "@/lib/middleware";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

const AllUniversityEvents = async () => {
  const cookieStore = await cookies();
  const university = JSON.parse(cookieStore.get("university")?.value || "{}");
  const events = await getUniversityEvents(university.id);
  return (
    <>
      <section className="bg-primary-100 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href={"/university/create_event"}>Create New Events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={events}
          emptyTitle="No Events Posted"
          emptyStateSubtext="Create Your First Event"
          collectionType="Events_Organized"
          limit={6}
          page={1}
          totalPages={2}
        />
      </section>
    </>
  );
};

export default AllUniversityEvents;
