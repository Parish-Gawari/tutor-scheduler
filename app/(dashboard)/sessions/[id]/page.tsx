import Link from "next/link";
import { getSession } from "@/app/lib/auth";

export default async function SessionView({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const role = session?.user?.role;

  const res = await fetch(`/api/sessions/${params.id}`, { cache: "no-store" });
  if (!res.ok) return <div className="p-8">Not found</div>;
  const s = await res.json();

  const isAdmin = role === "admin";
  const isTutor = role === "tutor";

  return (
    <div className="p-8">
      <div className="mb-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{s.title}</h1>
          <p className="text-sm text-gray-600">Tutor: {s.tutor?.name}</p>
        </div>

        <div className="flex gap-3">
          {(isAdmin || isTutor) && (
            <Link href={`/sessions/${s._id}/edit`} className="text-yellow-600">
              Edit
            </Link>
          )}
          {isAdmin && (
            <form action={`/api/sessions/${s._id}`} method="POST">
              <input type="hidden" name="_method" value="DELETE" />
              <button className="text-red-600">Delete</button>
            </form>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-700">{s.notes}</p>
      <div className="mt-6">
        <h3 className="font-medium">Students</h3>
        <ul className="list-disc ml-6">
          {s.students?.map((st: any) => (
            <li key={st._id}>
              {st.name} ({st.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
