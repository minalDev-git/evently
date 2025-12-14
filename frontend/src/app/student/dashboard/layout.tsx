"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navLinks = [
    { name: "Dashboard Home", href: "/student/dashboard/" },
    { name: "Profile", href: "/student/profile/" },
    {
      name: "Your Paid Registrations",
      href: "/student/paid-registrations/",
    },
    { name: "Your RSVPs", href: "/student/free-rsvps/" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-200 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-primary-600">
            Student Panel
          </h2>
        </div>

        <nav className="mt-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-6 py-2.5 rounded-md mx-2 text-sm font-medium transition 
                ${
                  pathname === link.href
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              Student Dashboard
            </h1>
          </div>

          {/* Profile section */}
          <div className="flex items-center gap-3">
            <img
              src="/images/student-avatar.png"
              alt="Student Avatar"
              className="w-9 h-9 rounded-full border"
            />
            <span className="hidden sm:block text-sm text-gray-700 font-medium">
              Welcome, Student!
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
