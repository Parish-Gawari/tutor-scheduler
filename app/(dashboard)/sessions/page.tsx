"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSessions() {
    setLoading(true);
    const res = await fetch("/api/sessions", { cache: "no-store" });
    const data = await res.json();
    setSessions(data);
    setLoading(false);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this session?");
    if (!ok) return;

    const res = await fetch(`/api/sessions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadSessions(); // refresh list
    } else {
      alert("Failed to delete session");
    }
  }

  if (loading) return <div className="p-8">Loading sessions…</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sessions</h1>

        <Link
          href="/sessions/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create Session
        </Link>
      </div>

      <div className="grid gap-4">
        {sessions.map((s: any) => (
          <div key={s._id} className="border p-4 rounded bg-white shadow-sm">
            <h2 className="font-bold">{s.title}</h2>

            <p className="text-sm text-gray-600">
              {s.date} | {s.startTime} - {s.endTime}
            </p>

            <p className="text-sm mt-1">Status: {s.status}</p>

            <div className="flex gap-4 mt-4">
              <Link
                href={`/sessions/${s._id}/edit`}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(s._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {sessions.length === 0 && (
          <p className="text-gray-500 text-sm">No sessions found.</p>
        )}
      </div>
    </div>
  );
}
