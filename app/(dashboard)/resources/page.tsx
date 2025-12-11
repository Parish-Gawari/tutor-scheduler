"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👉 Function 1: Load all resources
  async function loadResources() {
    setLoading(true);

    const res = await fetch("/api/resources", {
      cache: "no-store",
    });

    const data = await res.json();
    setResources(data);

    setLoading(false);
  }

  // 👉 Function 2: Delete a resource
  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this resource?");
    if (!ok) return;

    const res = await fetch(`/api/resources/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadResources(); // reload list
    } else {
      alert("Failed to delete resource");
    }
  }

  // 👉 Load resources on page load
  useEffect(() => {
    loadResources();
  }, []);

  if (loading) return <div className="p-8">Loading resources…</div>;

  // 👉 The UI
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Resources</h1>

        <Link
          href="/resources/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Resource
        </Link>
      </div>

      <div className="grid gap-4">
        {resources.map((r: any) => (
          <div key={r._id} className="border p-4 rounded bg-white shadow-sm">
            <h2 className="font-bold">{r.name}</h2>
            <p className="text-sm text-gray-600">{r.url}</p>

            <div className="flex gap-4 mt-4">
              <Link
                href={`/resources/${r._id}/edit`}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(r._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {resources.length === 0 && (
          <p className="text-gray-500">No resources found.</p>
        )}
      </div>
    </div>
  );
}
