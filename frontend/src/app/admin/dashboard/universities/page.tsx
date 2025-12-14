import DataTable from "@/components/shared/DataTable";
import { fetchUniversities } from "@/lib/middleware";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminUniversities() {
  const [universities, setUniversities] = useState<any[]>([]);
  useEffect(() => {
    async function loadUniversities() {
      try {
        const data = await fetchUniversities();
        setUniversities(data);
      } catch (error) {
        toast.error("Error Fetching universities", {
          description: "Something went wrong. Please try again.",
        });
      }
    }

    loadUniversities();
  }, []);

  const columns = [
    { key: "name", label: "University Name" },
    { key: "email", label: "Email" },
    { key: "logo_url", label: "Logo" },
    { key: "total_events", label: "Total Events" },
    { key: "total_rsvps", label: "Total RSVPs" },
    { key: "total_tickets", label: "Total Tickets" },
  ];

  return (
    <DataTable
      title="Registered Universities"
      data={universities}
      columns={columns}
    />
  );
}
