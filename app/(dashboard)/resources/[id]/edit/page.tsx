"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  // 🔥 Fetch resource on mount
  useEffect(() => {
    if (!id) return;

    async function loadResource() {
      try {
        const res = await fetch(`/api/resources/${id}`, { cache: "no-store" });
        if (!res.ok) {
          alert("Failed to load resource.");
          return;
        }

        const data = await res.json();

        // Prefill
        setName(data.name || "");
        setUrl(data.url || "");
      } catch (err) {
        console.error(err);
        alert("Error loading resource");
      } finally {
        setLoading(false);
      }
    }

    loadResource();
  }, [id]);

  // 🔥 Save (PUT)
  async function handleSubmit(e: any) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/resources/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, url }),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/resources");
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Update failed (maybe permission issue)");
    }
  }

  if (loading) return <div className="p-8">Loading resource…</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Edit Resource</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            className="border w-full p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Resource name"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">URL</label>
          <input
            className="border w-full p-2 rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
