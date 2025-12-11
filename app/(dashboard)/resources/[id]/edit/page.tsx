"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function loadResource() {
      const res = await fetch(`/api/resources/${id}`);
      const data = await res.json();
      setResource(data);
      setName(data.name);
      setUrl(data.url);
      setLoading(false);
    }
    loadResource();
  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch(`/api/resources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url }),
    });

    if (res.ok) {
      router.push("/resources");
      router.refresh();
    } else {
      alert("Failed to update resource");
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
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">URL</label>
          <input
            className="border w-full p-2 rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
