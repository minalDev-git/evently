"use client";

const mockFreeRsvps = [
  { id: 1, eventName: "Open Source Meetup", date: "2025-07-18" },
  { id: 2, eventName: "Startup Pitch Night", date: "2025-09-02" },
];

export default function FreeRsvpsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Free Event RSVPs</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Event Name</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockFreeRsvps.map((rsvp) => (
              <tr key={rsvp.id} className="border-t">
                <td className="px-4 py-2">{rsvp.eventName}</td>
                <td className="px-4 py-2">{rsvp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
