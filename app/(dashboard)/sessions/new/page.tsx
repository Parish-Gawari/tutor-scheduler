"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionSchema } from "@/app/schemas/sessionSchema";
import { z } from "zod";
import { useRouter } from "next/navigation";

type SessionForm = z.infer<typeof sessionSchema>;

export default function NewSessionPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
  });

  async function onSubmit(values: SessionForm) {
    const payload = {
      ...values,
      startAt: `${values.date}T${values.startTime}:00.000Z`,
      endAt: `${values.date}T${values.endTime}:00.000Z`,
      students: [values.student],
    };

    const res = await fetch("/api/sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) router.push("/sessions");
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-4 font-semibold">Create Session</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Title</label>
          <input {...register("title")} className="w-full border p-2 rounded" />
          <p className="text-red-600 text-sm">{errors.title?.message}</p>
        </div>

        <div>
          <label>Tutor ID</label>
          <input {...register("tutor")} className="w-full border p-2 rounded" />
          <p className="text-red-600 text-sm">{errors.tutor?.message}</p>
        </div>

        <div>
          <label>Student ID</label>
          <input
            {...register("student")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-600 text-sm">{errors.student?.message}</p>
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            {...register("date")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-600 text-sm">{errors.date?.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Start Time</label>
            <input
              type="time"
              {...register("startTime")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-600 text-sm">{errors.startTime?.message}</p>
          </div>
          <div>
            <label>End Time</label>
            <input
              type="time"
              {...register("endTime")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-600 text-sm">{errors.endTime?.message}</p>
          </div>
        </div>

        <div>
          <label>Notes</label>
          <textarea
            {...register("notes")}
            className="w-full border p-2 rounded"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
