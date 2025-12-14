"use server";
import { DJANGO_API_ENDPOINT } from "@/config/details";
import { RSVP, Student, Ticket, University, Event } from "./models";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// const DJANGO_API_ENDPOINT = `${process.env.NEXT_PUBLIC_DJANGO_API_ENDPOINT}`;

async function saveTokens(access: string, refresh: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", access, { httpOnly: true });
  cookieStore.set("refreshToken", refresh, { httpOnly: true });
}

{
  /*ADMIN FUNCTIONS*/
}

export async function fetchUniversities(): Promise<University[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || null;
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/universities/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch universities");
  }
}
export async function getUniversityDetails(id: number): Promise<University> {
  try {
    const response = await axios.get(
      `${DJANGO_API_ENDPOINT}/universities/${id}/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to get university details");
  }
}

export async function registerUniversity(university: any): Promise<University> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || null;

    const response = await axios.post(
      `${DJANGO_API_ENDPOINT}/universities/signup/`,
      university,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const {
      access,
      refresh,
      id,
      name,
      email,
      logo_url,
      total_events,
      total_rsvps,
      total_tickets,
    } = response.data;
    await saveTokens(access, refresh);
    cookieStore.set("role", "admin", { httpOnly: true });
    cookieStore.set(
      "university",
      JSON.stringify({
        id,
        name,
        email,
        logo_url,
        total_events,
        total_rsvps,
        total_tickets,
      }),
      {
        httpOnly: false,
      }
    );

    saveTokens(access, refresh);
    return response.data;
  } catch (error) {
    throw new Error("Failed to register university");
  }
}

export async function fetchStudents(): Promise<Student[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || null;

    const response = await axios.get(`${DJANGO_API_ENDPOINT}/students/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch students");
  }
}

export async function getUniversitiesList(): Promise<University[]> {
  try {
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/universities/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch universities");
  }
}

export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/events`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch events");
  }
}
export async function getUniversityEvents(
  universityId: number
): Promise<Event[]> {
  try {
    const response = await axios.get(
      `${DJANGO_API_ENDPOINT}/universities/${universityId}/events/`
    );
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data?.detail);
    throw new Error(error.response?.data?.detail || "Failed to fetch events");
  }
}

// UNIVERSITY VIEW

export async function createEvent(event: any): Promise<Event> {
  try {
    const response = await axios.post(`${DJANGO_API_ENDPOINT}/events/`, event);
    return response.data;
  } catch (error: any) {
    //console.log("EVENT CREATE ERROR RESPONSE:", error.response?.data);
    throw new Error(error.response?.data || "Failed to create event");
  }
}
export async function deleteEvent(id: number, pathname: string): Promise<void> {
  try {
    await axios.delete(`${DJANGO_API_ENDPOINT}/events/${id}`);
    revalidatePath(pathname);
  } catch (error: any) {
    //console.log("EVENT DELETE ERROR RESPONSE:", error.response?.data);
    throw new Error(error.response?.data || "Failed to delete event");
  }
}
export async function updateEvent(id: number, eventData: any): Promise<any> {
  try {
    const response = await axios.put(
      `${DJANGO_API_ENDPOINT}/events/${id}/`,
      eventData
    );
    return response.data;
  } catch (error: any) {
    //console.log("EVENT Update ERROR RESPONSE:", error.response?.data);
    throw new Error(error.response?.data || "Failed to update event");
  }
}

export async function getEventDetails(id: number): Promise<Event> {
  try {
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to get Event");
  }
}

// STUDENT VIEW

export async function getStudentDetails(id: number): Promise<University> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || null;
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/students/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to get student details");
  }
}

export async function deleteStudent(id: number): Promise<void> {
  try {
    await axios.delete(`${DJANGO_API_ENDPOINT}/students/${id}`);
  } catch (error: any) {
    //console.log("Student DELETE ERROR RESPONSE:", error.response?.data);
    throw new Error(error.response?.data || "Failed to delete Student");
  }
}
export async function updateStudent(
  id: number,
  studentData: any
): Promise<any> {
  try {
    const response = await axios.put(
      `${DJANGO_API_ENDPOINT}/students/${id}/`,
      studentData
    );
    return response.data;
  } catch (error: any) {
    //console.log("student Update ERROR RESPONSE:", error.response?.data);
    throw new Error(error.response?.data || "Failed to update student");
  }
}

export async function attendedEvents(id: number): Promise<Event[]> {
  try {
    const response = await axios.get(
      `${DJANGO_API_ENDPOINT}/students/${id}/events/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch events");
  }
}

export async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/tickets/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch tickets");
  }
}
export async function createTicket(ticket: any): Promise<Ticket> {
  try {
    const response = await axios.post(
      `${DJANGO_API_ENDPOINT}/tickets/`,
      ticket
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Failed to create ticket");
  }
}

export async function deleteTicket(
  id: number,
  pathname: string
): Promise<void> {
  try {
    await axios.delete(`${DJANGO_API_ENDPOINT}/tickets/${id}`);
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(error.response?.data || "Failed to delete ticket");
  }
}
// export async function updateTicket(id: number, ticketData: any): Promise<any> {
//   try {
//     const response = await axios.put(
//       `${DJANGO_API_ENDPOINT}/tickets/${id}/`,
//       ticketData
//     );
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data || "Failed to update ticket");
//   }
// }

export async function getTicketDetails(id: number): Promise<Ticket> {
  try {
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to get tickets");
  }
}

export async function fetchRSVPs(): Promise<RSVP[]> {
  try {
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/rsvps/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch rsvps");
  }
}
export async function createRSVP(rsvp: any): Promise<RSVP> {
  try {
    const response = await axios.post(`${DJANGO_API_ENDPOINT}/rsvps/`, rsvp);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Failed to create rsvp");
  }
}
export async function deleteRSVP(id: number, pathname: string): Promise<void> {
  try {
    await axios.delete(`${DJANGO_API_ENDPOINT}/rsvps/${id}`);
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(error.response?.data || "Failed to delete rsvps");
  }
}
// export async function updateTicket(id: number, rsvpData: any): Promise<any> {
//   try {
//     const response = await axios.put(
//       `${DJANGO_API_ENDPOINT}/rsvps/${id}/`,
//       rsvpData
//     );
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data || "Failed to update rsvps");
//   }
// }

export async function getRSVPDetails(id: number): Promise<RSVP> {
  try {
    const response = await axios.get(`${DJANGO_API_ENDPOINT}/rsvps/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to get rsvps");
  }
}
export async function getStudentTickets(id: number): Promise<Ticket[]> {
  try {
    const response = await axios.get(
      `${DJANGO_API_ENDPOINT}/students/${id}/tickets/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch tickets");
  }
}

export async function getStudentRSVPs(id: number): Promise<RSVP[]> {
  try {
    const response = await axios.get(
      `${DJANGO_API_ENDPOINT}/students/${id}/rsvps/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch rsvps");
  }
}
export async function getUniversityTickets(id: number): Promise<Ticket[]> {
  try {
    const response = await axios.get(
      `${DJANGO_API_ENDPOINT}/universities/${id}/tickets/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch tickets");
  }
}

export async function getUniversityRSVPs(id: number): Promise<RSVP[]> {
  try {
    const response = await axios.get(
      `${DJANGO_API_ENDPOINT}/universities/${id}/rsvps/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch rsvps");
  }
}
