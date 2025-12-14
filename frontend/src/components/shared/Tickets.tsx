"use client";

import DataTable from "@/components/shared/DataTable";
import { getStudentTickets, getUniversityTickets } from "@/lib/middleware";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TicketsClient({
  id,
  role,
}: {
  id: number;
  role: "student" | "university";
}) {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    async function loadTickets() {
      try {
        if (role === "student") {
          setTickets(await getStudentTickets(id));
        } else if (role === "university") {
          setTickets(await getUniversityTickets(id));
        }
      } catch (error) {
        toast.error("Error Fetching Tickets", {
          description: "Something went wrong. Please try again.",
        });
      }
    }

    loadTickets();
  }, [id]);

  const columns =
    role == "student"
      ? [
          { key: "ticketId", label: "Ticket ID" },
          { key: "eventName", label: "Event" },
          { key: "price", label: "Price" },
          { key: "boughtOn", label: "Bought On" },
        ]
      : [
          { key: "ticketId", label: "Ticket ID" },
          { key: "eventName", label: "Event Name" },
          { key: "buyer", label: "Buyer Email" },
          { key: "issuedOn", label: "Issued On" },
        ];

  return (
    <DataTable title="Tickets For Events" data={tickets} columns={columns} />
  );
}
