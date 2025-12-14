"use client";

import ProtectedRoutes from "@/components/ProtectedRoutes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/university/dashboard", label: "Dashboard" },
  { href: "/university/dashboard/events/", label: "All Events" },
  {
    href: "/university/dashboard/paid-registrations/",
    label: "Paid Event Registrations",
  },
  { href: "/university/dashboard/free-rsvps", label: "Free Event RSVPs" },
];

export default function UniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ProtectedRoutes allowRoles={["university"]}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
          <div>
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-primary">
                University Panel
              </h1>
            </div>
            <nav className="p-4 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition ${
                    pathname === link.href
                      ? "bg-primary text-white"
                      : "text-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <button className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </ProtectedRoutes>
  );
}
