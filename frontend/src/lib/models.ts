// src/types/api.ts

export interface University {
  id: number;
  name: string;
  email: string;
  password: string;
  logo_url: string;
  total_events: number;
  total_rsvps: number;
  total_tickets: number;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  password: string;
  university: number; //university_id
  ticket_count: number;
  rsvp_count: number;
}

export interface Event {
  id: number;
  event_name: string;
  description: string;
  venue: string;
  event_date: Date; // ISO format, e.g. "2025-10-28T14:00:00Z"
  price: number;
  slug: string;
  event_type: "P" | "R";
  form_url: string;
  image_url: string;
  visibility: "Pub" | "Pri";
  university: number;
  tickets_sold: number;
  total_rsvps: number;
}

export interface Registration {
  id: number;
  event: number;
  student: number;
}

export interface Ticket {
  event: number;
  student: number;
  stripe_id: number;
  registration_id: number;
  status: "Paid" | "Cancelled";
}

export interface RSVP {
  event: number;
  student: number;
  registration_id: number;
  status: "interested" | "denied";
  timestamp: Date;
}
export interface TokenResponse {
  access: string;
  refresh: string;
}
