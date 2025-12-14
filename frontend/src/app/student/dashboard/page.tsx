"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { month: "Jan", events: 3 },
  { month: "Feb", events: 5 },
  { month: "Mar", events: 2 },
  { month: "Apr", events: 6 },
  { month: "May", events: 4 },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderDashboard = () => (
    <>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-semibold">Total Registrations</h3>
            <p className="text-3xl font-bold mt-2">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-semibold">Total RSVPs</h3>
            <p className="text-3xl font-bold mt-2">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-semibold">Paid Event Registrations</h3>
            <p className="text-3xl font-bold mt-2">6</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-semibold">Event Attendance Rate</h3>
            <p className="text-3xl font-bold mt-2">75%</p>
          </CardContent>
        </Card>
      </div>

      {/* Graph */}
      <Card className="mb-5">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Events Attended Over Months
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "allEvents":
        return <div>📅 All Events Grid</div>;
      case "paidEvents":
        return <div>💰 All Paid Event Registrations</div>;
      case "rsvps":
        return <div>🎟️ All Free Event RSVPs</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
