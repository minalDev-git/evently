import { Event } from "@/lib/models";
import React from "react";
import { Button } from "../ui/button";
import { cookies } from "next/headers";
import Link from "next/link";
import Checkout from "./Checkout";

const CheckoutButton = async ({ event }: { event: Event }) => {
  const cookieStore = await cookies();
  const student = JSON.parse(cookieStore.get("student")?.value || "{}");
  const closedEvent = new Date(event.event_date) < new Date();
  //which student is purchasing the event TODO

  return (
    <div className="flex items-center gap-3">
      {/* {Cannot buy past events} */}
      {closedEvent ? (
        <p className="p-2 text-red-400">
          Sorry, Tickets are no longer available
        </p>
      ) : (
        <>
          {/* first figure out if the user is signed out */}
          {student === null ? (
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/signIn">Get Tickets</Link>
            </Button>
          ) : (
            /* if the user is signed in */
            <Checkout event={event} userId={student.id} />
          )}
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
