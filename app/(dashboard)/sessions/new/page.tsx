"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateSessionPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [tutors, setTutors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    tutor: "",
    students: [] as string[],
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  useEffect(() => {
    // RBAC: redirect student
    if (session?.user?.role === "student") router.push("/dashboard");
  }, [session, router]);

  useEffect(() => {
    async function load() {
      const [tRes, sRes] = await Promise.all([
        fetch("/api/users?role=tutor"),
        fetch("/api/users?role=student"),
      ]);
      setTutors(await tRes.json());
      setStudents(await sRes.json());
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: form.title,
      tutor: form.tutor,
      students: form.students,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: form.notes,
      startAt: form.date + "T" + form.startTime + ":00",
      endAt: form.date + "T" + form.endTime + ":00",
    };

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/sessions");
    } else {
      const err = await res.json();
      alert(err?.error || "Failed to create session");
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Create Session</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-medium">Tutor</label>
          <select
            required
            value={form.tutor}
            onChange={(e) => setForm({ ...form, tutor: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="">Select a tutor</option>
            {tutors.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Students</label>
          <select
            multiple
            value={form.students}
            onChange={(e) =>
              setForm({
                ...form,
                students: Array.from(e.target.selectedOptions, (o) => o.value),
              })
            }
            className="w-full border p-2 rounded mt-1 h-40"
          >
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold Ctrl / Cmd to multi-select
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-medium">Date</label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Start</label>
            <input
              required
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">End</label>
            <input
              required
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
