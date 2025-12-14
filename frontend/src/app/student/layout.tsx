"use client";

import ProtectedRoutes from "@/components/ProtectedRoutes";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoutes allowRoles={["student"]}>
      <div className="flex-1 flex flex-col">
        {/* Page content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </ProtectedRoutes>
  );
}
