import { serverFetch } from "../../lib/serverFetch";
import ResourceActions from "../../../components/ResourceActions";
import { getSession } from "../../lib/auth";

export default async function ResourcesPage() {
  const session = await getSession();
  const role = session?.user?.role;

  // fetch resources safely
  const res = await serverFetch("/api/resources", { cache: "no-store" });
  const resources = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>

      <div className="grid gap-4">
        {resources.map((r: any) => (
          <div key={r._id} className="p-4 bg-white rounded shadow border">
            <h2 className="font-semibold text-xl">{r.title}</h2>
            <p className="text-gray-600">{r.description}</p>

            <a
              href={r.url}
              target="_blank"
              className="text-blue-600 underline mt-2 inline-block"
            >
              Open Link →
            </a>

            {/* interactive buttons */}
            <ResourceActions resourceId={r._id} role={role} />
          </div>
        ))}
      </div>
    </div>
  );
}
