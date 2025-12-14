"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", registrations: 42 },
  { month: "Feb", registrations: 65 },
  { month: "Mar", registrations: 38 },
  { month: "Apr", registrations: 71 },
  { month: "May", registrations: 54 },
];

export default function UniversityDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">University Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md rounded-2xl border-l-4 border-blue-600">
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">Popular Event</h2>
            <p className="text-xl font-semibold mt-2">
              AI & Data Science Summit
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md rounded-2xl border-l-4 border-green-600">
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">Total Events Posted</h2>
            <p className="text-3xl font-bold mt-2">8</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md rounded-2xl border-l-4 border-indigo-500">
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">Paid Events</h2>
            <p className="text-3xl font-bold mt-2">3</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md rounded-2xl border-l-4 border-yellow-500">
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">Free Events</h2>
            <p className="text-3xl font-bold mt-2">5</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Monthly Student Registrations
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="registrations" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
