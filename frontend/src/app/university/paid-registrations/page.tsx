import TicketsClient from "@/components/shared/Tickets";
import { cookies } from "next/headers";
import React from "react";

const UniversityTickets = async () => {
  const cookieStore = await cookies();
  const student = JSON.parse(cookieStore.get("university")?.value || "{}");
  return (
    <div>
      <TicketsClient id={student.id} role="university" />
    </div>
  );
};

export default UniversityTickets;
