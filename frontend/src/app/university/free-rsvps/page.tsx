"use client";

export default function FreeRsvps() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Free Event RSVPs</h1>
      <p className="text-gray-600 mb-6">
        View all students who RSVP’d for your free events.
      </p>

      <table className="min-w-full bg-white shadow rounded-2xl overflow-hidden">
        <thead>
          <tr className="bg-primary text-white text-left">
            <th className="p-3">#</th>
            <th className="p-3">Student Name</th>
            <th className="p-3">Event</th>
            <th className="p-3">RSVP Date</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((id) => (
            <tr key={id} className="border-b hover:bg-gray-50">
              <td className="p-3">{id}</td>
              <td className="p-3">Student {id}</td>
              <td className="p-3">Event {id}</td>
              <td className="p-3">Oct 28, 2025</td>
              <td className="p-3">
                <button className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
