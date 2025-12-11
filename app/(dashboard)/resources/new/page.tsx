"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateResource() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", url: "" });

  async function handleSubmit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/resources");
    else alert("Failed");
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Add Resource</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>URL (optional)</label>
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
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
