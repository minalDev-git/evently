"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Event } from "@/lib/models";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { ticketPayment } from "@/lib/stripe";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const Checkout = ({ event, userId }: { event: Event; userId: string }) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const onCheckout = async () => {
    const order = {
      event: event.id,
      eventTitle: event.event_name,
      buyerId: userId,
      price: event.price,
      isFree: event.event_type == "R" ? true : false,
    };

    await ticketPayment(order);
  };
  return (
    <form action={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.event_type == "R" ? "RSVP" : "Buy Ticket"}
      </Button>
    </form>
  );
};

export default Checkout;
