"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditSessionForm({ session, tutors, students }: any) {
  const router = useRouter();
  const { data } = useSession();

  // ---- ROLE ----
  const role = data?.user?.role;
  const isAdmin = role === "admin";
  const isTutor = role === "tutor";

  // ---- PREFILL FORM ----
  const [title, setTitle] = useState(session?.title || "");
  const [tutor, setTutor] = useState(session?.tutor?._id || "");
  const [selectedStudents, setSelectedStudents] = useState(
    session?.students?.map((s: any) => s._id) || [],
  );

  const [date, setDate] = useState(session.date?.split("T")[0] || "");
  const [startTime, setStartTime] = useState(
    session.startAt
      ? new Date(session.startAt).toISOString().slice(11, 16)
      : "",
  );
  const [endTime, setEndTime] = useState(
    session.endAt ? new Date(session.endAt).toISOString().slice(11, 16) : "",
  );
  const [notes, setNotes] = useState(session.notes || "");

  // ---------- MULTI SELECT HANDLER ----------
  function toggleStudent(id: string) {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  // ---------- SUBMIT ----------
  async function handleSubmit(e: any) {
    e.preventDefault();

    const startAt = new Date(`${date}T${startTime}:00`);
    const endAt = new Date(`${date}T${endTime}:00`);

    const payload = {
      title,
      tutor,
      students: selectedStudents,
      date,
      startTime,
      endTime,
      startAt,
      endAt,
      notes,
    };

    // Tutor/student restrictions
    if (isTutor) {
      payload.tutor = session.tutor?._id; // lock
      payload.students = session.students.map((s: any) => s._id); // lock
    }
    if (role === "student") {
      alert("Students cannot edit sessions");
      return;
    }

    const res = await fetch(`/api/sessions/${session._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return alert("Failed to update session");

    router.push("/sessions");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* TITLE */}
      <div>
        <label className="block font-medium">Title</label>
        <input
          className="border p-2 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={role === "student"}
          required
        />
      </div>

      {/* TUTOR (Admin only) */}
      <div>
        <label className="block font-medium">Tutor</label>

        <select
          className="border p-2 rounded w-full"
          value={tutor}
          onChange={(e) => setTutor(e.target.value)}
          disabled={!isAdmin}
          required
        >
          <option value="">Select Tutor</option>
          {tutors.map((t: any) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {!isAdmin && (
          <p className="text-xs text-gray-500">Only admin can change tutor</p>
        )}
      </div>

      {/* STUDENTS MULTI SELECT (Admin only) */}
      <div>
        <label className="block font-medium">Students</label>

        <div className="border rounded p-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
          {students.map((s: any) => (
            <label key={s._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedStudents.includes(s._id)}
                onChange={() => toggleStudent(s._id)}
                disabled={!isAdmin}
              />
              {s.name}
            </label>
          ))}
        </div>

        {!isAdmin && (
          <p className="text-xs text-gray-500">
            Only admin can change students
          </p>
        )}
      </div>

      {/* DATE */}
      <div>
        <label className="block font-medium">Date</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={role === "student"}
          required
        />
      </div>

      {/* TIME RANGE */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium">Start Time</label>
          <input
            type="time"
            className="border p-2 rounded w-full"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={role === "student"}
            required
          />
        </div>

        <div className="flex-1">
          <label className="block font-medium">End Time</label>
          <input
            type="time"
            className="border p-2 rounded w-full"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={role === "student"}
            required
          />
        </div>
      </div>

      {/* NOTES */}
      <div>
        <label className="block font-medium">Notes</label>
        <textarea
          className="border p-2 rounded w-full h-24"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={role === "student"}
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={role === "student"}
      >
        Save Changes
      </button>
    </form>
  );
}
