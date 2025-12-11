"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema } from "@/app/schemas/resourceSchema";
import { z } from "zod";
import { useRouter } from "next/navigation";

type ResourceForm = z.infer<typeof resourceSchema>;

export default function NewResourcePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResourceForm>({
    resolver: zodResolver(resourceSchema),
  });

  async function onSubmit(values: ResourceForm) {
    const res = await fetch("/api/resources", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (res.ok) router.push("/resources");
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-4 font-semibold">Add Resource</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Name</label>
          <input {...register("name")} className="w-full border p-2 rounded" />
          <p className="text-red-600 text-sm">{errors.name?.message}</p>
        </div>

        <div>
          <label>URL</label>
          <input {...register("url")} className="w-full border p-2 rounded" />
          <p className="text-red-600 text-sm">{errors.url?.message}</p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Resource
        </button>
      </form>
    </div>
  );
}
