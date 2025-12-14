"use client";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  // --- UI state ---
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "events" | "students" | "universities"
  >("dashboard");
  const [query, setQuery] = useState("");

  // --- Tabs UI ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Admin Dashboard
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        {["dashboard", "events", "students", "universities"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(
                tab as "dashboard" | "events" | "students" | "universities"
              )
            }
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
