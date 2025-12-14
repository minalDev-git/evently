import TicketsClient from "@/components/shared/Tickets";
import { cookies } from "next/headers";
import React from "react";

const StudentTickets = async () => {
  const cookieStore = await cookies();
  const student = JSON.parse(cookieStore.get("student")?.value || "{}");
  return (
    <div>
      <TicketsClient id={student.id} role="student" />
    </div>
  );
};

export default StudentTickets;
