"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tutor: z.string().min(1, "Tutor ID required"),
  student: z.string().min(1, "Student ID required"),
  date: z.string().min(1, "Date required"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
  notes: z.string().optional(),
});

type SessionForm = z.infer<typeof sessionSchema>;

export default function EditSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
  });

  useEffect(() => {
    let mounted = true;
    async function fetchSession() {
      setInitialLoading(true);
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) {
          setErrorMsg("Failed to load session");
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        // normalize to form shape
        reset({
          title: data.title ?? "",
          tutor: data.tutor ? String(data.tutor) : "",
          student:
            data.students && data.students.length
              ? String(data.students[0])
              : "",
          date: data.startAt
            ? new Date(data.startAt).toISOString().slice(0, 10)
            : (data.date ?? ""),
          startTime: data.startAt
            ? new Date(data.startAt).toISOString().slice(11, 16)
            : (data.startTime ?? ""),
          endTime: data.endAt
            ? new Date(data.endAt).toISOString().slice(11, 16)
            : (data.endTime ?? ""),
          notes: data.notes ?? "",
        });
      } catch (err) {
        setErrorMsg("Error fetching session");
      } finally {
        if (mounted) setInitialLoading(false);
      }
    }
    fetchSession();
    return () => {
      mounted = false;
    };
  }, [id, reset]);

  async function onSubmit(values: SessionForm) {
    setLoading(true);
    setErrorMsg(null);

    // convert date+time to startAt/endAt if you prefer; server accepts whatever shape as earlier
    const payload = {
      title: values.title,
      tutor: values.tutor,
      students: [values.student],
      startAt: `${values.date}T${values.startTime}:00.000Z`,
      endAt: `${values.date}T${values.endTime}:00.000Z`,
      notes: values.notes,
    };

    try {
      const res = await fetch(`/api/sessions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.error || "Failed to update session");
        setLoading(false);
        return;
      }

      router.push("/sessions");
    } catch (e) {
      setErrorMsg("Network error");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this session? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.error || "Failed to delete");
        setLoading(false);
        return;
      }
      router.push("/sessions");
    } catch (e) {
      setErrorMsg("Network error");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return <div className="p-8">Loading session...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Edit Session</h1>

      {errorMsg && <div className="mb-3 text-red-600">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input {...register("title")} className="w-full border p-2 rounded" />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Tutor ID</label>
          <input {...register("tutor")} className="w-full border p-2 rounded" />
          {errors.tutor && (
            <p className="text-red-500 text-sm">{errors.tutor.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Student ID</label>
          <input
            {...register("student")}
            className="w-full border p-2 rounded"
          />
          {errors.student && (
            <p className="text-red-500 text-sm">{errors.student.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            {...register("date")}
            className="w-full border p-2 rounded"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Start Time</label>
            <input
              type="time"
              {...register("startTime")}
              className="w-full border p-2 rounded"
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">End Time</label>
            <input
              type="time"
              {...register("endTime")}
              className="w-full border p-2 rounded"
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm">{errors.endTime.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full border p-2 rounded h-24"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            {loading ? "Working..." : "Delete session"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/sessions")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
