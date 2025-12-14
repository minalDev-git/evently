import DataTable from "@/components/shared/DataTable";
import { fetchEvents } from "@/lib/middleware";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function All_Events() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        toast.error("Error Fetching Events", {
          description: "Something went wrong. Please try again.",
        });
      }
    }

    loadEvents();
  }, []);

  const columns = [
    { key: "name", label: "Event Title" },
    { key: "email", label: "Event Date" },
    { key: "logo_url", label: "Event Type" },
    { key: "total_events", label: "Event Price" },
    { key: "total_rsvps", label: "Posted By" },
    { key: "total_tickets", label: "Tickets Sold" },
    { key: "total_rsvps", label: "Total RSVPs" },
  ];

  return (
    <DataTable title="Registered Events" data={events} columns={columns} />
  );
}
