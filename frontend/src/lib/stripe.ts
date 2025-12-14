"use server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

export const ticketPayment = async (order: any) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const price = order.isFree ? 0 : Number(order.price) * 100;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/student/paid-registrations`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/student/dashboard`,
    });

    redirect(session.url!);
  } catch (error) {
    throw new Error("Failed to checkout");
  }
};
