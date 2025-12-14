import { z } from "zod";

export const eventFormSchema = z.object({
  event_name: z.string().min(3, "Title must be atleast 3 characters"),
  description: z
    .string()
    .min(3, "Description must be atleast 3 characters")
    .max(400, "Description must be less than 400 characters"),
  venue: z
    .string()
    .min(3, "Venue must be atleast 3 characters")
    .max(400, "Venue must be less than 400 characters"),
  event_date: z.date(),
  price: z.transform(Number).pipe(z.number().min(0)),
  slug: z.string(),
  event_type: z.enum(["P", "R"]),
  form_url: z.url(),
  image_url: z.url(),
  visibility: z.string(),
  university: z.transform(Number).pipe(z.number()),
  // tickets_sold: z.number(),
  // total_rsvps: z.number(),
});
export const studentFormSchema = z.object({
  name: z.string().min(3, "Title must be atleast 3 characters"),
  email: z.email(),
  password: z.string().min(8, "Title must be atleast 3 characters"),
  university: z.transform(Number).pipe(z.number()),
  // ticket_count: z.number(),
  // rsvp_count: z.number(),
});
export const universityFormSchema = z.object({
  name: z.string().min(3, "Title must be atleast 3 characters"),
  email: z.email(),
  password: z.string().min(8, "Title must be atleast 3 characters"),
  logo_url: z.url(),
  total_events: z.transform(Number).pipe(z.number()),
  total_rsvps: z.transform(Number).pipe(z.number()),
  total_tickets: z.transform(Number).pipe(z.number()),
});
export const adminFormSchema = z.object({
  username: z.string().min(3, "Title must be atleast 3 characters"),
  password: z.string().min(8, "Title must be atleast 3 characters"),
});
